import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServerClient } from '@/shared/lib/supabase/supabase-server';

export async function POST(req: NextRequest) {
  // (선택) 같은 오리진만 허용하는 간단한 CSRF 방어
  const origin = req.headers.get('origin');
  if (!origin || new URL(origin).origin !== new URL(req.url).origin) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const scope =
    (req.headers.get('x-scope') as 'local' | 'global' | 'others') ?? 'local';

  const cookieStore = cookies();
  const supabase = await supabaseServerClient();
  await supabase.auth.signOut({ scope }); // 리프레시 토큰 폐기
  return NextResponse.json({ ok: true });
}
