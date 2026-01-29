import { apiClient } from "@/api/axios";
import type { WarehouseAuditResponse } from "@/types/warehouse";

export interface TableHeader {
  name: string;
  displayName: string;
  sort?: boolean;
  sortOrder?: number;
}

export interface TableComponent {
  name: string;
  displayName: string;
  component:
    | "text"
    | "action"
    | "badge"
    | "custom"
    | "number"
    | "currency"
    | "status";
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

export interface WarehouseData extends Record<string, unknown> {
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
  edit?: unknown;
  delete?: unknown;
  view?: unknown;
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
  filter?: unknown[];
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
      { params },
    );
    return response.data;
  },

  detail: async (
    id: string,
  ): Promise<{ status: boolean; data: WarehouseData }> => {
    const response = await apiClient.get(`/warehouse/detail/${id}`);
    return response.data;
  },

  create: async (
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; warehouseId?: string }> => {
    const response = await apiClient.post("/warehouse/create", data);
    return response.data;
  },

  edit: async (
    id: string,
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; data?: WarehouseData }> => {
    const response = await apiClient.put(`/warehouse/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/warehouse/delete`, {
      data: { ids: [id] },
    });
    return response.data;
  },

  audit: async (id: string): Promise<WarehouseAuditResponse> => {
    const response = await apiClient.get<WarehouseAuditResponse>(
      `/warehouse/audit/${id}`,
    );
    return response.data;
  },

  dropdown: async (warehouseId?: string): Promise<any> => {
    const route = warehouseId
      ? `/warehouse/dropdown/${warehouseId}`
      : `/warehouse/dropdown`;

    const response = await apiClient.get(route);
    return response.data;
  },
};
