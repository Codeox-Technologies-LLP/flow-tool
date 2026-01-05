import { z } from "zod";

export const companySetupSchema = z.object({
  // Required field
  name: z.string().min(2, "Company name must be at least 2 characters"),

  // Optional fields
  legalName: z.string().optional(),
  shortCode: z.string().optional(),
  image: z
    .object({
      url: z.string().optional(),
      publicId: z.string().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      format: z.string().optional(),
    })
    .optional(),
  industry: z.string().optional(),
  website: z
    .string()
    .url("Please enter a valid URL")
    .or(z.literal(""))
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email")
    .or(z.literal(""))
    .optional(),
  phone: z.string().optional(),
  description: z.string().optional(),

  // Address Details (all optional)
  country: z
    .object({
      code: z.string(),
      name: z.string(),
    })
    .optional(),
  addressDetails: z
    .object({
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),

  // Currency (optional)
  currency: z
    .object({
      code: z.string(),
      symbol: z.string(),
      name: z.string(),
    })
    .optional(),

  // Business Settings (all optional)
  businessType: z.string().optional(),
  operationType: z.string().optional(),
  timezone: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  parentId: z.string().nullable().optional(),
});

export type CompanyFormData = z.infer<typeof companySetupSchema>;
