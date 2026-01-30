"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2, Trash2, Plus } from "lucide-react";

import { proformaSchema, type ProformaFormData } from "@/lib/validations/proforma";
import { proformaApi } from "@/api/proforma/proforma";
import { clientApi } from "@/api/client/client";
// import { quotationApi } from "@/api/quotations/quotation"; 
import { productApi } from "@/api/product/product";
import { userApi } from "@/api/user/user";
import { locationApi } from "@/api/location/location";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";

interface ProformaFormProps {
  mode: "create" | "edit";
  proforma?: {
    relatedTo: string;
    contactId?: string;
    assignedTo?: string;
    locationId?: string;
    billingAddress?: { street?: string; city?: string; state?: string; country?: string; zip?: string };
    deliveryAddress?: { street?: string; city?: string; state?: string; country?: string; zip?: string };
    dealId?: string;
    quotationId?: string;
    expiryDate?: string;
    amount?: number;
    status?: string;
    products?: Array<{
      product: string;
      productName: string;
      qty: number;
      rate: number;
      discount: number;
      tax: number;
      description: string;
    }>;
  };
  proformaId?: string;
}

export function ProformaForm({ mode, proforma, proformaId }: ProformaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State for dropdowns
  const [clients, setClients] = useState<Array<{ _id: string; name: string }>>([]);
  const [quotations, setQuotations] = useState<Array<{ _id: string; name: string }>>([]);
  const [products, setProducts] = useState<Array<{ _id: string; name: string; price: number }>>([]);
  const [users, setUsers] = useState<Array<{ _id: string; name: string }>>([]);
  const [locations, setLocations] = useState<Array<{ _id: string; name: string }>>([]);
  const [contacts, setContacts] = useState<Array<{ _id: string; name: string }>>([]);
  const [billingAddresses, setBillingAddresses] = useState<Array<{ _id: string; name: string; data: any }>>([]);
  const [deliveryAddresses, setDeliveryAddresses] = useState<Array<{ _id: string; name: string; data: any }>>([]);

  // Loading states
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingQuotations, setLoadingQuotations] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<ProformaFormData>({
    resolver: zodResolver(proformaSchema),
    defaultValues: mode === "edit" && proforma ? {
      relatedTo: proforma.relatedTo || "",
      contactId: proforma.contactId || "",
      assignedTo: proforma.assignedTo || "",
      locationId: proforma.locationId || "",
      billingAddress: proforma.billingAddress ? "billing" : "",
      deliveryAddress: proforma.deliveryAddress ? `${proforma.deliveryAddress.street}-${proforma.deliveryAddress.city}-${proforma.deliveryAddress.state}-${proforma.deliveryAddress.zip}` : "",
      dealId: proforma.dealId || "",
      quotationId: proforma.quotationId || "",
      expiryDate: proforma.expiryDate || "",
      status: proforma.status || "draft",
      products: proforma.products || [{ product: "", productName: "", qty: 1, rate: 0, discount: 0, tax: 0, description: "" }],
    } : {
      relatedTo: "",
      contactId: "",
      assignedTo: "",
      locationId: "",
      billingAddress: "",
      deliveryAddress: "",
      dealId: "",
      quotationId: "",
      expiryDate: "",
      status: "draft",
      products: [{ product: "", productName: "", qty: 1, rate: 0, discount: 0, tax: 0, description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "products" });
  const selectedClient = watch("relatedTo");
  const watchedProducts = watch("products");

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [clientsRes, productsRes, usersRes, locationsRes] = await Promise.all([
          clientApi.list({ page: 1, limit: 100 }),
          productApi.list({ page: 1, limit: 100 }),
          userApi.list({ page: 1, limit: 100 }),
          locationApi.list({ page: 1, limit: 100 }),
        ]);

        if (clientsRes?.result?.data) {
          setClients(clientsRes.result.data.map((c: any) => ({ _id: c.id || c._id, name: c.client || c.name })));
        }
        if (productsRes?.result?.data) {
          setProducts(productsRes.result.data.map((p: any) => ({ _id: p.id || p._id, name: p.name, price: p.price || 0 })));
        }
        if (usersRes?.result?.data) {
          setUsers(usersRes.result.data.map((u: any) => ({ _id: u.userId || u.id || u._id, name: u.name })));
        }
        if (locationsRes?.result?.data) {
          setLocations(locationsRes.result.data.map((l: any) => ({ _id: l.locationId || l.id || l._id, name: l.name })));
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        toast.error("Failed to load form data");
      } finally {
        setLoadingClients(false);
        setLoadingProducts(false);
        setLoadingUsers(false);
        setLoadingLocations(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch client-specific data
  useEffect(() => {
    if (!selectedClient) {
      setQuotations([]);
      setBillingAddresses([]);
      setDeliveryAddresses([]);
      setContacts([]);
      return;
    }

    const fetchClientData = async () => {
      try {
        setLoadingQuotations(true);
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

        // const quotationsRes = await quotationApi.list({ 
        //   page: 1, 
        //   limit: 100
        // });
        // if (quotationsRes?.result?.data) {
        //   // Filter quotations by the selected client on the frontend
        //   const clientQuotations = quotationsRes.result.data.filter(
        //     (q: any) => q.clientData?.id === selectedClient || q.relatedTo === selectedClient
        //   );
        //   setQuotations(clientQuotations.map((q: any) => ({ _id: q.id, name: q.quotationId })));
        // }
      } catch (error) {
        console.error("Failed to fetch client data:", error);
        toast.error("Failed to load client data");
      } finally {
        setLoadingQuotations(false);
      }
    };
    fetchClientData();
  }, [selectedClient]);

  // Calculations
  const calculateRowAmount = (row: any) => {
    const qty = Number(row.qty) || 0;
    const rate = Number(row.rate) || 0;
    const discount = Number(row.discount) || 0;
    const base = qty * rate;
    return (base - (base * discount) / 100).toFixed(2);
  };

  const calculateSubtotal = () => watchedProducts.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0);
  const calculateTotalDiscount = () => watchedProducts.reduce((sum, item) => {
    const base = (Number(item.qty) || 0) * (Number(item.rate) || 0);
    return sum + (base * (Number(item.discount) || 0)) / 100;
  }, 0);
  const calculateTotal = () => calculateSubtotal() - calculateTotalDiscount();

  const onSubmit = async (data: ProformaFormData) => {
    try {
      setLoading(true);
      const payload = {
        relatedTo: data.relatedTo,
        contactId: data.contactId || undefined,
        assignedTo: data.assignedTo || undefined,
        locationId: data.locationId || undefined,
        billingAddress: billingAddresses.find(addr => addr._id === data.billingAddress)?.data,
        deliveryAddress: deliveryAddresses.find(addr => addr._id === data.deliveryAddress)?.data,
        dealId: data.dealId || undefined,
        quotationId: data.quotationId || undefined,
        expiryDate: data.expiryDate || undefined,
        amount: calculateTotal(),
        status: data.status || "draft",
        products: data.products,
      };

      const response = mode === "create"
        ? await proformaApi.create(payload)
        : await proformaApi.edit(proformaId!, payload);

      if (response.status) {
        toast.success(`Proforma ${mode === "create" ? "created" : "updated"} successfully!`);
        mode === "create" ? router.push("/flow-tool/sales/proformas") : router.refresh();
      } else {
        toast.error(`Failed to ${mode} proforma`, { description: response.message });
      }
    } catch (error) {
      toast.error(`Failed to ${mode} proforma`, {
        description: error instanceof Error ? error.message : "An error occurred",
      });
      console.error(`Error ${mode}ing proforma:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Proforma Information</CardTitle>
          <CardDescription>
            {mode === "create" ? "Enter proforma details and select client" : "Update the proforma details below"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                label="Contact Person"
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

            {quotations.length > 0 && (
              <FormField
                id="quotationId"
                label="Quotation"
                type="dropdown"
                placeholder="Select quotation (optional)"
                searchPlaceholder="Search quotations..."
                emptyText="No quotations found"
                options={quotations}
                value={watch("quotationId")}
                onValueChange={(value) => setValue("quotationId", value, { shouldValidate: true })}
                loading={loadingQuotations}
                disabled={!selectedClient}
                error={errors.quotationId}
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
              id="locationId"
              label="Location"
              type="dropdown"
              placeholder="Select location (optional)"
              searchPlaceholder="Search locations..."
              emptyText="No locations found"
              options={locations}
              value={watch("locationId")}
              onValueChange={(value) => setValue("locationId", value, { shouldValidate: true })}
              loading={loadingLocations}
              error={errors.locationId}
            />

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
          <CardDescription>Add products to this proforma</CardDescription>
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
            onClick={() => append({ product: "", productName: "", qty: 1, rate: 0, discount: 0, tax: 0, description: "" })}
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
        <Button type="button" variant="outline" onClick={() => router.push("/flow-tool/sales/proformas")} disabled={loading}>
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
              {mode === "create" ? "Create Proforma" : "Update Proforma"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}