import { Home, Bell, Trash2, Search, X, Check } from 'lucide-react';

/** 실제 사용하는 아이콘만 등록 */
export const lucideRegistry = {
  Home,
  Bell,
  Trash2,
  Search,
  X,
  Check,
} as const;

export type LucideName = keyof typeof lucideRegistry;

export function getLucideByName(name: LucideName) {
  return lucideRegistry[name];
}

export const LUCIDE_NAMES: LucideName[] = Object.keys(
  lucideRegistry
) as LucideName[];
