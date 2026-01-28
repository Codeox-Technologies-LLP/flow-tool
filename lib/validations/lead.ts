import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),

  title: z.string().optional(),
  companyName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  expectedValue: z.union([z.string(), z.number()]).optional(),
  source: z.string().optional(),
  industry: z.string().optional(),

  country: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  zipCode: z.string().optional(),

  leadOwner: z.string().optional(),
  assignedTo: z.string().optional(),

  website: z.string().optional(),
  socialLinks: z.string().optional(),
  description: z.string().optional(),
});


export type LeadFormData = z.infer<typeof leadSchema>;
