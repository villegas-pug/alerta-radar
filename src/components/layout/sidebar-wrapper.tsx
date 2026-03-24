"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";

export function SidebarWrapper() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Sidebar
      isCollapsed={isCollapsed}
      onToggle={() => setIsCollapsed(!isCollapsed)}
    />
  );
}
