import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  fullName: string | null;
  roles: string[];
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      setAuth: (token, user) => {
        localStorage.setItem('token', token);
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: user.roles.includes('Admin') || user.roles.includes('Manager'),
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false, isAdmin: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
