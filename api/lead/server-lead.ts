import { serverApiClient } from "@/api/server-fetch";
import { LeadData } from "./lead";
import { LeadAuditResponse } from "@/types/lead";

export async function getLeadDetail(
  id: string
): Promise<{ status: boolean; data: LeadData } | null> {
  return serverApiClient.get<{ status: boolean; data: LeadData }>(
    `/enquiry/detail/${id}`
  );
}

export async function getLeadAudit(
  id: string
): Promise<LeadAuditResponse | null> {
  return serverApiClient.get<LeadAuditResponse>(`/enquiry/audit/${id}`);
}
