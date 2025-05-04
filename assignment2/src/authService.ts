import { useAuthStore } from './authStore';


export const login = async (email: string, password: string) => {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) throw new Error('Login failed');
    return await res.json(); // contains token + userId
};
  
export const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const res = await fetch('/api/v1/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
  
    return await res.json(); // same: token + userId
};
  
export const uploadProfileImage = async (
    userId: number,
    token: string,
    file: File
  ) => {
    const contentType = file.type;
    const res = await fetch(`/api/v1/users/${userId}/image`, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'X-Authorization': token,
      },
      body: file,
    });
  
    if (!res.ok) throw new Error('Image upload failed');
};

export const logout = async () => {
    const token = useAuthStore.getState().token;
    if (token) {
      await fetch('/api/v1/users/logout', {
        method: 'POST',
        headers: { 'X-Authorization': token },
      });
    }
    useAuthStore.getState().clearAuth();
};
  