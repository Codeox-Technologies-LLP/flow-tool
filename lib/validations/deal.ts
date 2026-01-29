import { z } from "zod";

export const dealSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  contactId: z.string().nullable().optional(),
  title: z.string().min(1, "Deal name is required").max(200, "Deal name must be less than 200 characters"),
  value: z.number().min(0, "Amount must be positive").optional(),
  stage: z.string().optional(),
  probability: z.number().min(0, "Probability must be between 0 and 100").max(100, "Probability must be between 0 and 100").optional(),
  closeDate: z.string().optional(),
  note: z.string().max(1000, "Description must be less than 1000 characters").optional(),
});

export type DealFormData = z.infer<typeof dealSchema>;