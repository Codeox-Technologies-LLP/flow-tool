/**
 * Module-related constants and mappings
 */

/**
 * Maps folder names to their display names
 * Used for converting URL segments to user-facing module names
 */
export const FOLDER_TO_MODULE_MAP: Record<string, string> = {
  inventory: "Inventory",
  crm: "CRM",
  sales: "Sales",
  items: "Items",
  purchase: "Purchase",
  settings: "Settings",
} as const;

/**
 * Module route prefixes
 */
export const MODULE_ROUTES = {
  BASE: "/flow-tool",
  INVENTORY: "/flow-tool/inventory",
  CRM: "/flow-tool/crm",
  SALES: "/flow-tool/sales",
  ITEMS: "/flow-tool/items",
  PURCHASE: "/flow-tool/purchase",
  SETTINGS: "/flow-tool/settings",
} as const;
