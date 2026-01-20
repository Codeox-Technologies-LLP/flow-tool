import { z } from "zod";

export const warehouseSchema = z.object({
  name: z.string().min(1, "Warehouse name is required"),
  shortCode: z.string().optional(),
  image: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  description: z.string().optional(),
});

export type WarehouseFormData = z.infer<typeof warehouseSchema>;
