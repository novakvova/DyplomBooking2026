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
  _hasHydrated: boolean;

  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setHasHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      _hasHydrated: false,

      setAuth: (token, user) => {
        localStorage.setItem('waygo_token', token);
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: user.roles.includes('Admin') || user.roles.includes('Manager'),
        });
      },

      logout: () => {
        localStorage.removeItem('waygo_token');
        set({ token: null, user: null, isAuthenticated: false, isAdmin: false });
      },

      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: 'waygo-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);