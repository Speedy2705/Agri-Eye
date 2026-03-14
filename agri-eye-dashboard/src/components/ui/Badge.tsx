import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "default";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success/20 text-success border border-success/30",
  warning: "bg-warning/20 text-warning border border-warning/30",
  danger:  "bg-danger/20 text-danger border border-danger/30",
  default: "bg-muted/20 text-foreground border border-muted/30",
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
