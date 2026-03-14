import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "default";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-grad-success text-white border border-success/40 shadow-sm",
  warning: "bg-grad-warning text-white border border-warning/40 shadow-sm",
  danger:  "bg-grad-danger text-white border border-danger/40 shadow-sm",
  default: "bg-surface text-foreground border border-border",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
