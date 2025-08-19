export type Role = 'MEMBER' | 'ADMIN' | 'HOST' | 'OWNER';

// 유틸
export const AllRoles: Role[] = ['MEMBER', 'ADMIN', 'HOST', 'OWNER'] as const;
export const isRole = (v: unknown): v is Role =>
  typeof v === 'string' && (AllRoles as readonly string[]).includes(v);
