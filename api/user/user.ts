import { apiClient } from "@/api/axios";

// Table header for User
export interface TableHeader {
  name: string;
  displayName: string;
  sort?: boolean;
  sortOrder?: number;
}

// Components in the table (text, action, badge, etc.)
export interface TableComponent {
  name: string;
  displayName: string;
  component: "text" | "action" | "badge" | "custom" | "number" | "currency" | "status";
}

// Tool buttons for actions like "Add User"
export interface Tool {
  name: string;
  displayName: string;
  icon: string;
  bgColor?: string;
  txtColor?: string;
  width?: string;
  route?: string;
}

// Individual User row
export interface UserData {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  appRole: string;
  appRoleData?: {
    _id: string;
    roleName: string;
  };
  edit?: {
    name: string;
    icon: string;
    displayName: string;
    id: string;
  };
  delete?: {
    name: string;
    icon: string;
    displayName: string;
    id: string;
  };
}

// Params for fetching user list
export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Response structure for user list
export interface UserListResponse {
  tools?: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: UserData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}

export const userApi = {
  list: async (params: UserListParams): Promise<UserListResponse> => {
    const response = await apiClient.get<UserListResponse>("/user-management/list", {
      params,
    });
    return response.data;
  },

  create: async (
    data: Record<string, unknown>
  ): Promise<{ status: boolean; message: string; userId?: string }> => {
    const response = await apiClient.post("/user-management/create", data);
    return response.data;
  },

  edit: async (
    id: string,
    data: Record<string, unknown>
  ): Promise<{ status: boolean; message: string; data?: UserData }> => {
    const response = await apiClient.put(`/user-management/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/user-management/delete`, {
      data: { ids: [id] },
    });
    return response.data;
  },
};
