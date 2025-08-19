import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supaResponse } from "@/shared/lib/response";

// 도메인 타입 (DB 컬럼에 맞춰서 정의)
type Role = "ADMIN" | "OWNER" | "HOST" | "MEMBER";
type Profile = {
  id: number;
  kakaoId: string | null;
  name: string | null;
  role: Role | null;
  createdAt: string; // Supabase는 ISO 문자열로 반환
  isOnboarding: boolean;
};

export async function GET(req: NextRequest) {
  // pagination 파라미터 파싱
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const size = Math.max(1, Math.min(200, Number(searchParams.get("size") ?? 50))); // 상한 200
  const from = (page - 1) * size;
  const to = from + size - 1;

  // Supabase SSR 클라이언트 (쿠키 연동)
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs) =>
          cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  );

  // 목록 조회 + 전체 카운트
  const result = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("id", { ascending: true })
    .range(from, to); // 타입: PostgrestResponse<Profile>

  // 너가 만든 변환기(supaResponse)로 우리 공통 포맷으로 변환
  const { body, httpStatus } = supaResponse<Profile>(result, {
    pagination: { page, size }, // meta 자동 계산
    messageOnSuccess: "Fetched profiles",
    notFoundAsEmpty: true, // 결과 0건이어도 200 + []
  });

  return NextResponse.json(body, { status: httpStatus });
}
