"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "@/shared/lib";

interface CustomToasterProps extends Omit<ToasterProps, "theme"> {
  className?: string;
}

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
      position={position}
      expand={expand}
      richColors={richColors}
      closeButton={closeButton}
      {...props}
    />
  );
};

export { Toaster };
