"use client";

import { ArrowLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { FOLDER_TO_MODULE_MAP, MODULE_ROUTES } from "@/lib/constants/modules";
import type { MenuItem, MenuSubItem, ModuleItem } from "@/types/app";

interface ModuleSidebarProps {
  moduleItems: ModuleItem[];
}

export function ModuleSidebar({ moduleItems }: ModuleSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Extract module name from pathname
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const currentModulePath = pathSegments[1] || "";

  // Find the current module
  const moduleDisplayName = FOLDER_TO_MODULE_MAP[currentModulePath.toLowerCase()];
  const currentModule = moduleItems.find(
    (module) =>
      module.displayName?.toLowerCase() === moduleDisplayName?.toLowerCase()
  );

  if (!currentModule) {
    return null;
  }

  // Build route helper
  const buildRoute = (route: string): string => {
    if (route.startsWith(MODULE_ROUTES.BASE)) return route;
    return route.startsWith("/")
      ? `${MODULE_ROUTES.BASE}${route}`
      : `${MODULE_ROUTES.BASE}/${currentModulePath}/${route}`;
  };

  // Build menu items for the current module
  const menuItems: MenuItem[] = currentModule.subItems?.length
    ? currentModule.subItems.map((sub) => ({
        displayName: sub.displayName,
        route: buildRoute(sub.route),
        icon: sub.icon || "Circle",
        matchRoutes:
          sub.matchRoutes?.map(buildRoute) || [buildRoute(sub.route)],
      }))
    : [
        {
          displayName: "Dashboard",
          route: `${MODULE_ROUTES.BASE}/${currentModulePath}/dashboard`,
          icon: currentModule.icon || "LayoutDashboard",
          matchRoutes: [
            `${MODULE_ROUTES.BASE}/${currentModulePath}/dashboard`,
            `${MODULE_ROUTES.BASE}/${currentModulePath}`,
          ],
        },
      ];

  const getIcon = (iconName: string): LucideIcon => {
    const lucideIconsMap = LucideIcons as unknown as Record<string, LucideIcon>;
    return lucideIconsMap[iconName] || LucideIcons.Grid3x3;
  };

  const isRouteActive = (item: MenuItem | MenuSubItem) => {
    if (pathname === item.route) return true;
    
    if (item.matchRoutes && item.matchRoutes.length > 0) {
      return item.matchRoutes.some((pattern) => {
        if (pathname?.startsWith(pattern)) {
          const remainingPath = pathname.slice(pattern.length);
          return remainingPath === "" || remainingPath.startsWith("/");
        }
        return false;
      });
    }
    
    return false;
  };

  return (
    <Sidebar collapsible="offcanvas" className="top-14 h-[calc(100vh-3.5rem)] border-t-0">
      <SidebarHeader className="border-b bg-gradient-to-b from-slate-50 to-white px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 transition-all duration-200 hover:border-slate-300 hover:bg-white hover:shadow-sm cursor-pointer shrink-0"
            onClick={() => router.push(MODULE_ROUTES.BASE)}
            title="Back to all modules"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600 transition-colors group-hover:text-slate-900" />
          </button>
          <div className="h-8 w-px bg-slate-200 shrink-0" />
          <div className="flex flex-1 items-center gap-2.5 min-w-0">
            {currentModule.icon && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                {(() => {
                  const ModuleIcon = getIcon(currentModule.icon);
                  return <ModuleIcon className="h-5 w-5 text-white" />;
                })()}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-900 leading-tight truncate">
                {currentModule.displayName}
              </span>
              <span className="text-xs text-slate-500">Module</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const Icon = getIcon(item.icon);
                const isSelected = isRouteActive(item);

                // Item with sub-items (grouped)
                if (item.subItems && item.subItems.length > 0) {
                  return (
                    <div key={item.displayName} className="mb-2">
                      <SidebarGroupLabel className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {item.displayName}
                      </SidebarGroupLabel>
                      <div className="space-y-0.5">
                        {item.subItems.map((sub) => {
                          const SubIcon = getIcon(sub.icon);
                          const subSelected = isRouteActive(sub);
                          return (
                            <SidebarMenuItem key={sub.route}>
                              <SidebarMenuButton
                                onClick={() => router.push(sub.route)}
                                isActive={subSelected}
                                tooltip={sub.displayName}
                                className={`cursor-pointer transition-all duration-150 ${
                                  subSelected
                                    ? "bg-blue-50 text-blue-700 font-medium hover:bg-blue-100"
                                    : "text-slate-700 hover:bg-slate-100 font-normal"
                                }`}
                              >
                                <SubIcon
                                  className={`w-4 h-4 shrink-0 ${
                                    subSelected ? "text-blue-600" : "text-slate-500"
                                  }`}
                                />
                                <span className="truncate">{sub.displayName}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // Regular menu item
                return (
                  <SidebarMenuItem key={item.route || item.displayName}>
                    <SidebarMenuButton
                      onClick={() => {
                        if (item.route) router.push(item.route);
                      }}
                      isActive={isSelected}
                      tooltip={item.displayName}
                      className={`cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-blue-50 text-blue-700 font-medium hover:bg-blue-100"
                          : "text-slate-700 hover:bg-slate-100 font-normal"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? "text-blue-600" : "text-slate-500"
                        }`}
                      />
                      <span className="truncate flex-1">{item.displayName}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
