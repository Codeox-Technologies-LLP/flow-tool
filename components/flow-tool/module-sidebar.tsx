"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Grid3x3 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import FlowtoolLogo from "@/components/shared/FlowtoolLogo";
import type { MenuItem, MenuSubItem, ModuleSidebarProps } from "@/types/app";

const ModuleSidebar = ({
  moduleHeader,
  menuItems,
  showSearch = true,
}: ModuleSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const getIcon = (iconName: string): LucideIcon => {
    const lucideIconsMap = LucideIcons as unknown as Record<string, LucideIcon>;
    return lucideIconsMap[iconName] || Grid3x3;
  };

  const isRouteActive = (item: MenuItem | MenuSubItem) => {
    if (item.matchRoutes) {
      return item.matchRoutes.some((pattern) => pathname?.startsWith(pattern));
    }
    return pathname === item.route;
  };

  if (collapsed) {
    return (
      <button
        className="fixed left-16 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-slate-200 rounded-r-md shadow-sm hover:bg-slate-50 transition-colors z-50"
        onClick={() => setCollapsed(false)}
      >
        <ChevronRight className="w-4 h-4 text-slate-600" />
      </button>
    );
  }

  return (
    <aside className="flex flex-col w-64 h-screen bg-white border-r border-slate-200 sticky top-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <FlowtoolLogo variant="default" width={120} height={40} />
          <button
            className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
            onClick={() => setCollapsed(true)}
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
        </div>
        {moduleHeader && (
          <div className="mt-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {moduleHeader}
            </span>
          </div>
        )}
      </div>

      {/* Search */}
      {showSearch && (
        <div className="px-3 py-3 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              className="w-full py-2 pl-9 pr-3 rounded-md bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Search..."
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {menuItems.map((item) => {
          const Icon = getIcon(item.icon);
          const isSelected = isRouteActive(item);

          // Item with sub-items (grouped)
          if (item.subItems && item.subItems.length > 0) {
            return (
              <div key={item.displayName} className="mb-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {item.displayName}
                </div>
                <div className="space-y-0.5">
                  {item.subItems.map((sub) => {
                    const SubIcon = getIcon(sub.icon);
                    const subSelected = isRouteActive(sub);
                    return (
                      <div
                        key={sub.route}
                        className={`
                          flex items-center gap-2.5 px-3 py-2 text-sm rounded-md cursor-pointer transition-all duration-150
                          ${
                            subSelected
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-slate-700 hover:bg-slate-100 font-normal"
                          }`}
                        onClick={() => handleNavigation(sub.route)}
                      >
                        <SubIcon
                          className={`w-4 h-4 flex-shrink-0 ${
                            subSelected ? "text-blue-600" : "text-slate-500"
                          }`}
                        />
                        <span className="truncate">{sub.displayName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // Regular menu item
          return (
            <div key={item.route || item.displayName} className="mb-1">
              <div
                className={`
                  flex items-center gap-2.5 px-3 py-2 text-sm rounded-md cursor-pointer transition-all duration-150
                  ${
                    isSelected
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-slate-700 hover:bg-slate-100 font-normal"
                  }`}
                onClick={() => {
                  if (item.route) handleNavigation(item.route);
                }}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isSelected ? "text-blue-600" : "text-slate-500"
                  }`}
                />
                <span className="truncate flex-1">{item.displayName}</span>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default ModuleSidebar;
