import { Check, AlertCircle, Info, Loader2 } from "lucide-react";

type StatusType = "idle" | "loading" | "success" | "error" | "info";

interface StatusBannerProps {
  status: StatusType;
  message: string;
  className?: string;
}

export function StatusBanner({ status, message, className = "" }: StatusBannerProps) {
  if (status === "idle" || !message) {
    return null;
  }

  const statusConfig = {
    loading: {
      bgClass: "bg-secondary/10 border-secondary/20",
      textClass: "text-secondary",
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
    },
    success: {
      bgClass: "bg-success/10 border-success/20",
      textClass: "text-success",
      icon: <Check className="w-4 h-4" />,
    },
    error: {
      bgClass: "bg-destructive/10 border-destructive/20",
      textClass: "text-destructive",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    info: {
      bgClass: "bg-secondary/10 border-secondary/20",
      textClass: "text-secondary",
      icon: <Info className="w-4 h-4" />,
    },
    idle: {
      bgClass: "",
      textClass: "",
      icon: null,
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg border
        ${config.bgClass} ${config.textClass}
        ${status === "error" ? "animate-shake" : ""}
        ${className}
      `}
      role="alert"
      aria-live="polite"
      data-testid={`status-banner-${status}`}
    >
      {config.icon}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
