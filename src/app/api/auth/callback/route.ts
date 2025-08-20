import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/shared/lib/supabase/supabase-server';

/**
 * OAuth 콜백 라우트 핸들러
 *
 * 1. URL 쿼리스트링에서 `code`를 추출.
 * 2. Supabase의 `exchangeCodeForSession`을 호출하여 인증 코드를 세션으로 교환.
 * 3. 인증 성공 후 `profiles` 테이블에서 유저 프로필을 조회.
 *    - `isOnboarding: true` → `/onboarding`으로 리다이렉트
 *    - `isOnboarding: false` → `/` 메인 페이지로 리다이렉트
 * 4. 인증 실패 또는 예외 발생 시 `/login`으로 리다이렉트
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await supabaseServerClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // 프로필 확인
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, isOnboarding')
        .eq('uuid', data.user.id)
        .single();

      if (profileError || !profile) {
        // 프로필이 없거나 조회 실패 시 로그인 페이지로
        return NextResponse.redirect(`${origin}/login`);
      }

      if (profile.isOnboarding) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }

      return NextResponse.redirect(`${origin}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
