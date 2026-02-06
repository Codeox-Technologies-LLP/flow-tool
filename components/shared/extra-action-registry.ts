import { deliveryApi } from "@/api/delivery/delivery";
import { receiptApi } from "@/api/receipt/receipt";

type ExtraActionHandler = (args: { entityId: string }) => Promise<void>;

export const extraActionRegistry: Record<string, ExtraActionHandler> = {
  RECEIPT_VALIDATE: async ({ entityId }) => {
    await receiptApi.validate(entityId);
  },
  DELIVERY_VALIDATE: async ({ entityId }) => {
    await deliveryApi.validate(entityId);
  },
};