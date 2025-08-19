import { cva } from "class-variance-authority";

// Toast 메시지 variants
export const toastVariants = cva("flex items-start gap-3 px-4 py-3 rounded-md border shadow-sm", {
  variants: {
    type: {
      default: "bg-background text-foreground border-border",
      success: "bg-green-100 text-green-800 border-green-300",
      error: "bg-red-100 text-red-800 border-red-300",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
      info: "bg-blue-100 text-blue-800 border-blue-300",
      loading: "text-blue-600 animate-spin",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    type: "default",
    size: "md",
  },
});

// Toast 액션 버튼 variants
export const toastActionVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        danger: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-input bg-transparent hover:bg-muted",
        ghost: "bg-transparent hover:bg-muted",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// Toast 닫기 버튼 variants
export const toastCloseVariants = cva(
  "absolute right-2 top-2 rounded-sm text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "hover:text-foreground hover:bg-muted/50",
        ghost: "hover:text-foreground hover:bg-transparent",
        subtle: "hover:text-foreground hover:bg-muted/30",
      },
      size: {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Toast 아이콘 variants
export const toastIconVariants = cva("flex-shrink-0 self-start", {
  variants: {
    type: {
      default: "text-muted-foreground",
      success: "text-green-600",
      error: "text-red-600",
      warning: "text-yellow-600",
      info: "text-blue-600",
      loading: "text-blue-600 animate-spin",
    },
    size: {
      sm: "h-4 w-4 mt-0.5",
      md: "h-5 w-5 mt-0.5",
      lg: "h-6 w-6 mt-0.5",
    },
  },
  defaultVariants: {
    type: "default",
    size: "md",
  },
});
