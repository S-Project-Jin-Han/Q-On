'use client';

import { useAuthStore } from '@/shared/store/authStore';
import { useShallow } from 'zustand/react/shallow';
import KakaoLoginButton from '@/shared/auth/components/KakaoLoginButton';
import SignOutButton from '@/shared/auth/components/SignOutButton';

export default function UserInfo() {
  const { profile, hydrated } = useAuthStore(
    useShallow((s) => ({ profile: s.profile, hydrated: s.hydrated }))
  );

  // 초기 1회 주입 전: 스켈레톤/플레이스홀더 렌더
  if (!hydrated) {
    return (
      <div className="min-h-screen grid place-items-center p-8">
        <div className="animate-pulse text-gray-400">로딩 중…</div>
      </div>
    );
  }

  // profile === null 이면 게스트로 표시
  const u = profile; // Profile | null
  const isLoggedIn = !!u;

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>{u?.email ?? 'Guest'}</h1>
        <h1>{u?.name ?? 'Guest'}</h1>
        <h1>{u?.avatarUrl ?? 'Guest'}</h1>
        <h1>{isLoggedIn ? 'Logged In' : 'Logged Out'}</h1>
        <h1>{u?.isOnboarding ? 'Onboarding' : 'Not Onboarding'}</h1>
        <h1>{u?.role ?? 'undefined'}</h1>
        <h1>{u?.createdAt ?? 'Guest'}</h1>
        {isLoggedIn === false ? <KakaoLoginButton /> : <SignOutButton />}
      </main>
    </div>
  );
}
