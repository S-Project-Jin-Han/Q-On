'use client';

import Image from 'next/image';
import { supabaseBrowser } from '@/shared/lib/supabase/supabase-browser';

/**
 * Kakao OAuth login button 컴포넌트
 * @returns JSX.Element - Kakao login button with official styling
 * @example
 * ```tsx
 * <KakaoLoginButton />
 * ```
 */
export default function KakaoLoginButton() {
  const supabase = supabaseBrowser;

  const handleKakaoLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Kakao login error:', error.message);
      }
    } catch (error) {
      console.error('Unexpected error during Kakao login:', error);
    }
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="transition-transform hover:scale-105 active:scale-95"
      type="button"
      aria-label="카카오 로그인"
    >
      <Image
        src="/kakao_login_medium_narrow.png"
        alt="카카오 로그인"
        width={300}
        height={45}
        priority
        className="rounded-lg"
      />
    </button>
  );
}
