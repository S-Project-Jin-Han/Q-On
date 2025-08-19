import type { ReactNode } from "react";

/* ===========================
   Toaster (컨테이너) Props
=========================== */
export interface ToasterProps {
  className?: string;
  position?: ToastPosition;
  expand?: boolean;
  richColors?: boolean;
  closeButton?: boolean;
  duration?: number;
}

/* ===========================
   Toast 호출 시 옵션
=========================== */
export interface ToastOptions {
  message: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  size?: ToastSize;
  icon?: ReactNode;
  dismissible?: boolean;
  action?: ToastAction;
  className?: string;
}

/* ===========================
   Toast 액션 버튼
=========================== */
export interface ToastAction {
  label: string;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

/* ===========================
   타입 유틸
=========================== */
export type ToastType = "default" | "success" | "error" | "warning" | "info" | "loading";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastSize = "sm" | "md" | "lg";
