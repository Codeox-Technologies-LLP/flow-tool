import { z } from "zod";

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

const contactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
});

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  source: z.string().optional(),
  type: z.string().optional(),
  owner: z.string().optional(),
  billingAddress: addressSchema.optional(),
  deliveryAddresses: z.array(addressSchema).default([]),
  contacts: z.array(contactSchema).default([]),
});

export type ClientFormData = z.infer<typeof clientSchema>;