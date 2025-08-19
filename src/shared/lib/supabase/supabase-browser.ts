import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/shared/lib/env';

export const supabaseBrowser = createBrowserClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabaseBrowserAdmin = createBrowserClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);
