import { z } from "zod";

export const productSchema = z.object({
  product: z.string().min(1, "Item is required"),
  description: z.string().optional(),
  qty: z.coerce.number().min(1),
  rate: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).max(100),
  amount: z.coerce.number(),
});

export const quotationSchema = z.object({
  relatedTo: z.string().min(1, "Client is required"),
  warehouseId: z.string().optional(),
  dealId: z.string().optional(),
  assignedTo: z.string().optional(),
  contactId: z.string().optional(),

  expiryDate: z.string().optional(),
  currency: z.string().optional(),

  products: z.array(productSchema).min(1, "Add at least one product"),

  amount: z.coerce.number().min(0),
  status: z.enum(["draft", "sent", "confirmed", "cancelled"]).optional(),
});


export type QuotationFormData = z.infer<typeof quotationSchema>;
