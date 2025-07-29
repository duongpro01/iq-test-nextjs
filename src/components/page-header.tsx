import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <div className="flex items-center space-x-2">
          {icon && <div className="h-6 w-6">{icon}</div>}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
} 