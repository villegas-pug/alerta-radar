"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Upload,
  Search,
  Database,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Carga Masiva",
    href: "/alerts-upload",
    icon: Upload,
  },
  {
    title: "Almacenamiento",
    href: "/alerts-storage",
    icon: Database,
  },
  {
    title: "Búsqueda",
    href: "/alerts-search",
    icon: Search,
  },
  {
    title: "Analítica",
    href: "/analytics",
    icon: BarChart3,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "min-h-screen border-r bg-card flex flex-col transition-all duration-200 ease-in-out relative",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4">
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg">ARAM</span>
                <span className="text-xs text-muted-foreground">Alerta Radar</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = mounted ? pathname === item.href : false;
              const NavButton = (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "h-11 transition-all duration-200",
                    isCollapsed ? "w-12 justify-center px-0" : "w-full justify-start gap-3",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                </Button>
              );

              if (isCollapsed) {
                return (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10}>
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              }

              return <li key={item.href}>{NavButton}</li>;
            })}
          </ul>
        </nav>

        <Separator />

        <div className={cn("p-2", isCollapsed && "flex justify-center")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-8 w-8"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {isCollapsed ? "Expandir" : "Colapsar"}
            </TooltipContent>
          </Tooltip>
        </div>

        {!isCollapsed && (
          <div className="p-4 pt-0">
            <p className="text-xs text-muted-foreground text-center">v1.0.0</p>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
