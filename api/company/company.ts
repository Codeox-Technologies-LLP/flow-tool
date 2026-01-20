import { apiClient } from "@/api/axios";

export interface CompanySetupRequest {
  name: string;
  legalName?: string;
  shortCode?: string;
  image?: string;
  phone?: string;
  email?: string;
  website?: string;
  currency?: {
    code: string;
    symbol: string;
    name: string;
  };
  timezone?: string;
  country?: {
    code: string;
    name: string;
  };
  industry?: string;
  businessType?: string;
  operationType?: string;
  description?: string;
  status?: string;
  parentId?: string | null;
  addressDetails?: {
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface CompanySetupResponse {
  status: boolean;
  message: string;
  companyId?: string;
}

export const companyApi = {
  setup: async (data: CompanySetupRequest): Promise<CompanySetupResponse> => {
    const response = await apiClient.post<CompanySetupResponse>(
      "/company/user/create",
      data
    );
    return response.data;
  },
};
