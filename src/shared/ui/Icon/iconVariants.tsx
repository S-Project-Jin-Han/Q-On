import { cva } from 'class-variance-authority';

export const iconVariants = cva(
  'inline-block select-none leading-none align-middle text-current',
  {
    variants: {
      size: {
        xs: 'size-3',
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-6',
        xl: 'size-8',
        '2xl': 'size-10',
      },
      tone: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        primary: 'text-primary',
        secondary: 'text-secondary-foreground',
        accent: 'text-accent-foreground',
        success: 'text-green-600 dark:text-green-500',
        warning: 'text-amber-600 dark:text-amber-500',
        destructive: 'text-red-600 dark:text-red-500',
        info: 'text-sky-600 dark:text-sky-500',
      },
      spin: {
        true: 'animate-spin',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      tone: 'default',
      spin: false,
    },
  }
);
