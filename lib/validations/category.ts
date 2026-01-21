import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    code: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
