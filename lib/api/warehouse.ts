import { apiClient } from "./axios";

export interface TableHeader {
  name: string;
  displayName: string;
  sort?: boolean;
  sortOrder?: number;
}

export interface TableComponent {
  name: string;
  displayName: string;
  component: string;
}

export interface Tool {
  name: string;
  displayName: string;
  icon: string;
  bgColor?: string;
  txtColor?: string;
  width?: string;
}

export interface WarehouseData {
  id: string;
  warehouseId: string;
  name: string;
  shortCode: string;
  phone: string;
  city: string;
  description: string;
  totalLocations: number;
  stockItems: number;
  uniqueProducts: number;
  stockValue: number;
  lowStockAlerts: number;
  outOfStockAlerts: number;
  status: string;
  edit?: any;
  delete?: any;
  view?: any;
}

export interface WarehouseAnalytics {
  summary: {
    totalWarehouses: number;
    totalLocations: number;
    totalStockItems: number;
    totalUniqueProducts: number;
    totalStockValue: number;
    lowStockAlerts: number;
    outOfStockAlerts: number;
  };
  warehousePerformance: Array<{
    warehouseId: string;
    name: string;
    locations: number;
    stockItems: number;
    uniqueProducts: number;
    stockValue: number;
    utilizationRate: number;
  }>;
  alerts: {
    lowStock: number;
    outOfStock: number;
    needsAttention: number;
  };
  statusDistribution: {
    active: number;
    inactive: number;
  };
}

export interface WarehouseListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: number;
}

export interface WarehouseListResponse {
  analytics?: WarehouseAnalytics;
  tools?: Tool[];
  filter?: any[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: WarehouseData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}

export const warehouseApi = {
  list: async (params: WarehouseListParams): Promise<WarehouseListResponse> => {
    const response = await apiClient.get<WarehouseListResponse>(
      "/warehouse/list",
      { params }
    );
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/warehouse/${id}`);
    return response.data;
  },
};
