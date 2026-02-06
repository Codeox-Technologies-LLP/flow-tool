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

export interface ReceiptData extends Record<string, unknown> {
  id: string;
  receiptId: string;
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

interface ReceiptProduct {
  product: string;
  qty: number;
  price: number;
  discount?: number;
  returnedCount?: number;
}

interface Receipt {
  id: string;
  receiptId: string;
  vendorId: string;
  locationId: string;
  amount?: number;
  subtotal?: number;
  discountTotal?: number;
  total?: number;
  products: ReceiptProduct[];
}

export interface ExtraButton {
  label: string;
  key?: string;
  route?: string;
}

export interface Action {
  key: string;
  label: string;
  order: number;
  active?: boolean;
  route?: string;

  extraButton?: ExtraButton;
  extraButtons?: ExtraButton[];
}

export interface ReceiptDetailData {
  receipt: Receipt;
  actions: Action[];
}


export interface ReceiptListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: number;
}

export interface ReceiptListResponse {
  tools?: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: ReceiptData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}

export const receiptApi = {
  list: async (params: ReceiptListParams): Promise<ReceiptListResponse> => {
    const response = await apiClient.get<ReceiptListResponse>(
      "/receipt/list",
      { params },
    );
    return response.data;
  },

  detail: async (
    id: string,
  ): Promise<{ status: boolean; data: ReceiptDetailData }> => {
    const response = await apiClient.get(`/receipt/detail/${id}`);
    return response.data;
  },

  create: async (
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; receiptId?: string }> => {
    const response = await apiClient.post("/receipt/create", data);
    return response.data;
  },

  edit: async (
    id: string,
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; data?: ReceiptData }> => {
    const response = await apiClient.patch(`/receipt/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/receipt/delete/${id}`);
    return response.data;
  },

  validate: async (
    id: string,
    data: Record<string, unknown> = {}
  ): Promise<{
    status: boolean;
    message: string;
    data?: ReceiptData;
  }> => {
    const response = await apiClient.patch(`/receipt/validate/${id}`, data);
    return response.data;
  },
};
