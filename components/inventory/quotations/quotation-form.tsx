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

/* ===================== TYPES ===================== */

interface QuotationFormProps {
  mode: "create" | "edit";
  quotation?: any;
  client?: any;
  deliveryId?: string | null;
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
  const [loading, setLoading] = useState(false);

  /* ---------------- DROPDOWN DATA ---------------- */
  const [clients, setClients] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  /* ---------------- ADDRESS STATE ---------------- */
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>("");

  /* ---------------- FORM ---------------- */
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      relatedTo: "",
      contactId: "",
      assignedTo: "",
      dealId: "",
      currency: "",
      expiryDate: "",
      products: [],
      amount: 0,
    },
  });


  const searchParams = useSearchParams();
const routeDealId = searchParams.get("dealId");
  const relatedTo = watch("relatedTo");
  const productsWatch = watch("products");

  /* ---------------- FIELD ARRAY ---------------- */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  /* ---------------- LOAD DROPDOWNS ---------------- */
  useEffect(() => {
    const load = async () => {
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
      } catch {
        toast.error("Failed to load dropdown data");
      }
    };

    load();
  }, []);

  useEffect(() => {
  if (mode === "create" && routeDealId) {
    setValue("dealId", routeDealId, { shouldValidate: true });
  }
}, [mode, routeDealId, setValue]);

  /* ---------------- EDIT MODE RESET (🔥 MAIN FIX) ---------------- */
  useEffect(() => {
    if (mode !== "edit" || !quotation || !client) return;

    reset({
      relatedTo: client.id,
      contactId: quotation.contactId || "",
      assignedTo: quotation.assignedTo || "",
      dealId: quotation.dealId || "",
      currency: quotation.currency || "",
      expiryDate: quotation.expiryDate
        ? quotation.expiryDate.split("T")[0]
        : "",

      products: quotation.products.map((p: any) => ({
        product: p.productId,
        qty: p.qty,
        rate: p.rate,
        discount: p.discount,
        amount: p.amount,
        description: p.description,
      })),

      amount: quotation.amount || 0,
    });

    setSelectedClient(client);
    setContacts(client.contacts || []);
    setSelectedDeliveryId(deliveryId || "");
  }, [mode, quotation, client, deliveryId, reset]);

  /* ---------------- CLIENT CHANGE ---------------- */
  useEffect(() => {
    if (!relatedTo) return;

    const found = clients.find((c) => c._id === relatedTo);
    if (!found) return;

    setSelectedClient(found);
    setContacts(found.contacts || []);
  }, [relatedTo, clients]);

  /* ---------------- AMOUNT CALCULATION ---------------- */
  useEffect(() => {
    let total = 0;

    productsWatch?.forEach((row, index) => {
      const qty = Number(row.qty) || 0;
      const rate = Number(row.rate) || 0;
      const discount = Number(row.discount) || 0;

      const gross = qty * rate;
      const discountAmt = (gross * discount) / 100;
      const amount = gross - discountAmt;

      setValue(`products.${index}.amount`, amount);
      total += amount;
    });

    setValue("amount", Number(total.toFixed(2)));
  }, [productsWatch, setValue]);

  /* ---------------- DELIVERY OPTIONS ---------------- */
  const deliveryOptions =
    selectedClient?.deliveryAddresses?.map((a: any) => ({
      _id: a._id,
      name: `${a.street}, ${a.city}, ${a.state}, ${a.country}`,
    })) || [];

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data: QuotationFormData) => {
    try {
      setLoading(true);

      const payload = {
        relatedTo: data.relatedTo,
        contactId: data.contactId || undefined,
        assignedTo: data.assignedTo || undefined,
        dealId: data.dealId || routeDealId || null,
        currency: data.currency || undefined,
        expiryDate: data.expiryDate || undefined,
        amount: data.amount,
        status: "draft",

        products: data.products.map((p) => ({
          product: p.product,
          qty: p.qty,
          rate: p.rate,
          discount: p.discount,
          description: p.description,
        })),

        billingAddress: selectedClient?.billingAddress || {},
        deliveryAddress: selectedDeliveryId
          ? selectedClient.deliveryAddresses.find(
              (d: any) => d._id === selectedDeliveryId,
            )
          : {},
      };

      const response =
        mode === "create"
          ? await quotationApi.create(payload)
          : await quotationApi.edit(quotationId!, payload);

      if (response.status) {
        toast.success(
          mode === "create"
            ? "Quotation created successfully"
            : "Quotation updated successfully",
        );

        if (mode === "create") {
          if (!response.quotationId) {
            toast.error("Quotation created but ID missing");
            return;
          }

          // ✅ NAVIGATE TO DETAIL PAGE
          router.push(`/flow-tool/sales/quotations/${response.quotationId}`);
        } else {
          router.refresh();
        }
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("Failed to save quotation");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
              required
              options={clients}
              value={watch("relatedTo")}
              onValueChange={(v) => setValue("relatedTo", v)}
            />

            <FormField
              id="contactId"
              label="Contact"
              type="dropdown"
              options={contacts.map((c: any) => ({
                _id: c._id,
                name: `${c.name} (${c.email})`,
              }))}
              value={watch("contactId")}
              onValueChange={(v) => setValue("contactId", v)}
            />

            <FormField
              id="assignedTo"
              label="Assigned To"
              type="dropdown"
              options={users}
              value={watch("assignedTo")}
              onValueChange={(v) => setValue("assignedTo", v)}
            />

            <FormField
              id="dealId"
              label="Deal"
              type="dropdown"
              options={deals.map((d) => ({
                _id: d._id,
                name: d.title,
              }))}
              value={watch("dealId")}
              onValueChange={(v) => setValue("dealId", v)}
            />

            <FormField
              id="currency"
              label="Currency"
              type="dropdown"
              required
              options={currencies}
              value={watch("currency")}
              onValueChange={(v) => setValue("currency", v)}
            />

            <FormField
              id="expiryDate"
              label="Expiry Date"
              type="date"
              register={register("expiryDate")}
            />

            {deliveryOptions.length > 0 && (
              <FormField
                    id="deliveryAddress"
                    label="Select Delivery Address"
                    type="dropdown"
                    options={deliveryOptions}
                    value={selectedDeliveryId}
                    onValueChange={setSelectedDeliveryId}
                  />
            )}
          </div>

          {/* ADDRESSES */}
          <div className="grid grid-cols-2 gap-4">
            {selectedClient?.billingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div>{selectedClient.billingAddress.street}</div>
                  <div>
                    {selectedClient.billingAddress.city},{" "}
                    {selectedClient.billingAddress.state}
                  </div>
                  <div>{selectedClient.billingAddress.country}</div>
                </CardContent>
              </Card>
            )}

            {deliveryOptions.length > 0 && (
                <div>
            {selectedDeliveryId && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {(() => {
                    const addr = selectedClient?.deliveryAddresses?.find(
                      (d: any) => d._id === selectedDeliveryId,
                    );

                    if (!addr) return null;

                    return (
                      <>
                        <div>{addr.street}</div>
                        <div>
                          {addr.city}, {addr.state}
                        </div>
                        <div>{addr.country}</div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
            )}
          </div>

          {/* PRODUCTS */}
          <div className="border rounded-md p-3 space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-6 gap-2">
                <FormField
                  id={`products.${index}.product`}
                  type="dropdown"
                  options={products}
                  value={watch(`products.${index}.product`)}
                  onValueChange={(v) => {
                    const prod = products.find((p) => p._id === v);
                    setValue(`products.${index}.product`, v);
                    setValue(`products.${index}.rate`, prod?.price || 0);
                  }}
                />
                <Input {...register(`products.${index}.qty`)} type="number" />
                <Input {...register(`products.${index}.rate`)} type="number" />
                <Input
                  {...register(`products.${index}.discount`)}
                  type="number"
                />
                <div className="text-sm font-medium">
                  ₹{(watch(`products.${index}.amount`) || 0).toFixed(2)}
                </div>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="ghost"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({ product: "", qty: 1, rate: 0, discount: 0, amount: 0 })
              }
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Product
            </Button>
          </div>
          {/* TOTAL */}
          <div className="flex justify-between items-center pt-4">
            {" "}
            <div className="text-lg font-semibold">
              {" "}
              Total: ₹{watch("amount").toFixed(2)}{" "}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={loading} variant="outline">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "Create" : "Update"} Quotation
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
