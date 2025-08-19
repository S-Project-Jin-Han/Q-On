// app/test/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ApiResponse, PaginationMeta } from "@/shared/lib/response";

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

export default function TestProfilesPage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  const qs = useMemo(
    () => new URLSearchParams({ page: String(page), size: String(size) }).toString(),
    [page, size]
  );

  useEffect(() => {
    let aborted = false;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/test?${qs}`, { cache: "no-store" });
        const json: ApiResponse<Profile[]> = await res.json();
        if (!json.success) {
          if (!aborted) setErr(json.error.message);
          return;
        }
        if (!aborted) {
          setProfiles(json.data);
          setMeta(json.meta);
        }
      } catch {
        if (!aborted) setErr("API 호출 실패");
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    load();
    return () => {
      aborted = true;
    };
  }, [qs]);

  const canPrev = (meta?.page ?? 1) > 1;
  const canNext = Boolean(meta?.hasNext);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>Profiles (테스트)</h1>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!canPrev || loading}>
          ◀ Prev
        </button>
        <span>
          Page <strong>{meta?.page ?? page}</strong>
        </span>
        <button onClick={() => setPage((p) => p + 1)} disabled={!canNext || loading}>
          Next ▶
        </button>

        <span style={{ marginLeft: 16 }}>Size:</span>
        <select
          value={size}
          onChange={(e) => {
            setPage(1);
            setSize(Number(e.target.value));
          }}
          disabled={loading}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <span style={{ marginLeft: "auto", opacity: 0.8 }}>
          Total: {meta?.totalElements ?? "—"} / Pages: {meta?.totalPages ?? "—"}
        </span>
      </div>

      {loading && <p>불러오는 중…</p>}
      {err && <p style={{ color: "crimson" }}>에러: {err}</p>}
      {!loading && !err && profiles.length === 0 && <p>프로필이 없습니다.</p>}

      {!loading && !err && profiles.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #e5e7eb",
          }}
        >
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Role</th>
              <th style={th}>UUID</th>
              <th style={th}>Onboarding</th>
              <th style={th}>CreatedAt</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id}>
                <td style={td}>{p.id}</td>
                <td style={td}>{p.name ?? "-"}</td>
                <td style={td}>{p.role ?? "-"}</td>
                <td style={td} title={p.uuid ?? ""}>
                  {p.uuid ? p.uuid.slice(0, 8) + "…" : "-"}
                </td>
                <td style={td}>{p.isOnboarding ? "Y" : "N"}</td>
                <td style={td}>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "1px solid #e5e7eb",
  background: "#f9fafb",
  fontWeight: 600,
  fontSize: 14,
};

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
};
