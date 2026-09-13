import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────
// ЄДИНЕ ДЖЕРЕЛО ПРАВДИ ДЛЯ АВТОРИЗАЦІЇ
//
// Раніше існувало два незалежні стори: цей (для звичайних
// користувачів) і admin/store/authStore.ts (для адмінки), кожен
// зі своїм ключем localStorage ('waygo_token'/'waygo-auth' проти
// 'token'/'auth-storage'). Через це той самий бекенд-логін
// (в тому числі логін через Google) записувався лише в один зі
// сторів, а ProtectedRoute адмінки читав інший — звідси
// нескінченні редіректи на /login.
//
// Тепер увесь застосунок (публічна частина + /admin) використовує
// цей стор. admin/store/authStore.ts лишається лише тонким
// реекспортом (див. коментар у тому файлі), щоб не переписувати
// імпорти в усьому admin/-коді.
// ─────────────────────────────────────────────────────────────

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

// Роль, яка вважається "адмінською" на фронтенді, має точно
// відповідати [Authorize(Roles = "...")] на Admin-контролерах
// бекенду (Controllers/Admin/*). Наразі це "Admin" та "Manager".
const ADMIN_ROLES = ['Admin', 'Manager'];
const isAdminUser = (roles: string[]) =>
  roles.some((role) => ADMIN_ROLES.includes(role));

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      _hasHydrated: false,

      setAuth: (token, user) => {
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: isAdminUser(user.roles),
        });
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false, isAdmin: false });
      },

      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      // Один ключ localStorage на весь застосунок.
      name: 'waygo-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);