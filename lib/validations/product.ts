import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["goods", "service"]),
  productScope: z.enum(["company", "organisation"]),
  productCode: z.string().optional(),
  Product: z.string().optional(),
  brand: z.string().optional(),
  manufacture: z.string().optional(),
  description: z.string().optional(),
  image: z.any().optional(),
  price: z.number().min(0).optional(),
  uom: z.string().optional(),
  isActive: z.boolean().optional(),
  companyId: z.string().nullable().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
