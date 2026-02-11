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

export interface VendorData extends Record<string, unknown> {
  _id: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  updatedAt?: string;
  edit?: unknown;
  delete?: unknown;
}

export interface VendorDetailData {
  _id: string;
  id: string;
  orgId: string;
  companyId: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  createdAt: string;
  updatedAt: string;
}


export interface VendorListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: number;
}

export interface VendorListResponse {
  tools?: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: VendorData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}

export interface VendorDropdownItem {
  _id: string;
  name: string;
  address: {
    name: string;
    phone: string;
    email: string;
    address: string;
    country: string;
    city: string;
    state: string;
  };
}

export const vendorApi = {
  list: async (
    params: VendorListParams
  ): Promise<VendorListResponse> => {
    const response = await apiClient.get<VendorListResponse>(
      "/vendor/list",
      { params }
    );
    return response.data;
  },

  detail: async (
    id: string
  ): Promise<{ status: boolean; data: VendorDetailData }> => {
    const response = await apiClient.get(
      `/vendor/detail/${id}`
    );
    return response.data;
  },

  create: async (
    data: Record<string, unknown>
  ): Promise<{ status: boolean; message: string; vendorId?: string }> => {
    const response = await apiClient.post("/vendor/create", data);
    return response.data;
  },

  edit: async (
    id: string,
    data: Record<string, unknown>
  ): Promise<{ status: boolean; message: string; data?: VendorDetailData }> => {
    const response = await apiClient.put(`/vendor/edit/${id}`, data);
    return response.data;
  },

  delete: async (
    id: string
  ): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/vendor/delete/${id}`);
    return response.data;
  },

  dropdown: async (): Promise<VendorDropdownItem[]> => {
    const response = await apiClient.get("/vendor/dropdown");
    return response.data;
  },
};