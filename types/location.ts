export interface TableHeader {
  name: string;
  displayName: string;
  sort?: boolean;
  sortOrder?: number;
}

export interface TableComponent {
  name: string;
  displayName: string;
  component: "text" | "action" | "badge" | "custom" | "number" | "currency" | "status";
}

export interface Tool {
  name: string;
  displayName: string;
  icon: string;
  bgColor?: string;
  txtColor?: string;
  width?: string;
  route?: string;
}

export interface LocationData extends Record<string, unknown> {
  id: string;
  locationId: string;
  name: string;
  warehouseName: string;
  path: string;
  stockItems: number;
  uniqueProducts: number;
  stockValue: number;
  lowStockAlerts: number;
  outOfStockAlerts: number;
  status: string;
  edit?: unknown;
  delete?: unknown;
  view?: unknown;
}

export interface LocationAnalytics {
  summary: {
    totalLocations: number;
    internalLocations: number;
    externalLocations: number;
    totalStockItems: number;
    totalUniqueProducts: number;
    totalStockValue: number;
    lowStockAlerts: number;
    outOfStockAlerts: number;
  };
}

export interface LocationAnalyticsCardsProps {
  analytics: LocationAnalytics | null | undefined;
  loading?: boolean;
}

export interface LocationListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: number;
  search?: string;
  warehouseId?: string;
}

export interface LocationListResponse {
  analytics: LocationAnalytics;
  tools: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    components: TableComponent[];
    search: boolean;
    pagination: boolean;
    data: LocationData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}
