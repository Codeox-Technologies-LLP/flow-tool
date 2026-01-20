export interface WarehouseAuditEntry {
  _id: string;
  warehouseId: string;
  action: "create" | "edit" | "note" | "activity";
  title: string;
  desc: string;
  userName: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseAuditResponse {
  status: boolean;
  message: string;
  data: WarehouseAuditEntry[];
}

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
  warehouse: import("@/api/warehouse/warehouse").WarehouseData;
  warehouseId: string;
}
