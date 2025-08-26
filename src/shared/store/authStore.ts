'use client';

import { create } from 'zustand';
import type { AuthState } from '@/shared/auth/types';

export const useAuthStore = create<AuthState>((set) => ({
  supabaseUser: null,
  profile: null,
  hydrated: false,
  setSupabaseUser: (user) => set({ supabaseUser: user }),
  setProfile: (profile) => set({ profile }),
  markHydrated: () => set({ hydrated: true }),
  reset: () => set({ supabaseUser: null, profile: null, hydrated: false }),
}));
