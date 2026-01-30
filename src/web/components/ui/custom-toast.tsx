"use client";

import { toast as sonnerToast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Bell,
} from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info" | "alert" | "price-up" | "price-down";

interface CustomToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-accent" />,
  error: <XCircle className="h-5 w-5 text-destructive" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning" />,
  info: <Info className="h-5 w-5 text-primary" />,
  alert: <Bell className="h-5 w-5 text-primary" />,
  "price-up": <TrendingUp className="h-5 w-5 text-accent" />,
  "price-down": <TrendingDown className="h-5 w-5 text-destructive" />,
};

const toastStyles: Record<ToastType, string> = {
  success: "border-accent/30 bg-accent/5",
  error: "border-destructive/30 bg-destructive/5",
  warning: "border-warning/30 bg-warning/5",
  info: "border-primary/30 bg-primary/5",
  alert: "border-primary/30 bg-primary/5",
  "price-up": "border-accent/30 bg-accent/5",
  "price-down": "border-destructive/30 bg-destructive/5",
};

export function showToast({
  title,
  description,
  type = "info",
  duration = 4000,
  action,
}: CustomToastOptions) {
  return sonnerToast.custom(
    (id) => (
      <div
        className={`flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg ${toastStyles[type]}`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/80">
          {toastIcons[type]}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {action && (
            <button
              onClick={() => {
                action.onClick();
                sonnerToast.dismiss(id);
              }}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => sonnerToast.dismiss(id)}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <XCircle className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </button>
      </div>
    ),
    {
      duration,
      position: "top-right",
    }
  );
}

// Convenience methods
export const toast = {
  success: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
    showToast({ title, description, type: "success", ...options }),
  
  error: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
    showToast({ title, description, type: "error", ...options }),
  
  warning: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
    showToast({ title, description, type: "warning", ...options }),
  
  info: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
    showToast({ title, description, type: "info", ...options }),
  
  alert: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
    showToast({ title, description, type: "alert", ...options }),
  
  priceUp: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
    showToast({ title, description, type: "price-up", ...options }),
  
  priceDown: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
    showToast({ title, description, type: "price-down", ...options }),
};

// Confirmation dialog component using toast
export function showConfirmToast({
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}: {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  return sonnerToast.custom(
    (id) => (
      <div className="flex w-full flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/10">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold text-card-foreground">{title}</p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              onCancel?.();
              sonnerToast.dismiss(id);
            }}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              sonnerToast.dismiss(id);
            }}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-center",
    }
  );
}
