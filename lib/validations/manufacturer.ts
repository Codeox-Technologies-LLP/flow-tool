import { z } from "zod";

export const manufacturerSchema = z.object({
    name: z.string().min(1, "Manufacturer name is required")
});

export type ManufacturerFormData = z.infer<typeof manufacturerSchema>;
