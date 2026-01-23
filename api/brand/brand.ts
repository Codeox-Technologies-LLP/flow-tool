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


export interface BrandData extends Record<string, unknown> {
  id: string;
  name: string;
  edit?: unknown;
  delete?: unknown;
}

export interface brandListParams {
  page?: number;
  limit?: number;
  search?: string;
//   sortBy?: string;
//   sortOrder?: number;
}

export interface BrandListResponse {
  tools?: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: BrandData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}


export const brandApi = {
  list: async (
    params: brandListParams
  ): Promise<BrandListResponse> => {
    const response = await apiClient.get<BrandListResponse>(
      "/brand/list",
      { params }
    );
    return response.data;
  },

  create: async (
    data: Record<string, unknown>
  ): Promise<{ status: boolean; message: string; brandId?: string }> => {
    const response = await apiClient.post("/brand/create", data);
    return response.data;
  },

  edit: async (
    id: string,
    data: Record<string, unknown>
  ): Promise<{ status: boolean; message: string; data?: BrandData }> => {
    const response = await apiClient.put(`/brand/edit/${id}`, data);
    return response.data;
  },

  delete: async (
    id: string
  ): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(
      `/brand/delete/${id}`
    );
    return response.data;
  },

  dropdown: async (): Promise<{_id: string; name: string;}[]> => {
    const response = await apiClient.get<{_id: string; name: string;}[]>("/brand/dropdown");
    return response.data;
  },

  detail: async (id: string): Promise<{ status: boolean; data: BrandData }> => {
      const response = await apiClient.get(`/brand/detail/${id}`);
      return response.data;
    },
};
