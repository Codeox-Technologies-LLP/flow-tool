import { serverApiClient } from "@/api/server-fetch";
import type { ManufacturerData } from "./manufacturer";

export async function getManufacturerDetail(id: string): Promise<{ status: boolean; data: ManufacturerData } | null>
 {
  return serverApiClient.get<{ status: boolean; data: ManufacturerData }>(
    `/manufacturer/detail/${id}`
  );
}

