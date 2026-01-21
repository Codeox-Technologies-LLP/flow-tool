import { serverApiClient } from "@/api/server-fetch";
import { ProductData } from "./product";

export async function getProductDetail(
  id: string
): Promise<{ status: boolean; data: ProductData } | null> {
  return serverApiClient.get<{ status: boolean; data: ProductData }>(
    `/product/details/${id}`
  );
}
