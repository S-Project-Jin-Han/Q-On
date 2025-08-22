'use client';

import { create } from 'zustand';
import type { Role } from '@/shared/auth/types/role';

export type SessionUser = {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  role?: Role;
  provider?: string | null;
};

type AuthState = {
  user: SessionUser | null;
  hydrated: boolean; // 초기 1회 주입(Hydration) 여부
  setUser: (u: SessionUser | null) => void;
  markHydrated: () => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  setUser: (u) => set({ user: u }),
  markHydrated: () => set({ hydrated: true }),
  reset: () => set({ user: null, hydrated: false }),
}));
