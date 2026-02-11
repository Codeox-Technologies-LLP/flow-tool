"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";

import {
  quotationSchema,
  QuotationFormData,
} from "@/lib/validations/quotation";
import { quotationApi } from "@/api/quotations/quotation";
import { useEntityDraftStore } from "@/stores/useEntityDraftStore";
import { dealApi } from "@/api/deal/deal";
import { clientApi } from "@/api/client/client";

/* ===================== TYPES ===================== */

interface QuotationFormProps {
  mode: "create" | "edit";
    quotation?: {
        relatedTo: string;
        contactId?: string;
        assignedTo?: string;
        dealId?: string;
        currency?: string;
        billingAddress?: { street?: string; city?: string; state?: string; country?: string; zip?: string };
        deliveryAddress?: { street?: string; city?: string; state?: string; country?: string; zip?: string };
        expiryDate?: string;
        amount?: number;
        status?: string;
        products?: Array<{
            product: string;
            productName: string;
            qty: number;
            rate: number;
            discount: number;
            amount: number;
            description: string;
        }>;
    };
  quotationId?: string;
}

/* ===================== CONSTANTS ===================== */

const currencies = [
  { _id: "INR", name: "INR (₹)" },
  { _id: "USD", name: "USD ($)" },
  { _id: "EUR", name: "EUR (€)" },
];

/* ===================== COMPONENT ===================== */

export function QuotationForm({
  mode,
  quotation,
  client,
  deliveryId,
  quotationId,
}: QuotationFormProps) {
  const router = useRouter();
    const searchParams = useSearchParams();
    const routeDealId = searchParams.get("dealId");
  const [loading, setLoading] = useState(false);

  /* ---------------- DROPDOWN DATA ---------------- */
  const [clients, setClients] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
    const [billingAddresses, setBillingAddresses] = useState<Array<{ _id: string; name: string; data: any }>>([]);
    const [deliveryAddresses, setDeliveryAddresses] = useState<Array<{ _id: string; name: string; data: any }>>([]);

    // Loading states
    const [loadingClients, setLoadingClients] = useState(true);
    const [loadingDeals, setLoadingDeals] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);

    // Draft store
    const setDraft = useEntityDraftStore((s) => s.setDraft);
    const clearDraft = useEntityDraftStore((s) => s.clearDraft);
    const draft = useEntityDraftStore((s) => s.drafts["quotation:create"]);

