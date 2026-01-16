"use client";

import { usePathname } from "next/navigation";
import ModuleSidebar from "@/components/flow-tool/module-sidebar";
import type { ModuleItem, MenuItem } from "@/types/app";

export default function DynamicSidebar({ moduleItems }: { moduleItems: ModuleItem[] }) {
  const pathname = usePathname();
  
  // Extract module name from pathname (e.g., "/flow-tool/inventory" -> "inventory")
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const currentModulePath = pathSegments[1] || ""; // Get second segment after flow-tool

  // Map folder names to module display names
  const folderToModuleMap: Record<string, string> = {
    'inventory': 'Inventory',
    'crm': 'CRM',
    'sales': 'Sales',
    'items': 'Items',
    'purchase': 'Purchase',
    'settings': 'Settings',
  };

  // Find the current module by matching displayName
  const moduleDisplayName = folderToModuleMap[currentModulePath.toLowerCase()];
  const currentModule = moduleItems.find((module) => 
    module.displayName?.toLowerCase() === moduleDisplayName?.toLowerCase()
  );

  if (!currentModule) {
    // Fallback: show a basic sidebar with just the module name
    return (
      <ModuleSidebar
        moduleHeader={moduleDisplayName || currentModulePath.charAt(0).toUpperCase() + currentModulePath.slice(1)}
        menuItems={[
          {
            displayName: "Dashboard",
            route: `/flow-tool/${currentModulePath}`,
            icon: "LayoutDashboard",
          }
        ]}
        showSearch={false}
      />
    );
  }

  // Build menu items for the current module only
  let menuItems: MenuItem[] = [];
  
  if (currentModule.subItems && currentModule.subItems.length > 0) {
    // If module has sub-items, use them as menu items
    menuItems = currentModule.subItems.map((sub) => ({
      displayName: sub.displayName,
      route: `/flow-tool/${currentModulePath}${sub.route}`,
      icon: sub.icon || "Circle",
      matchRoutes: sub.matchRoutes?.map((r) => `/flow-tool/${currentModulePath}${r}`) || [`/flow-tool/${currentModulePath}${sub.route}`],
    }));
  } else {
    // If no sub-items, create a single dashboard item
    menuItems = [
      {
        displayName: "Dashboard",
        route: `/flow-tool/${currentModulePath}`,
        icon: currentModule.icon || "LayoutDashboard",
        matchRoutes: [`/flow-tool/${currentModulePath}`],
      },
    ];
  }

  return (
    <ModuleSidebar
      moduleHeader={currentModule.displayName}
      menuItems={menuItems}
      showSearch={false}
    />
  );
}
