import { z } from "zod";

export const purchaseItemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  productName: z.string().optional(),
  qty: z.number().min(1),
  price: z.number().min(0),
  discount: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
});

export const purchaseSchema = z.object({
  id: z.string().optional(),

  operationType: z.string().optional(),
  vendorId: z.string().min(1, "Vendor is required"),
  warehouseId: z.string().optional(),
  locationId: z.string().min(1, "Location is required"),

  deliveryDate: z.string().optional(),

  products: z.array(purchaseItemSchema).min(1),

  subtotal: z.number(),
  discountTotal: z.number(),
  total: z.number(),
  amount: z.number(),
});

export type PurchaseFormData = z.infer<typeof purchaseSchema>;
