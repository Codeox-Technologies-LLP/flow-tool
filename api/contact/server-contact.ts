import { serverApiClient } from "@/api/server-fetch";

interface ContactClient {
  _id: string;
  name: string;
}

interface ContactDetailData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  orgId: string;
  companyId: string;
  client: ContactClient | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ContactDetailResponse {
  status?: boolean;
  data?: ContactDetailData;
  message?: string;
}

export async function getContactDetail(id: string): Promise<ContactDetailResponse> {
  try {
    const response = await serverApiClient.get<ContactDetailData>(
      `/contacts/detail/${id}`
    );
    
    if (response) {
      return {
        status: true,
        data: response,
      };
    }
    
    return {
      status: false,
      message: "Contact not found",
    };
  } catch (error) {
    console.error("Error fetching contact detail:", error);
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to fetch Contact",
    };
  }
}


