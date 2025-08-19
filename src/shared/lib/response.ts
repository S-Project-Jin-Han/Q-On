// src/lib/api-response.ts
import type {
  PostgrestResponse,
  PostgrestSingleResponse,
  PostgrestError,
  AuthError,
} from "@supabase/supabase-js";

/* =========================
 * 공통 응답 타입 (프로젝트 전역)
 * ========================= */
export type PaginationMeta = {
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  hasNext?: boolean;
};

export type SuccessApiResponse<T> = {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
};

export type FailureApiResponse = {
  success: false;
  error: {
    code: string; // 예: BAD_REQUEST, CONFLICT, NOT_FOUND ...
    message: string;
    details?: unknown; // 필드 에러, 원본 에러 상세 등
  };
};

export type ApiResponse<T> = SuccessApiResponse<T> | FailureApiResponse;

/* =========================
 * 응답 바디 생성 유틸 (핵심)
 * ========================= */
export function successResponse<T>(
  data: T,
  opts?: { message?: string; meta?: PaginationMeta }
): SuccessApiResponse<T> {
  return { success: true, data, message: opts?.message, meta: opts?.meta };
}

export function failureResponse(
  code: string,
  message: string,
  details?: unknown
): FailureApiResponse {
  return { success: false, error: { code, message, details } };
}

/* =========================
 * 페이지네이션 메타 헬퍼(선택)
 * ========================= */
export function buildPaginationMeta(params: {
  page: number;
  size: number;
  totalElements: number;
}): PaginationMeta {
  const { page, size, totalElements } = params;
  const totalPages = size > 0 ? Math.ceil(totalElements / size) : 0;
  return {
    page,
    size,
    totalElements,
    totalPages,
    hasNext: page * size < totalElements,
  };
}

/* =========================
 * Supabase(PostgREST) → 우리 포맷 변환
 * ========================= */

// 에러코드 매핑 (PG/PostgREST 공통)
export function mapPostgrestErrorToCode(err: PostgrestError): {
  code: string; // 우리 표준 코드
  httpStatus: number; // 권장 HTTP 상태
} {
  switch (err.code) {
    case "23505": // unique_violation
      return { code: "CONFLICT", httpStatus: 409 };
    case "23503": // foreign_key_violation
      return { code: "CONFLICT", httpStatus: 409 };
    case "22P02": // invalid_text_representation (UUID 파싱 실패 등)
      return { code: "BAD_REQUEST", httpStatus: 400 };
    case "PGRST116": // .single() 에서 0 또는 다수
      return { code: "NOT_FOUND", httpStatus: 404 };
    default: {
      if (typeof err.hint === "string" && /rate.?limit/i.test(err.hint)) {
        return { code: "RATE_LIMITED", httpStatus: 429 };
      }
      if (typeof (err as unknown as { status?: number }).status === "number") {
        const st = (err as unknown as { status: number }).status;
        if (st === 401) return { code: "UNAUTHORIZED", httpStatus: 401 };
        if (st === 403) return { code: "FORBIDDEN", httpStatus: 403 };
        if (st === 404) return { code: "NOT_FOUND", httpStatus: 404 };
        if (st === 429) return { code: "RATE_LIMITED", httpStatus: 429 };
      }
      return { code: "INTERNAL_ERROR", httpStatus: 500 };
    }
  }
}

/**
 * PostgREST 응답을 ApiResponse로 변환
 * - 라우트에서는 반환 바디와 HTTP 상태를 함께 받아서 NextResponse로 감싸면 끝
 */
export function supaResponse<T>(
  result: PostgrestResponse<T> | PostgrestSingleResponse<T>,
  opts?: {
    pagination?: { page: number; size: number }; // count 기반 meta 자동 생성
    messageOnSuccess?: string;
    notFoundAsEmpty?: boolean; // .single() NOT_FOUND를 빈 데이터로 성공 처리
  }
): { body: ApiResponse<T | T[] | null>; httpStatus: number } {
  const { data, error, count, status } = result;

  // 성공
  if (error === null) {
    const meta =
      opts?.pagination && typeof count === "number"
        ? buildPaginationMeta({
            page: opts.pagination.page,
            size: opts.pagination.size,
            totalElements: count,
          })
        : undefined;

    return {
      body: successResponse<T | T[] | null>(data ?? null, {
        message: opts?.messageOnSuccess ?? "OK",
        meta,
      }),
      httpStatus: typeof status === "number" ? status : 200,
    };
  }

  // 실패
  const mapped = mapPostgrestErrorToCode(error);

  if (mapped.code === "NOT_FOUND" && opts?.notFoundAsEmpty) {
    return {
      body: successResponse<T[] | null>(Array.isArray(data) ? [] : null),
      httpStatus: 200,
    };
  }

  return {
    body: failureResponse(mapped.code, error.message, {
      details: error.details,
      hint: error.hint,
    }),
    httpStatus: mapped.httpStatus,
  };
}

/* =========================
 * Supabase Auth → 우리 포맷 변환
 * ========================= */
export type AuthLikeResponse<TData> = {
  data: TData | null;
  error: AuthError | null;
};

/**
 * Supabase Auth 응답을 ApiResponse로 변환
 */
export function supaAuthResponse<TData>(
  result: AuthLikeResponse<TData>,
  opts?: { messageOnSuccess?: string; maskErrorInProd?: boolean }
): { body: ApiResponse<TData | null>; httpStatus: number } {
  if (result.error === null) {
    return {
      body: successResponse<TData | null>(result.data, {
        message: opts?.messageOnSuccess ?? "OK",
      }),
      httpStatus: 200,
    };
  }

  const message =
    opts?.maskErrorInProd && process.env.NODE_ENV === "production"
      ? "Authentication failed."
      : result.error.message;

  return {
    body: failureResponse("UNAUTHORIZED", message),
    httpStatus: 401,
  };
}
