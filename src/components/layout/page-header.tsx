"use client";

import { type LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function PageHeader({ icon: Icon, title, description }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm sm:text-base text-muted-foreground hidden sm:block">{description}</p>
        </div>
      </div>
    </header>
  );
}
