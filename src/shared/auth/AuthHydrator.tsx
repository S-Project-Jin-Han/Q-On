'use client';

import { useEffect } from 'react';
import { useAuthStore, type SessionUser, type Profile } from '@/shared/store/authStore';
import { supabaseBrowser } from '@/shared/lib/supabase/supabase-browser';

// Update Props type
type Props = { initialUser: { supabaseUser: SessionUser | null; profile: Profile | null } };

export function AuthHydrator({ initialUser }: Props) {
  const { hydrated, setSupabaseUser, setProfile, markHydrated } = useAuthStore();

  // 최초 1회 서버 스냅샷을 주입 (HMR/중복 방지)
  useEffect(() => {
    if (!hydrated) {
      setSupabaseUser(initialUser.supabaseUser);
      setProfile(initialUser.profile);
      markHydrated();
    }
  }, [hydrated, initialUser, setSupabaseUser, setProfile, markHydrated]);

  // onAuthStateChange로 이벤트 동기화(로그인/로그아웃/토큰 갱신)
  useEffect(() => {
    const supabase = supabaseBrowser;

    const { data: sub } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        setSupabaseUser(null);
        setProfile(null);
        return;
      }
      if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        try {
          const res = await fetch('/api/auth/session', {
            cache: 'no-store',
            credentials: 'include',
          });
          const data = await res.json();
          setSupabaseUser(data.user ?? null);
          setProfile(data.profile ?? null);
        } catch (error) {
          console.error("Error fetching user or profile:", error);
        }
      }
    });

    // 멀티탭 동기화(선택)
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('auth');
      bc.onmessage = (e) => {
        if (e.data?.type === 'LOGOUT') {
          setSupabaseUser(null);
          setProfile(null);
        }
      };
    } catch {}

    return () => {
      sub.subscription.unsubscribe();
      try {
        bc?.close();
      }
    };
  }, [setSupabaseUser, setProfile]);

  return null;
}