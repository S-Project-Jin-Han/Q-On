import { cva } from "class-variance-authority";

// Toast 본체
export const sonnerVariants = cva(
  "toast flex items-start gap-3 p-4 rounded-xl border shadow-md animate-in fade-in zoom-in-90",
  {
    variants: {
      type: {
        default: "bg-neutral-50 text-neutral-800 border-neutral-200",
        success: "bg-emerald-50 text-emerald-800 border-emerald-200",
        error: "bg-rose-50 text-rose-800 border-rose-200",
        warning: "bg-amber-50 text-amber-800 border-amber-200",
        info: "bg-sky-50 text-sky-800 border-sky-200",
        loading: "bg-indigo-50 text-indigo-800 border-indigo-200",
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
  }
);

// 액션 버튼
export const toastActionVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        vibrant: "bg-fuchsia-600 text-white hover:bg-fuchsia-700 active:scale-95",
        mild: "bg-neutral-200 text-neutral-800 hover:bg-neutral-300 active:scale-95",
        subtle:
          "bg-transparent border border-neutral-300 text-neutral-700 hover:bg-neutral-100 active:scale-95",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "vibrant",
      size: "md",
    },
  }
);

// 닫기 버튼
export const toastCloseVariants = cva(
  "toast-close absolute right-2 top-2 p-1 text-neutral-400 hover:text-neutral-800 rounded-full transition-all duration-150 hover:rotate-90",
  {
    variants: {
      size: {
        sm: "h-6 w-6",
        md: "h-7 w-7",
        lg: "h-8 w-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// 아이콘
export const toastIconVariants = cva("toast-icon flex-shrink-0 self-start mt-0.5", {
  variants: {
    type: {
      default: "text-neutral-400",
      success: "text-emerald-500",
      error: "text-rose-500",
      warning: "text-amber-500",
      info: "text-sky-500",
      loading: "text-indigo-500 animate-spin",
    },
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    },
  },
  defaultVariants: {
    type: "default",
    size: "md",
  },
});
