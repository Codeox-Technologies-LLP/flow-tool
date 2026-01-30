import { z } from "zod";

// Product item schema
const productSchema = z.object({
  product: z.string().min(1, "Product is required"),
  productName: z.string().optional(),
  qty: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be 0 or greater"),
  discount: z.number().min(0, "Discount must be 0 or greater").max(100, "Discount cannot exceed 100%"),
  tax: z.number().min(0, "Tax must be 0 or greater").optional(),
  description: z.string().optional(),
});

// Main Invoice schema
export const invoiceSchema = z.object({
  relatedTo: z.string().min(1, "Client is required"),
  contactId: z.string().optional(),
  assignedTo: z.string().optional(),
  locationId: z.string().optional(),
  billingAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  dealId: z.string().optional(),
  quotationId: z.string().optional(),
  expiryDate: z.string().optional(),
  amount: z.number().optional(),
  status:  z.string().optional(),
  products: z.array(productSchema).min(1, "At least one product is required"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;