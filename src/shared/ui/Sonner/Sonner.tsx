"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "@/shared/lib";

interface CustomToasterProps extends Omit<ToasterProps, "theme"> {
  className?: string;
}

const DEFAULT_STYLE = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
} as Record<`--${string}`, string>;

const Toaster = ({
  className,
  position = "bottom-center",
  expand = true,
  richColors = true,
  closeButton = true,
  ...props
}: CustomToasterProps) => {
  return (
    <Sonner
      className={cn(className)}
      style={DEFAULT_STYLE}
      position={position}
      expand={expand}
      richColors={richColors}
      closeButton={closeButton}
      {...props}
    />
  );
};

export { Toaster };
