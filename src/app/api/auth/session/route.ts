import { NextResponse } from 'next/server';
import { getUserWithProfile } from '@/shared/auth/getUserWithProfile'; // Import the updated function
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
