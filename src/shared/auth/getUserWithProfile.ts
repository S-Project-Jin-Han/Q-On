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
 * Next.js 서버 측에서 RLS기반 profiles 테이블과 Supabase Auth API 데이터를 조합한 유저정보를 반환합니다.
 * 유저 정보는 다음과 같습니다.
 *
 * - uuid: 유저 고유 ID
 * - email: 유저 이메일
 * - name: 유저 이름
 * - avatarUrl: 유저 프로필 이미지 URL
 * - role: 유저 역할
 * - isOnboarding: 유저 온보딩 여부
 * - createdAt: 유저 생성일
 *
 * 비로그인 상태일 경우 { kind: 'guest' }를 반환합니다.
 *
 * @returns 유저 정보
 */
export async function getUserWithProfile(): Promise<SessionUser> {
  const supabase = await supabaseServerClient();

  const { data: u } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('uuid, role, "isOnboarding", "createdAt", email, "displayName", "avatarUrl", name')
    .eq('uuid', u?.user?.id)
    .single();

  if (!profile) {
    return {
      uuid: u?.user?.id ?? '',
      email: u?.user?.email ?? '',
      name: null,
      avatarUrl: null,
      role: 'MEMBER',
      isOnboarding: false,
    };
  }

  return {
    uuid: profile.uuid,
    email: profile.email ?? u?.user?.email ?? '',
    name: profile.displayName ?? profile.name ?? null,
    avatarUrl: profile.avatarUrl ?? null,
    role: (profile.role ?? 'MEMBER') as Role,
    isOnboarding: !!profile.isOnboarding,
    createdAt: profile.createdAt ?? undefined,
  };
}
