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


export interface CategoryData extends Record<string, unknown> {
  id: string;
  code: string;
  name: string;
  edit?: unknown;
  delete?: unknown;
}

export interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
//   sortBy?: string;
//   sortOrder?: number;
}

export interface CategoryListResponse {
  tools?: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: CategoryData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}


export const categoryApi = {
  list: async (
    params: CategoryListParams
  ): Promise<CategoryListResponse> => {
    const response = await apiClient.get<CategoryListResponse>(
      "/category/list",
      { params }
    );
    return response.data;
  },

  create: async (
    data: Record<string, unknown>
  ): Promise<{ status: boolean; message: string; categoryId?: string }> => {
    const response = await apiClient.post("/category/create", data);
    return response.data;
  },

  edit: async (
    id: string,
    data: Record<string, unknown>
  ): Promise<{ status: boolean; message: string; data?: CategoryData }> => {
    const response = await apiClient.put(`/category/edit/${id}`, data);
    return response.data;
  },

  delete: async (
    id: string
  ): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(
      `/category/delete/${id}`
    );
    return response.data;
  },
};
