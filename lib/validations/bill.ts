import { z } from "zod";

export const billItemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  productName: z.string().optional(),
  qty: z.number().min(1),
  price: z.number().min(0),
  discount: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
});

export const billSchema = z.object({
  id: z.string().optional(),

  operationType: z.string().optional(),
  vendorId: z.string().min(1, "Vendor is required"),
  warehouseId: z.string().optional(),
  locationId: z.string().min(1, "Location is required"),

  deliveryDate: z.string().optional(),

  products: z.array(billItemSchema).min(1),

  subtotal: z.number(),
  discountTotal: z.number(),
  total: z.number(),
  amount: z.number(),
});

export type BillFormData = z.infer<typeof billSchema>;
