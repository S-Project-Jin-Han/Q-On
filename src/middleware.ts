import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Role } from '@/shared/auth/types/role.types';
import { envServer } from '@/shared/lib/env.server';

/** 공개 경로: 루트, 로그인, /public/** */
const PUBLIC_PATHS = [/^\/$/, /^\/login$/, /^\/public(\/|$)/];

/** 인증/권한 가드 대상 prefix */
const AUTH_PATHS = [
  /^\/app(\/|$)/,
  /^\/member(\/|$)/,
  /^\/owner(\/|$)/,
  /^\/host(\/|$)/,
  /^\/admin(\/|$)/,
];

/** 경로별 허용 역할 */
const ROLE_GUARDS: Array<{ pattern: RegExp; roles: Role[] }> = [
  { pattern: /^\/member(\/|$)/, roles: ['MEMBER', 'OWNER', 'HOST', 'ADMIN'] },
  { pattern: /^\/owner(\/|$)/, roles: ['OWNER', 'ADMIN'] },
  { pattern: /^\/host(\/|$)/, roles: ['OWNER', 'HOST', 'ADMIN'] },
  { pattern: /^\/admin(\/|$)/, roles: ['ADMIN'] },
];

/** res(NextResponse.next)에 기록된 Set-Cookie를 redirect 응답으로 전파 */
function forwardCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((c) => {
    to.cookies.set(c.name, c.value, {
      path: c.path,
      domain: c.domain,
      httpOnly: c.httpOnly,
      sameSite: c.sameSite,
      secure: c.secure,
      expires: c.expires,
      maxAge: c.maxAge,
    });
  });
  return to;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next(); // Supabase가 여기에 쿠키를 씀(세션 갱신용)
  const { pathname, search } = req.nextUrl;

  // 0) 공개 경로는 통과
  if (PUBLIC_PATHS.some((re) => re.test(pathname))) return res;

  // 1) 보호 대상이 아니면 통과
  const needsAuth = AUTH_PATHS.some((re) => re.test(pathname));
  if (!needsAuth) return res;

  // 2) Supabase SSR 클라이언트 (anon 키만! Service Role 금지)
  const supabase = createServerClient(
    envServer.NEXT_PUBLIC_SUPABASE_URL!,
    envServer.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 요청 쿠키 읽기
        getAll: () => req.cookies.getAll(),
        // 세션 갱신 시 응답 쿠키에 기록
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 3) 세션 확인 (여기서 만료 시 쿠키 갱신이 res에 기록됨)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const login = req.nextUrl.clone();
    login.pathname = '/login';
    login.searchParams.set('redirect', pathname + search);
    // ⬇ 갱신된 세션 쿠키를 리다이렉트 응답으로 전파
    return forwardCookies(res, NextResponse.redirect(login));
  }

  // 4) 역할 가드가 필요한 경로면 role 최소 조회 (RLS: 본인 row만 허용)
  const guard = ROLE_GUARDS.find((g) => g.pattern.test(pathname));
  if (guard) {
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('role')
      .eq('uuid', user.id)
      .single();

    const role = (profile?.role ?? undefined) as Role;
    const allowed = role ? guard.roles.includes(role) : false;

    if (profErr || !allowed) {
      const denied = req.nextUrl.clone();
      denied.pathname = '/403';
      // ⬇ 쿠키 전파 필수(세션 갱신 누락 방지)
      return forwardCookies(res, NextResponse.redirect(denied));
    }
  }

  // 5) 통과 (세션 갱신 쿠키 유지)
  return res;
}

/** 미들웨어 적용 경로(정적 파일 등은 자동 제외) */
export const config = {
  matcher: [
    '/app/:path*',
    '/member/:path*',
    '/owner/:path*',
    '/host/:path*',
    '/admin/:path*',
    '/login', // 공개지만 세션 리프레시 매칭 허용
    '/public/:path*', // 공개
  ],
};
