import 'server-only';
import { supabaseServerClient } from '@/shared/lib/supabase/supabase-server';
import { Role } from '@/shared/auth/types/role';

export type SessionUser = {
  isLoggedIn: boolean;
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
      isLoggedIn: false,
      uuid: '',
      email: undefined,
      name: null,
      avatarUrl: null,
      role: undefined,
      isOnboarding: true,
    };
  }

  const userId = u.user.id;

  // 2) 본인 프로필 조회 (RLS 하)
  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('uuid, role, "isOnboarding", "createdAt", email, name, avatarUrl')
    .eq('uuid', userId)
    .single();

  // 3) 에러/미존재 → 안전 폴백
  if (profErr || !profile) {
    return {
      isLoggedIn: true,
      uuid: userId,
      email: undefined,
      name: null,
      avatarUrl: null,
      role: undefined,
      isOnboarding: false,
    };
  }

  // 4) 병합 + 정규화
  const role = (profile.role ?? undefined) as Role;

  return {
    isLoggedIn: true,
    uuid: profile.uuid,
    email: profile.email,
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    role,
    isOnboarding: !!profile.isOnboarding,
    createdAt: profile.createdAt ?? undefined,
  };
}
