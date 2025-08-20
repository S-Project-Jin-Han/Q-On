'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { envServer } from '@/shared/lib/env.server';

export const supabaseServerClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    envServer.NEXT_PUBLIC_SUPABASE_URL,
    envServer.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
            // 미들웨어에서 세션 갱신 시 호출되는 메서드
          }
        },
      },
    }
  );
};

export const supabaseServerAdmin = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    envServer.NEXT_PUBLIC_SUPABASE_URL,
    envServer.SUPABASE_SERVICE_ROLE_KEY,
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
            // 미들웨어에서 세션 갱신 시 호출되는 메서드
          }
        },
      },
    }
  );
};
