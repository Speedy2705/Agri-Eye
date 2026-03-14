import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function Card({ className, children, style }: CardProps) {
  return (
    <div
      className={cn(
        "card-light border-t-2 border-primary/20 p-3 sm:p-4",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
