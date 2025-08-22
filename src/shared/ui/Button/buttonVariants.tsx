import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-[var(--color-background)]",
  {
    variants: {
      variant: {
        // Primary = 당근색(brand) 토큰
        default:
          'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-xs ' +
          'hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]',

        // Destructive = error 계열
        destructive:
          'bg-[var(--color-error)] text-[var(--color-primary-foreground)] shadow-xs ' +
          'hover:bg-[var(--color-error-hover)] active:bg-[var(--color-error-active)] ' +
          'focus-visible:ring-[var(--color-error)]',

        // Outline = 경계 + 액센트 hover
        outline:
          'border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] shadow-xs ' +
          'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',

        // Secondary = 중립 세컨더리 토큰 + 파생 hover/active
        secondary:
          'bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-xs ' +
          'hover:bg-[var(--color-secondary-hover)] active:bg-[var(--color-secondary-active)]',

        // Ghost = 배경 투명, hover 시 액센트
        ghost:
          'bg-transparent text-[var(--color-foreground)] ' +
          'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',

        // Link = 텍스트만 primary 컬러
        link: 'bg-transparent text-[var(--color-primary)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
