import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userId: number | null;
  signin: (data: SigninData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  createGame: (data: CreateGameData) => Promise<void>;
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

interface CreateGameData {
  title: string,
  description: string,
  genreId: number,
  platformIds: number[],
  image?: File | null,
  price: number,
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

      createGame: async () => {
        throw new Error('createGame not initialized');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Assign createGame AFTER the store is created
useAuthStore.setState({
  createGame: async ({ title, description, genreId, platformIds, image, price }) => {
    const { token } = useAuthStore.getState();
    if (!token) throw new Error('Unauthorized');

    const res = await fetch(`/api/v1/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify({ title, description, genreId, platformIds, price }),
    });

    if (!res.ok) throw new Error('Game creation failed');
    const game = await res.json();
    const gameId = game.gameId;

    if (image) {
      let contentType = '';
      if (image.type === 'image/png') contentType = 'image/png';
      else if (image.type === 'image/jpeg') contentType = 'image/jpeg';
      else if (image.type === 'image/gif') contentType = 'image/gif';
      else throw new Error('Unsupported image type');

      const uploadRes = await fetch(`/api/v1/games/${gameId}/image`, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
          'X-Authorization': token,
        },
        body: image,
      });

      if (!uploadRes.ok) throw new Error('Image upload failed');
    }
  }
});
