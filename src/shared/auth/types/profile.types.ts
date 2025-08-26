import type { Role } from './role.types';

export type Profile = {
  uuid: string;
  email?: string;
  name?: string | null;
  avatarUrl?: string | null;
  role?: Role;
  isOnboarding: boolean;
  createdAt?: string;
};
