"use client";

import { dealApi } from "@/api/deal/deal";
import { leadApi } from "@/api/lead/lead";
import { purchaseApi } from "@/api/purchase/purchase";
import { quotationApi } from "@/api/quotations/quotation";

export type StatusEntity = "deal" | "lead" | "quotation" | "purchase";

export async function updateStatus(
  entity: StatusEntity,
  id: string,
  payload: { order?: number; status?: string }
) {
  switch (entity) {
    case "deal": {
      if (payload.order === undefined) {
        throw new Error("Deal update requires order");
      }
      return dealApi.edit(id, { order: payload.order });
    }

    case "lead": {
      if (!payload.status) {
        throw new Error("Lead update requires status");
      }
      return leadApi.edit(id, { status: payload.status });
    }
    case "quotation": {
      if (!payload.status) {
        throw new Error("quotation update requires status");
      }
      return quotationApi.edit(id, { status: payload.status });
    }
    case "purchase": {
      if (!payload.status) {
        throw new Error("purchase update requires status");
      }
      return purchaseApi.edit(id, { status: payload.status });
    }

    default:
      throw new Error("Unsupported entity type");
  }
}
