import 'server-only';
import { supabaseServerClient } from '@/shared/lib/supabase/supabase-server';
import { Role } from '@/shared/auth/types/role';

export type SessionUser = {
  uuid: string;
  email?: string;
  name?: string | null;
  avatarUrl?: string | null;
  role: Role;
  isOnboarding: boolean;
  createdAt?: string;
};

/**
 * Next.js 서버에서 세션 사용자(auth.user) + RLS 기반 profiles를 조합해 유저 정보를 반환합니다.
 * 비로그인 상태일 경우 "게스트용 안전 폴백"을 반환합니다(빈 uuid, role=MEMBER, isOnboarding=false).
 */
export async function getUserWithProfile(): Promise<SessionUser> {
  const supabase = await supabaseServerClient();

  // 1) 세션 확인 (비로그인 조기 반환)
  const { data: u, error: authErr } = await supabase.auth.getUser();
  if (authErr || !u?.user) {
    return {
      uuid: '',
      email: undefined,
      name: null,
      avatarUrl: null,
      role: 'MEMBER',
      isOnboarding: false,
    };
  }

  const userId = u.user.id;
  const authEmail = u.user.email ?? undefined;

  // 2) 본인 프로필 조회 (RLS 하)
  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('uuid, role, "isOnboarding", "createdAt", email, "displayName", "avatarUrl", name')
    .eq('uuid', userId)
    .single();

  // 3) 에러/미존재 → 안전 폴백
  if (profErr || !profile) {
    // 필요 시 서버 로깅: console.error("profiles fetch error:", profErr);
    return {
      uuid: userId,
      email: authEmail,
      name: null,
      avatarUrl: null,
      role: 'MEMBER',
      isOnboarding: false,
    };
  }

  // 4) 병합 + 정규화
  const role = (profile.role ?? 'MEMBER') as Role;
  return {
    uuid: profile.uuid,
    email: profile.email ?? authEmail,
    name: profile.displayName ?? profile.name ?? null,
    avatarUrl: profile.avatarUrl ?? null,
    role,
    isOnboarding: !!profile.isOnboarding,
    createdAt: profile.createdAt ?? undefined,
  };
}
