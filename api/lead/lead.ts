import { apiClient } from "@/api/axios";
import type { LeadAuditResponse } from "@/types/lead";


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
    | "status"
    | "date"
    | "dropdown";
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

export interface LeadData extends Record<string, unknown> {
  id: string;
  enquiryId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  createdAt?: string;
  status: string;
  remark?: string;
  view?: unknown;
  edit?: unknown;
  delete?: unknown;
}


export interface LeadAnalyticsSummary {
  totalLeads: number;
  new: number;
  contacted: number;
  working: number;
  won: number;
  loss: number;
  activeLeads: number;
  inactiveLeads: number;
}

export interface LeadAnalyticsAlerts {
  lowPriority: number;
  highPriority: number;
  needsAttention: number;
}

export interface LeadStatusDistribution {
  active: number;
  inactive: number;
}

export interface LeadAnalytics {
  summary: LeadAnalyticsSummary;
  alerts: LeadAnalyticsAlerts;
  statusDistribution: LeadStatusDistribution;
}


export interface LeadListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: number;
}


export interface LeadListResponse {
  analytics?: LeadAnalytics;
  tools?: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    search: boolean;
    pagination: boolean;
    components: TableComponent[];
    data: LeadData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}


export const leadApi = {
  list: async (params: LeadListParams): Promise<LeadListResponse> => {
    const response = await apiClient.get<LeadListResponse>("/enquiry/list", { params });
    return response.data;
  },

  detail: async (id: string): Promise<{ status: boolean; data: LeadData }> => {
    const response = await apiClient.get(`/enquiry/detail/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>): Promise<{ status: boolean; message: string; enquiryId?: string }> => {
    const response = await apiClient.post("/enquiry/create", data);
    return response.data;
  },

  edit: async (id: string, data: Record<string, unknown>): Promise<{ status: boolean; message: string; data?: LeadData }> => {
    const response = await apiClient.put(`/enquiry/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete("/enquiry/delete", { data: { ids: [id] } });
    return response.data;
  },

  audit: async (id: string): Promise<LeadAuditResponse> => {
    const response = await apiClient.get<LeadAuditResponse>(`/enquiry/audit/${id}`);
    return response.data;
  },
};
