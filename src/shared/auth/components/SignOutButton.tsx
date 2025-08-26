'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore'; // { reset } 포함

type Props = {
  scope?: 'local' | 'global' | 'others'; // 기본: local
  refreshServerUI?: boolean; // 서버 컴포넌트도 즉시 반영할지(기본 false)
  className?: string;
  children?: React.ReactNode; // 버튼 라벨 커스터마이즈
};

export default function SignOutButton({
  scope: _scope = 'local',
  refreshServerUI = false,
  className,
  children = '로그아웃',
}: Props) {
  const reset = useAuthStore((s) => s.reset); // supabaseUser, profile, hydrated 초기화
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onLogout = useCallback(async () => {
    if (pending) return;
    setPending(true);

    // 1) 선언적: 상태 먼저 비우기 → UI 즉시 반영
    reset();

    // 2) 서버 세션 폐기(쿠키/리프레시 토큰)
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
        // headers: { 'x-scope': scope },
      });
    } catch {
      // 실패해도 다음 상호작용/재진입 시 /api/auth/session 으로 정합성 회복 가능
    }

    // 3) 멀티 탭 동기화
    try {
      const bc = new BroadcastChannel('auth');
      bc.postMessage({ type: 'LOGOUT' });
      bc.close();
    } catch {}

    // 4) 서버 컴포넌트도 지금 즉시 반영
    if (refreshServerUI) router.refresh();

    setPending(false);
  }, [pending, reset, refreshServerUI, router]);

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={pending}
      aria-disabled={pending}
      className={
        className ??
        'rounded-lg px-4 py-2 bg-gray-200 hover:bg-gray-300 active:scale-95 transition'
      }
    >
      {pending ? '로그아웃 중…' : children}
    </button>
  );
}
