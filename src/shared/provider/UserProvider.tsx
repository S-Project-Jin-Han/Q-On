'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { SessionUser } from '@/shared/auth/types/sessionUser';

type Ctx = { user: SessionUser };

const UserContext = createContext<Ctx | undefined>(undefined);

/** 서버에서 주입된 유저 스냅샷을 전역으로 노출(읽기 전용) */
export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: SessionUser;
  children: React.ReactNode;
}) {
  const value = useMemo<Ctx>(() => ({ user: initialUser }), [initialUser]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/** 어디서든 전역 유저 정보에 접근 */
export function useUser(): SessionUser {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx.user;
}
