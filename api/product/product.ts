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

export interface ProductData {
  id: string;
  productId: string,
  name: string;
  productCode: string;
  type: string;
  productScope: string;
  description: string;
  price: number;
  manufacture?: string;
  uom?: string;
  brand?: string;
  edit?: unknown;
  delete?: unknown;
  view?: unknown;
}


export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: number;
  companyId?: string;
}


export interface ProductListResponse {
  tools?: Tool[];
  filter?: any[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: ProductData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}



export const productApi = {
  list: async (params: ProductListParams): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>(
      "/product/list",
      { params },
    );
    return response.data;
  },

  detail: async (
    id: string,
  ): Promise<{ status: boolean; data: ProductData }> => {
    const response = await apiClient.get(`/product/details/${id}`);
    return response.data;
  },

  create: async (
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; productId?: string }> => {
    const response = await apiClient.post("/product/create", data);
    return response.data;
  },

  edit: async (
    id: string,
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; data?: ProductData }> => {
    const response = await apiClient.put(`/product/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/product/delete/${id}`);
    return response.data;
  },
};

