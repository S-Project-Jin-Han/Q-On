import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * OAuth 콜백 라우트 핸들러
 *
 * 1. URL 쿼리스트링에서 `code`를 추출.
 * 2. Supabase의 `exchangeCodeForSession`을 호출하여 인증 코드를 세션으로 교환.
 * 3. 인증 성공 후 `auth.users.id`를 기반으로 `profiles` 테이블에서 유저 프로필을 조회.
 *    - 프로필이 없으면(신규 유저): 프로필 row를 생성하고 `/onboarding` 페이지로 리다이렉트.
 *    - 프로필이 있으면(기존 유저): 메인 페이지(`/`)로 리다이렉트.
 * 4. 인증 실패 또는 예외 발생 시 `/login` 페이지로 리다이렉트.
 *
 * @param request - OAuth 인증 코드가 포함된 Next.js `NextRequest` 객체
 * @returns `NextResponse` - 유저 상태에 따라 `/onboarding`, `/`, `/login` 중 하나로 리다이렉트
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

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
              // 에러 처리
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // 프로필 확인 및 생성
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('uuid', data.user.id)
        .single();

      if (!profile) {
        // 신규 유저 - 프로필 생성
        await supabase.from('profiles').insert({
          uuid: data.user.id,
          isOnboarding: true, // 온보딩 필요
          name: data.user.user_metadata?.full_name || null,
        });

        return NextResponse.redirect(`${origin}/onboarding`);
      } else {
        // 기존 유저 - 메인 페이지로
        return NextResponse.redirect(`${origin}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
