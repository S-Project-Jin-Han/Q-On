"use client";

import { useEffect, useState } from "react";

type Role = "ADMIN" | "OWNER" | "HOST" | "MEMBER";
type Profile = {
  id: number;
  name: string | null;
  role: Role | null;
  createdAt: string;
  isOnboarding: boolean;
  uuid: string;
};

type SuccessApiResponse<T> = { success: true; data: T; message?: string; meta?: unknown };
type FailureApiResponse = {
  success: false;
  error: { code: string; message: string; details?: unknown };
};
type ApiResponse<T> = SuccessApiResponse<T> | FailureApiResponse;

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/home?page=1&size=50", { cache: "no-store" });
        const json: ApiResponse<Profile[]> = await res.json();

        if (!json.success) {
          setError(json.error.message);
          return;
        }
        setProfiles(json.data);
      } catch {
        setError("API 호출 실패");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <p>불러오는 중…</p>;
  if (error) return <p style={{ color: "crimson" }}>에러: {error}</p>;

  if (profiles.length === 0) return <p>프로필이 없습니다.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Profiles</h1>
      <ul>
        {profiles.map((p) => (
          <li key={p.id}>
            <strong>{p.name ?? "이름 없음"}</strong> · role: {p.role ?? "—"} · uuid: {p.uuid} ·
            createdAt: {new Date(p.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
