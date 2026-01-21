import { z } from "zod";

export const locationSchema = z.object({
  warehouseId: z.string().min(1, "Warehouse is required"),
  parentId: z.string().optional().nullable(),
  name: z.string().min(1, "Location name is required"),
  type: z.string().optional(),
});

export type LocationFormData = z.infer<typeof locationSchema>;
