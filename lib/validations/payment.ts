import { z } from "zod";

export const paymentSchema = z.object({
  relatedTo: z.string().min(1, "client is required"),
  createdAt: z.string(),
  paymentMethod: z.string(),
  amount: z.number(),
  refNo: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
