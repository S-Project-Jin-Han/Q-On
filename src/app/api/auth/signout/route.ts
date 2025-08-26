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
  await supabase.auth.signOut({ scope }); // 리프레시 토큰 폐기
  return NextResponse.json({ ok: true });
}
