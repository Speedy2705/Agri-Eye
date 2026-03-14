import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export default function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-primary/20 rounded-xl p-3 sm:p-4 shadow-lg shadow-black/20 ring-1 ring-inset ring-primary/10",
        className
      )}
    >
      {children}
    </div>
  );
}
