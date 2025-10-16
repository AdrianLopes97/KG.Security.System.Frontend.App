import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive";
export type AppToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

function appToast({ title, description, variant = "default", duration }: AppToastOptions) {
  const show = variant === "destructive" ? sonnerToast.error : sonnerToast.success;
  show(title, { description, duration });
}

export function useToast() {
  return { toast: appToast };
}

export const toast = appToast;
