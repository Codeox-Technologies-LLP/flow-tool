"use client";

import { PanelLeftClose, PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { MODULE_ROUTES } from "@/lib/constants/modules";

export function SidebarToggle() {
  const { state, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  // Only show toggle when user is in a module route
  const isInModuleRoute = pathname?.startsWith(MODULE_ROUTES.BASE) && 
    pathname !== MODULE_ROUTES.BASE;

  if (!isInModuleRoute) {
    return null;
  }

  const isCollapsed = state === "collapsed";

  return (
    <button
      onClick={toggleSidebar}
      className="group flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-all duration-200 border border-transparent hover:border-slate-200"
      title={isCollapsed ? "Show module sidebar" : "Hide module sidebar"}
      aria-label={isCollapsed ? "Show module sidebar" : "Hide module sidebar"}
    >
      {isCollapsed ? (
        <PanelLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
      ) : (
        <PanelLeftClose className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
      )}
      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors hidden sm:inline">
        {isCollapsed ? "Show" : "Hide"} Sidebar
      </span>
    </button>
  );
}
