import { serverApiClient } from "@/api/server-fetch";
import type { WarehouseData } from "./warehouse";
import type { WarehouseAuditResponse } from "@/types/warehouse";

export async function getWarehouseDetail(
  id: string
): Promise<{ status: boolean; data: WarehouseData } | null> {
  return serverApiClient.get<{ status: boolean; data: WarehouseData }>(
    `/warehouse/detail/${id}`
  );
}

export async function getWarehouseAudit(
  id: string
): Promise<WarehouseAuditResponse | null> {
  return serverApiClient.get<WarehouseAuditResponse>(`/warehouse/audit/${id}`);
}
