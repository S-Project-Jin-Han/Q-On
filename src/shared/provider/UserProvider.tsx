'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { SessionUser } from '@/shared/auth/types/sessionUser'; // Supabase User
import type { Profile } from '@/shared/auth/types/profile';

// Update Ctx type to provide Profile
type Ctx = { profile: Profile | null };

const UserContext = createContext<Ctx | undefined>(undefined);

/** 서버에서 주입된 유저 스냅샷을 전역으로 노출(읽기 전용) */
export function UserProvider({
  initialUser, // Update initialUser type
  children,
}: {
  initialUser: { supabaseUser: SessionUser | null; profile: Profile | null };
  children: React.ReactNode;
}) {
  // Provide profile to the context
  const value = useMemo<Ctx>(() => ({ profile: initialUser.profile }), [initialUser.profile]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/** 어디서든 전역 유저 정보에 접근 */
export function useUser(): Profile | null { // Update return type
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx.profile;
}