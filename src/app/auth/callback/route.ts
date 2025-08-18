import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * OAuth 콜백 라우트 핸들러
 * 인증 코드를 처리하고 온보딩 페이지로 리다이렉트합니다
 * @param request - 인증 코드가 포함된 Next.js 요청 객체
 * @returns 온보딩 페이지로 리다이렉트되는 Response
 * @example
 * ```
 * GET /auth/callback?code=auth_code_here
 * Redirect: /onboarding
 * ```
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/onboarding';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Server Component에서 setAll이 호출될 수 있음
              // middleware에서 세션 새로고침이 있다면 무시 가능
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 에러 발생 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login`);
}
