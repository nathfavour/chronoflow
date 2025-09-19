"use client";
import { Toaster } from "./ui/sonner";
import { useTheme } from "./ThemeProvider";

export function ToastProvider() {
  const { theme } = useTheme();

  const toastOptions: any = {
    style: {
      background: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      color: 'hsl(var(--card-foreground))',
    },
    className: 'group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
    descriptionClassName: 'group-[.toast]:text-muted-foreground',
    actionButtonClassName: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
    cancelButtonClassName: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
  };

  return (
    <Toaster
      theme={theme === "dark" ? "dark" : "light"}
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      toastOptions={toastOptions}
    />
  );
}
