import type { SessionUser } from './user.types';
import type { Profile } from './profile.types';

export type AuthState = {
  supabaseUser: SessionUser | null;
  profile: Profile | null;
  hydrated: boolean;
  setSupabaseUser: (user: SessionUser | null) => void;
  setProfile: (profile: Profile | null) => void;
  markHydrated: () => void;
  reset: () => void;
};
