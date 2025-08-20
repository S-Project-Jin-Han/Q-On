import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/shared/lib/supabase/supabase-server';
import type { Role } from '@/shared/auth/types/role';

// 공개 경로(가드 제외)
/**
 * 루트 경로
 * 로그인 경로
 * 공개 경로
 */
const PUBLIC_PATHS = [/^\/$/, /^\/login$/, /^\/public(\/|$)/];

// 인증/권한 가드 대상
const AUTH_PATHS = [
  /^\/app(\/|$)/,
  /^\/member(\/|$)/,
  /^\/owner(\/|$)/,
  /^\/host(\/|$)/,
  /^\/admin(\/|$)/,
];

const ROLE_GUARDS: Array<{ pattern: RegExp; roles: Role[] }> = [
  { pattern: /^\/member(\/|$)/, roles: ['MEMBER', 'OWNER', 'HOST', 'ADMIN'] },
  { pattern: /^\/owner(\/|$)/, roles: ['OWNER', 'ADMIN'] },
  { pattern: /^\/host(\/|$)/, roles: ['OWNER', 'HOST', 'ADMIN'] },
  { pattern: /^\/admin(\/|$)/, roles: ['ADMIN'] },
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname, search } = req.nextUrl;

  // 공개 경로는 통과
  if (PUBLIC_PATHS.some((re) => re.test(pathname))) return res;

  // 보호 대상이 아니면 통과
  const needsAuth = AUTH_PATHS.some((re) => re.test(pathname));
  if (!needsAuth) return res;

  // Supabase SSR 클라이언트 (anon 키만!)
  const supabase = await supabaseServerClient();

  // 1) 세션 확인
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const login = req.nextUrl.clone();
    login.pathname = '/login';
    login.searchParams.set('redirect', pathname + search);
    return NextResponse.redirect(login);
  }

  // 2) 역할 가드가 필요한 경로면 role 조회 (RLS로 본인 row만 허용되어 있어야 함)
  const guard = ROLE_GUARDS.find((g) => g.pattern.test(pathname));
  if (guard) {
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('role')
      .eq('uuid', user.id)
      .single();

    const role = (profile?.role ?? 'MEMBER') as Role;

    if (profErr || !guard.roles.includes(role)) {
      const denied = req.nextUrl.clone();
      denied.pathname = '/403';
      return NextResponse.redirect(denied);
    }
  }

  return res;
}

// 미들웨어 적용 경로(정적 파일 등은 자동 제외)
// 필요 라우트만 지정해서 성능/비용 최적화
export const config = {
  matcher: [
    '/app/:path*',
    '/member/:path*',
    '/owner/:path*',
    '/host/:path*',
    '/admin/:path*',
    '/login', // 공개지만 세션 리프레시를 위해 매칭해도 OK (상단에서 즉시 통과)
    '/public/:path*', // 공개
  ],
};
