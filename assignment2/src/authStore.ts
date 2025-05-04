import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userId: number | null;
  signin: (data: SigninData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearAuth: () => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage?: File | null;
}

interface SigninData {
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,

      signin: async ({ email, password }) => {
        const res = await fetch('/api/v1/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        set({ token: data.token, userId: data.userId });
      },

      register: async ({ firstName, lastName, email, password, profileImage }) => {
        const res = await fetch('/api/v1/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, password }),
        });

        if (!res.ok) throw new Error('Registration failed');

        const regData = await res.json();

        const signin = await fetch('/api/v1/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!signin.ok) throw new Error('Registration failed');

        const signInData = await signin.json();

        set({ token: signInData.token, userId: signInData.userId });

        // You can enable this block if you want image upload
        console.log(profileImage);
        if (profileImage) {
          const contentType = profileImage.type;

          await fetch(`/api/v1/users/${signInData.userId}/image`, {
            method: 'PUT',
            headers: {
              'Content-Type': contentType,
              'X-Authorization': signInData.token,
            },
            body: profileImage,
          });
        }
      },

      logout: () => {
        set({ token: null, userId: null });
        localStorage.removeItem('auth-storage');
      },      

      clearAuth: () => {
        set({ token: null, userId: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
