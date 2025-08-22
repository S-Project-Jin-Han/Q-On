import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServerClient } from '@/shared/lib/supabase/supabase-server';
import { getUserWithProfile } from '@/shared/auth/getUserWithProfile'; // Import the updated function

export async function GET() {
  const cookieStore = cookies();
  const supabase = await supabaseServerClient();

  const { supabaseUser, profile } = await getUserWithProfile();

  return NextResponse.json({ user: supabaseUser, profile: profile });
}
