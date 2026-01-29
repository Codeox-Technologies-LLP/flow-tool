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

export interface PaymentMadeData extends Record<string, unknown> {
  id: string;
  paymentMadeId: string;
  vendorId: string;
  createdAt: string;
  paymentMadeMethod: string;
  refNo: string;
  amount: number;
  status: string;
  edit?: unknown;
  delete?: unknown;
  view?: unknown;
}


export interface PaymentMadeListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: number;
}

export interface PaymentMadeListResponse {
  tools?: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: PaymentMadeData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}

export interface PaymentMadeDetailResponse {
  status: boolean;
  message: string;
  payment: PaymentMadeData;
  bill?: any | null;
}

export const paymentMadeApi = {
  list: async (params: PaymentMadeListParams): Promise<PaymentMadeListResponse> => {
    const response = await apiClient.get<PaymentMadeListResponse>(
      "/payment-made/list",
      { params },
    );
    return response.data;
  },

  detail: async (
    id: string,
  ): Promise<{ status: boolean; data: PaymentMadeData }> => {
    const response = await apiClient.get(`/payment-made/detail/${id}`);
    return response.data;
  },

  create: async (
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; paymentMadeId?: string }> => {
    const response = await apiClient.post("/payment-made/create", data);
    return response.data;
  },

  edit: async (
    id: string,
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; data?: PaymentMadeData }> => {
    const response = await apiClient.put(`/payment-made/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/payment-made/delete/${id}`);
    return response.data;
  },
};
