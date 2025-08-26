import { NextResponse } from 'next/server';
import { getUserWithProfile } from '@/shared/auth/getUserWithProfile';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/auth/session
 * Supabase 세션을 통해 유저의 Profiles 컬럼을 받아오는 라우트 핸들러
 */
export async function GET() {
  try {
    const { supabaseUser, profile } = await getUserWithProfile();

    return NextResponse.json(
      { supabaseUser, profile },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
