import 'server-only';
import { supabaseServerClient } from '@/shared/lib/supabase/supabase-server';
import { Role } from '@/shared/auth/types/role.types';
import type { SessionUser } from '@/shared/auth/types';
import type { Profile } from '@/shared/auth/types/profile.types';

/**
 * Next.js RLS 기반 profiles 테이블의 유저 정보를 반환합니다.
 * 비로그인 상태일 경우 "게스트용 안전 폴백"을 반환합니다(빈 uuid, role=undefined, isOnboarding=false).
 */
export async function getUserWithProfile(): Promise<{
  supabaseUser: SessionUser | null;
  profile: Profile | null;
}> {
  const supabase = await supabaseServerClient();

  // 1) 세션 확인 (비로그인 조기 반환)
  const { data: u, error: authErr } = await supabase.auth.getUser();
  if (authErr || !u?.user) {
    return {
      supabaseUser: null,
      profile: null,
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
      supabaseUser: u.user,
      profile: null,
    };
  }

  // 4) 병합 + 정규화
  const role = (profile.role ?? undefined) as Role;

  return {
    supabaseUser: u.user,
    profile: {
      uuid: profile.uuid,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      role,
      isOnboarding: !!profile.isOnboarding,
      createdAt: profile.createdAt ?? undefined,
    },
  };
}
