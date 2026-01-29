import { apiClient } from "@/api/axios";

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

export interface PurchaseData extends Record<string, unknown> {
  id: string;
  purchaseId: string;
  vendorId: string;
  warehouseId: string;
  locationId: string;
  operationType: string;
  subtotal?: number;
  discountTotal?: number;
  total?: number;
  deliveryDate?: string;
  amount: number;
  status: string;
  edit?: unknown;
  delete?: unknown;
  view?: unknown;
}

export interface PurchaseAnalytics {
  summary: {
    totalPurchases: number;
    totalAmount: number;
    confirmedPurchases: number;
    highestPurchaseValue: number;
  };
}

export interface PurchaseListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: number;
}

export interface PurchaseListResponse {
   analytics?: PurchaseAnalytics;
  tools?: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: PurchaseData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}
export interface GetPurchaseDetailResponse {
  purchase: PurchaseData;
  receiptId: string | null;
  billId: string | null;
}

export const purchaseApi = {
  list: async (params: PurchaseListParams): Promise<PurchaseListResponse> => {
    const response = await apiClient.get<PurchaseListResponse>(
      "/purchase/list",
      { params },
    );
    return response.data;
  },

  detail: async (
    id: string,
  ): Promise<{ status: boolean; data: PurchaseData }> => {
    const response = await apiClient.get(`/purchase/detail/${id}`);
    return response.data;
  },

  create: async (
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; purchaseId?: string }> => {
    const response = await apiClient.post("/purchase/create", data);
    return response.data;
  },

  edit: async (
    id: string,
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; data?: PurchaseData }> => {
    const response = await apiClient.patch(`/purchase/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/purchase/delete/${id}`);
    return response.data;
  },
};
