import { z } from "zod";

export const contactSchema = z.object({
  clientId: z.string().optional(),
  name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;