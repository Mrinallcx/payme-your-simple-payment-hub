import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ title, action, children, className = "" }: DashboardCardProps) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-syne font-bold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
