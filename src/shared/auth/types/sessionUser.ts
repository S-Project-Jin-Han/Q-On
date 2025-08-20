import type { Role } from './role';

export type SessionUser = {
  isLoggedIn: boolean;
  uuid: string;
  email?: string;
  name?: string | null;
  avatarUrl?: string | null;
  role: Role;
  isOnboarding: boolean;
  createdAt?: string;
};
