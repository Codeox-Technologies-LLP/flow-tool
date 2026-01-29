import { z } from "zod";

export const paymentMadeSchema = z.object({
  vendorId: z.string().min(1, "vendor is required"),
  createdAt: z.string(),
  paymentMadeMethod: z.string(),
  amount: z.number(),
  refNo: z.string().optional(),
});

export type PaymentMadeFormData = z.infer<typeof paymentMadeSchema>;
