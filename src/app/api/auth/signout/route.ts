import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServerClient } from '@/shared/lib/supabase/supabase-server';

/**
 * POST /api/auth/signout
 * 현재 로그인된 세션을 제거 (리프레시, 엑세스 토큰) 하고 supabase 상 세션 정보를 signout 호출
 * 엑세스 토큰은
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!origin || new URL(origin).origin !== new URL(req.url).origin) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const scope =
    (req.headers.get('x-scope') as 'local' | 'global' | 'others') ?? 'local';

  const supabase = await supabaseServerClient();

  try {
    // Supabase의 응답에서 error 객체를 받아옵니다.
    const { error } = await supabase.auth.signOut({ scope });

    // 만약 Supabase가 에러를 반환했다면,
    if (error) {
      console.error('로그아웃 실패:', error);
      // 클라이언트에게 "실패했다"고 명확히 알려줍니다 (상태 코드 500).
      return NextResponse.json(
        { ok: false, error: 'signout_failed' },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // 에러가 없을 때만 성공 응답을 보냅니다.
    return NextResponse.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e) {
    // supabase.auth.signOut 외의 예측 못한 에러가 발생했을 때를 대비합니다.
    console.error('내부 오류:', e);
    return NextResponse.json(
      { ok: false, error: 'internal_error' },
      { status: 500 }
    );
  }
}
