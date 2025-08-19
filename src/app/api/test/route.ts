export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { supabaseResponse } from "@/shared/lib/response";
import { supabaseServerAdmin } from "@/shared/lib/supabase/supabase-server";

type Role = "ADMIN" | "OWNER" | "HOST" | "MEMBER";
type Profile = {
  id: number;
  kakaoId: string | null;
  uuid?: string;
  name: string | null;
  role: Role | null;
  createdAt: string;
  isOnboarding: boolean;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const size = Math.max(1, Math.min(200, Number(searchParams.get("size") ?? 50)));
  const from = (page - 1) * size;
  const to = from + size - 1;

  const supabase = await supabaseServerAdmin();

  const result = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("id", { ascending: true })
    .range(from, to);

  const { body, httpStatus } = supabaseResponse<Profile>(result, {
    pagination: { page, size },
    messageOnSuccess: "Fetched profiles",
    notFoundAsEmpty: true,
  });

  return NextResponse.json(body, { status: httpStatus });
}
