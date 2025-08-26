export type CustomPathIcon = {
  viewBox?: string; // 기본 "0 0 24 24"
  paths: string | string[]; // path d 문자열 또는 배열
  strokeWidth?: number | string; // 기본 1.5
};

export const customRegistry = {
  carrotSimple: {
    viewBox: '0 0 24 24',
    paths: ['M12 2c2 0 4 2 4 4 0 4-4 8-4 8s-4-4-4-8c0-2 2-4 4-4Z', 'M12 14v8'],
    strokeWidth: 1.5,
  },
  square: {
    viewBox: '0 0 24 24',
    paths: 'M3 3H21V21H3Z',
    strokeWidth: 1.5,
  },
  triangle: {
    viewBox: '0 0 24 24',
    paths: 'M12 4L20 20H4Z',
    strokeWidth: 1.5,
  },
} as const satisfies Record<string, CustomPathIcon>;

export type CustomName = keyof typeof customRegistry;

export function getCustomByName(name: CustomName) {
  return customRegistry[name];
}

export const CUSTOM_NAMES: CustomName[] = Object.keys(
  customRegistry
) as CustomName[];
