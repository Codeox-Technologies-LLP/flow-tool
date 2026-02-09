"use client";

import { billApi } from "@/api/bill/bill";
import { dealApi } from "@/api/deal/deal";
import { deliveryApi } from "@/api/delivery/delivery";
import { leadApi } from "@/api/lead/lead";
import { purchaseApi } from "@/api/purchase/purchase";
import { quotationApi } from "@/api/quotations/quotation";
import { receiptApi } from "@/api/receipt/receipt";

export type StatusEntity = "deal" | "lead" | "quotation" | "purchase" | "receipt" |"delivery" | "bill";

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
     case "receipt": {
      if (!payload.status) {
        throw new Error("receipt update requires status");
      }
      return receiptApi.edit(id, { status: payload.status });
    }
     case "delivery": {
      if (!payload.status) {
        throw new Error("delivery update requires status");
      }
      return deliveryApi.edit(id, { status: payload.status });
    }

    case "bill": {
      if (!payload.status) {
        throw new Error("delivery update requires status");
      }
      return billApi.edit(id, { status: payload.status });
    }

    default:
      throw new Error("Unsupported entity type");
  }
}
