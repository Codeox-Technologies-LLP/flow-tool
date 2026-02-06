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

export interface BillData extends Record<string, unknown> {
  id: string;
  billId: string;
  vendorId: string;
  warehouseId?: string;
  locationId: string;
  subtotal: number;
  discountTotal: number;
  total: number;
  deliveryDate?: string;
  products: {
    product: string;
    productName?: string;
    qty: number;
    price: number;
    discount?: number;
  }[];
  amount: number;
  status: string;
  edit?: unknown;
  delete?: unknown;
  view?: unknown;
}


export interface BillListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: number;
}

export interface BillListResponse {
  tools?: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: BillData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}

export const billApi = {
  list: async (params: BillListParams): Promise<BillListResponse> => {
    const response = await apiClient.get<BillListResponse>(
      "/bill/list",
      { params },
    );
    return response.data;
  },

  detail: async (
    id: string,
  ): Promise<{ status: boolean; data: BillData }> => {
    const response = await apiClient.get(`/bill/details/${id}`);
    return response.data;
  },

  create: async (
    data: Record<string, unknown>,
    receiptId: string
  ): Promise<{ status: boolean; message: string; billId: string }> => {
    const response = await apiClient.post(
      `/bill/create/${receiptId}`,
      data
    );

    return response.data;
  },

  edit: async (
    id: string,
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; data?: BillData }> => {
    const response = await apiClient.put(`/bill/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/bill/delete/${id}`);
    return response.data;
  },
};
