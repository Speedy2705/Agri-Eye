interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function PageContainer({ children, title, subtitle }: PageContainerProps) {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-6 max-w-[1400px] mx-auto w-full">
      {title && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
