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


export interface ManufacturerData extends Record<string, unknown> {
  id: string;
  name: string;
  edit?: unknown;
  delete?: unknown;
}

export interface manufacturerListParams {
  page?: number;
  limit?: number;
  search?: string;
//   sortBy?: string;
//   sortOrder?: number;
}

export interface ManufacturerListResponse {
  tools?: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: ManufacturerData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}


export const manufacturerApi = {
  list: async (
    params: manufacturerListParams
  ): Promise<ManufacturerListResponse> => {
    const response = await apiClient.get<ManufacturerListResponse>(
      "/manufacturer/list",
      { params }
    );
    return response.data;
  },

  create: async (
    data: Record<string, unknown>
  ): Promise<{ status: boolean; message: string; manufacturerId?: string }> => {
    const response = await apiClient.post("/manufacturer/create", data);
    return response.data;
  },

  edit: async (
    id: string,
    data: Record<string, unknown>
  ): Promise<{ status: boolean; message: string; data?: ManufacturerData }> => {
    const response = await apiClient.put(`/manufacturer/edit/${id}`, data);
    return response.data;
  },

  delete: async (
    id: string
  ): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(
      `/manufacturer/delete/${id}`
    );
    return response.data;
  },

  dropdown: async (): Promise<{_id: string; name: string;}[]> => {
    const response = await apiClient.get<{_id: string; name: string;}[]>("/manufacturer/dropdown");
    return response.data;
  },
};