const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
} = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: mode === "edit" && quotation ? {
        relatedTo: quotation.relatedTo || "",
        contactId: quotation.contactId || "",
        assignedTo: quotation.assignedTo || "",
        dealId: quotation.dealId || "",
        currency: quotation.currency || "",
        billingAddress: quotation.billingAddress ? "billing" : "",
        deliveryAddress: quotation.deliveryAddress ? `${quotation.deliveryAddress.street}-${quotation.deliveryAddress.city}` : "",
        expiryDate: quotation.expiryDate ? quotation.expiryDate.split("T")[0] : "",
        status: quotation.status || "draft",
        products: quotation.products || [{ product: "", productName: "", qty: 1, rate: 0, discount: 0, amount: 0, description: "" }],
        amount: quotation.amount || 0,
    } : {
    relatedTo: "",
    contactId: "",
    assignedTo: "",
    dealId: routeDealId || "",
    currency: "INR",
        billingAddress: "",
        deliveryAddress: "",
        expiryDate: "",
        status: "draft",
        products: [{ product: "", productName: "", qty: 1, rate: 0, discount: 0, amount: 0, description: "" }],
        amount: 0,
    },
  });

    const { fields, append, remove } = useFieldArray({ control, name: "products" });
    const selectedClient = watch("relatedTo");
    const watchedProducts = watch("products");

    // Fetch initial data using dropdown APIs
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [c, u, p, d] = await Promise.all([
                    quotationApi.dropdownClients(),
                    quotationApi.dropdownUsers(),
                    quotationApi.dropdownProducts(),
                    quotationApi.dropdownDeals(),
                ]);

                setClients(c);
                setUsers(u);
                setProducts(p);
                setDeals(d);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                toast.error("Failed to load form data");
            } finally {
                setLoadingClients(false);
                setLoadingProducts(false);
                setLoadingUsers(false);
                setLoadingDeals(false);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch client-specific data
    useEffect(() => {
        if (!selectedClient) {
            setBillingAddresses([]);
            setDeliveryAddresses([]);
            setContacts([]);
            return;
        }

        const fetchClientData = async () => {
            try {
                const clientDetails = await clientApi.detail(selectedClient);

                if (clientDetails?.data) {
                    if (clientDetails.data.billingAddress) {
                        setBillingAddresses([{
                            _id: "billing",
                            name: `${clientDetails.data.billingAddress.street}, ${clientDetails.data.billingAddress.city}, ${clientDetails.data.billingAddress.state}`,
                            data: clientDetails.data.billingAddress,
                        }]);
                    }
                    if (clientDetails.data.deliveryAddresses?.length) {
                        setDeliveryAddresses(clientDetails.data.deliveryAddresses.map((addr: any, idx: number) => ({
                            _id: addr._id || `delivery-${idx}`,
                            name: `${addr.street}, ${addr.city}, ${addr.state}, ${addr.country}`,
                            data: addr,
                        })));
                    }
                    if (clientDetails.data.contacts?.length) {
                        setContacts(clientDetails.data.contacts.map((contact: any) => ({
                            _id: contact.id || contact._id,
                            name: `${contact.name} (${contact.email})`,
                        })));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch client data:", error);
                toast.error("Failed to load client data");
            }
        };
        fetchClientData();
    }, [selectedClient]);

    // Hydrate from deal if creating from deal
    useEffect(() => {
        if (!routeDealId || mode !== "create") return;

        const hydrateFromDeal = async () => {
            try {
                const res: any = await dealApi.detail(routeDealId);
                
                setDraft("quotation:create", {
                    routeDealId,
                    relatedTo: `${res.clientId}`,
                    contactId: `${res.contactId}`,
                    expiryDate: res.closeDate ? new Date(res.closeDate).toISOString().split("T")[0] : "",
                });
            } catch (error) {
                console.error("Failed to hydrate from deal:", error);
            }
        };

        hydrateFromDeal();
    }, [routeDealId, mode, setDraft]);

    // Apply draft data
    useEffect(() => {
        if (!draft || mode !== "create" || clients.length === 0) return;

        Object.entries(draft).forEach(([key, value]) => {
            setValue(key as any, value as any, {
                shouldValidate: false,
                shouldDirty: false,
            });
        });
    }, [draft, mode, clients.length, setValue]);

    // Clear draft on unmount
    useEffect(() => {
        return () => {
            clearDraft("quotation:create");
        };
    }, [clearDraft]);

    // Calculations
    const calculateRowAmount = (row: any) => {
        const qty = Number(row.qty) || 0;
        const rate = Number(row.rate) || 0;
        const discount = Number(row.discount) || 0;
        const base = qty * rate;
        const discountAmt = (base * discount) / 100;
        return (base - discountAmt).toFixed(2);
    };

    const calculateSubtotal = () => watchedProducts.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0);
    
    const calculateTotalDiscount = () => watchedProducts.reduce((sum, item) => {
        const base = (Number(item.qty) || 0) * (Number(item.rate) || 0);
        return sum + (base * (Number(item.discount) || 0)) / 100;
    }, 0);
    
    const calculateTotal = () => calculateSubtotal() - calculateTotalDiscount();

    // Update amounts when products change
    useEffect(() => {
        watchedProducts?.forEach((row, index) => {
            const amount = parseFloat(calculateRowAmount(row));
            setValue(`products.${index}.amount`, amount);
        });
        setValue("amount", calculateTotal());
    }, [watchedProducts, setValue]);

    const onSubmit = async (data: QuotationFormData) => {
        try {
            setLoading(true);
            const payload = {
                relatedTo: data.relatedTo,
                contactId: data.contactId || undefined,
                assignedTo: data.assignedTo || undefined,
                dealId: data.dealId || routeDealId || undefined,
                currency: data.currency || "INR",
                billingAddress: billingAddresses.find(addr => addr._id === data.billingAddress)?.data,
                deliveryAddress: deliveryAddresses.find(addr => addr._id === data.deliveryAddress)?.data,
                expiryDate: data.expiryDate || undefined,
                amount: calculateTotal(),
                status: data.status || "draft",
                products: data.products.map(p => ({
                    product: p.product,
                    qty: p.qty,
                    rate: p.rate,
                    discount: p.discount,
                    description: p.description,
                })),
            };

            const response = mode === "create"
              ? await quotationApi.create(payload)
              : await quotationApi.edit(quotationId!, payload);

          if (response.status) {
              toast.success(`Quotation ${mode === "create" ? "created" : "updated"} successfully!`);
              
          if (mode === "create") {
              clearDraft("quotation:create");
              if (response.quotationId) {
                  router.push(`/flow-tool/sales/quotations/${response.quotationId}`);
              } else {
                  router.push("/flow-tool/sales/quotations");
              }
          } else {
              router.refresh();
          }
      } else {
        toast.error(`Failed to ${mode} Quotation`, { description: response.message });
      }
    } catch (error) {
      toast.error(`Failed to ${mode} Quotation`, {
          description: error instanceof Error ? error.message : "An error occurred",
      });
      console.error(`Error ${mode}ing Quotation:`, error);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quotation Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* BASIC INFO */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="relatedTo"
              label="Client"
              type="dropdown"
              placeholder="Select client"
              searchPlaceholder="Search clients..."
              emptyText="No clients found"
              required
              options={clients}
              value={selectedClient}
              onValueChange={(value) => setValue("relatedTo", value, { shouldValidate: true })}
              loading={loadingClients}
              error={errors.relatedTo}
          />

          {contacts.length > 0 && (
            <FormField
              id="contactId"
              label="Contact"
              type="dropdown"
              placeholder="Select contact (optional)"
              searchPlaceholder="Search contacts..."
              emptyText="No contacts found"
              options={contacts}
              value={watch("contactId")}
              onValueChange={(value) => setValue("contactId", value, { shouldValidate: true })}
              disabled={!selectedClient}
              error={errors.contactId}
            />
        )}

         {billingAddresses.length > 0 && (
                          <FormField
                              id="billingAddress"
                              label="Billing Address"
                              type="dropdown"
                              placeholder="Select billing address (optional)"
                              searchPlaceholder="Search addresses..."
                              emptyText="No addresses found"
                              options={billingAddresses}
                              value={watch("billingAddress")}
                              onValueChange={(value) => setValue("billingAddress", value, { shouldValidate: true })}
                              disabled={!selectedClient}
                              error={errors.billingAddress}
                          />
                      )}

                      {deliveryAddresses.length > 0 && (
                          <FormField
                              id="deliveryAddress"
                              label="Delivery Address"
                              type="dropdown"
                              placeholder="Select delivery address (optional)"
                              searchPlaceholder="Search addresses..."
                              emptyText="No addresses found"
                              options={deliveryAddresses}
                              value={watch("deliveryAddress")}
                              onValueChange={(value) => setValue("deliveryAddress", value, { shouldValidate: true })}
                              disabled={!selectedClient}
                              error={errors.deliveryAddress}
                          />
                      )}

            <FormField
              id="assignedTo"
              label="Assigned To"
              type="dropdown"
              placeholder="Select user (optional)"
              searchPlaceholder="Search users..."
              emptyText="No users found"
              options={users}
              value={watch("assignedTo")}
              onValueChange={(value) => setValue("assignedTo", value, { shouldValidate: true })}
              loading={loadingUsers}
              error={errors.assignedTo}
            />

            <FormField
              id="dealId"
              label="Deal"
              type="dropdown"
              placeholder="Select deal (optional)"
              searchPlaceholder="Search deals..."
              emptyText="No deals found"
              options={deals}
              value={watch("dealId")}
              onValueChange={(value) => setValue("dealId", value, { shouldValidate: true })}
              loading={loadingDeals}
              error={errors.dealId}
            />

            <FormField
              id="currency"
              label="Currency"
              type="dropdown"
              placeholder="Select currency"
              searchPlaceholder="Search currency..."
              emptyText="No currencies found"
              required
              options={currencies}
              value={watch("currency")}
              onValueChange={(value) => setValue("currency", value, { shouldValidate: true })}
              error={errors.currency}
            />

            <FormField
              id="expiryDate"
              label="Expiry Date"
              type="date"
              placeholder="Select expiry date"
              register={register("expiryDate")}
              error={errors.expiryDate}
            />

                     
                  </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 text-left">Item</th>
                                    <th className="p-2 text-center">Qty</th>
                                    <th className="p-2 text-center">Rate</th>
                                    <th className="p-2 text-center">Discount %</th>
                                    <th className="p-2 text-right">Amount</th>
                                    <th className="p-2 text-center w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((field, index) => (
                                    <tr key={field.id} className="border-t">
                                        <td className="p-2 align-top">
                                            <select
                                                className="w-full border rounded p-1 mb-1"
                                                value={watchedProducts[index]?.product || ""}
                                                onChange={(e) => {
                                                    const productId = e.target.value;
                                                    setValue(`products.${index}.product`, productId, { shouldValidate: true });
                                                    const product = products.find((p) => p._id === productId);
                                                    if (product) {
                                                        setValue(`products.${index}.rate`, product.price);
                                                        setValue(`products.${index}.productName`, product.name);
                                                    }
                                                }}
                                            >
                                                <option value="">Select product</option>
                                                {products.map((product) => (
                                                    <option key={product._id} value={product._id}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <textarea
                                                {...register(`products.${index}.description`)}
                                                rows={2}
                                                placeholder="Description (optional)"
                                                className="w-full border rounded p-1 text-sm resize-none"
                                            />
                                            {errors.products?.[index]?.product && (
                                                <p className="text-xs text-red-500 mt-1">{errors.products[index]?.product?.message}</p>
                                            )}
                                        </td>
                                        <td className="p-2 align-top text-center">
                                            <input
                                                type="number"
                                                {...register(`products.${index}.qty`, { valueAsNumber: true })}
                                                min={0}
                                                className="w-20 border rounded p-1 text-right"
                                            />
                                        </td>
                                        <td className="p-2 align-top text-center">
                                            <input
                                                type="number"
                                                {...register(`products.${index}.rate`, { valueAsNumber: true })}
                                                min={0}
                                                step="0.01"
                                                className="w-20 border rounded p-1 text-right"
                                            />
                                        </td>
                                        <td className="p-2 align-top text-center">
                                            <input
                                                type="number"
                                                {...register(`products.${index}.discount`, { valueAsNumber: true })}
                                                min={0}
                                                max={100}
                                                step="0.01"
                                                className="w-20 border rounded p-1 text-right"
                                            />
                                        </td>
                                        <td className="p-2 text-right text-[15px] font-semibold align-top">
                                            ₹ {calculateRowAmount(watchedProducts[index])}
                                        </td>
                                        <td className="p-2 align-top text-center">
                                            {fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ product: "", qty: 1, rate: 0, discount: 0, amount: 0, description: "" })}
                        className="mt-3"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>

                    <div className="flex justify-end mt-6">
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Subtotal:</span>
                                <span>₹ {calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-red-600">
                                <span className="font-medium">Discount:</span>
                                <span>- ₹ {calculateTotalDiscount().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Total:</span>
                                <span>₹ {calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

        <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/flow-tool/sales/quotations")} disabled={loading}>
                Cancel
            </Button>
            <Button type="submit" disabled={loading} variant="outline">
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {mode === "create" ? "Creating..." : "Updating..."}
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        {mode === "create" ? "Create Quotation" : "Update Quotation"}
                    </>
                )}
            </Button>
        </div>
    </form>
  );
}
