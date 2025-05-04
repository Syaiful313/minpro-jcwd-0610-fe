import { User } from "@/types/user";
import { access } from "fs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  user: User | null;
  accessToken: string | null;
  onAuthSuccess: ({
    user,
    accessToken,
  }: {
    user: User;
    accessToken: string;
  }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      onAuthSuccess: (payload) => {
        set((state) => ({ ...state, ...payload }));
      },
      clearAuth: () => {
        set(() => ({ user: null, accessToken: null }));
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    },
  ),
);
