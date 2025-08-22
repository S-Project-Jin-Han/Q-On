'use client';

import { create } from 'zustand';
import type { SessionUser } from '@/shared/auth/types/sessionUser'; // This is now Supabase User
import type { Profile } from '@/shared/auth/types/profile';

type AuthState = {
  supabaseUser: SessionUser | null; // Renamed from 'user' to 'supabaseUser'
  profile: Profile | null;
  hydrated: boolean;
  setSupabaseUser: (user: SessionUser | null) => void; // Renamed from 'setUser'
  setProfile: (profile: Profile | null) => void;
  markHydrated: () => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  supabaseUser: null,
  profile: null,
  hydrated: false,
  setSupabaseUser: (user) => set({ supabaseUser: user }),
  setProfile: (profile) => set({ profile }),
  markHydrated: () => set({ hydrated: true }),
  reset: () => set({ supabaseUser: null, profile: null, hydrated: false }),
}));

// --- 타입 재사용 ---
// Keep these exports as they are used elsewhere
export type { SessionUser } from '@/shared/auth/types/sessionUser';
export type { Role } from '@/shared/auth/types/role';
export type { Profile } from '@/shared/auth/types/profile';