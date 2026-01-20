export interface WarehouseAnalyticsSummary {
  totalWarehouses: number;
  totalLocations: number;
  totalStockItems: number;
  totalUniqueProducts: number;
  totalStockValue: number;
  lowStockAlerts: number;
  outOfStockAlerts: number;
}

export interface WarehouseAnalyticsCardsProps {
  analytics: {
    summary: WarehouseAnalyticsSummary;
  } | null | undefined;
}

export interface WarehouseEditFormProps {
  warehouse: import("@/lib/api/warehouse").WarehouseData;
  warehouseId: string;
}
