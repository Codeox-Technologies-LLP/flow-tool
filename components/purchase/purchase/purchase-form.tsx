"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, Plus, Trash } from "lucide-react";

import {
  purchaseSchema,
  type PurchaseFormData,
} from "@/lib/validations/purchase";

import { purchaseApi } from "@/api/purchase/purchase";
import { vendorApi } from "@/api/vendor/vendor";
import { warehouseApi } from "@/api/warehouse/warehouse";
import { locationApi } from "@/api/location/location";
import { productApi } from "@/api/product/product";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";

interface PurchaseFormProps {
  mode: "create" | "edit";
  purchase?: PurchaseFormData;
  purchaseId?: string;
}

interface Address {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export function PurchaseForm({
  mode,
  purchase,
  purchaseId,
}: PurchaseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [vendors, setVendors] = useState<Array<{ _id: string; name: string; address?: Address; }>>(
    []
  );
  const [warehouses, setWarehouses] = useState<
    Array<{ _id: string; name: string; address?: Address; }>
  >([]);
  const [locations, setLocations] = useState<
    Array<{ _id: string; name: string ; warehouseId:string}>
  >([]);
  const [products, setProducts] = useState<
    Array<{ _id: string; name: string; price: number }>
  >([]);

  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [vendorAddress, setVendorAddress] = useState<any>(null);
  const [warehouseAddress, setWarehouseAddress] = useState<any>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues:
      mode === "edit" && purchase
        ? purchase
        : {
            vendorId: "",
            warehouseId: "",
            locationId: "",
            deliveryDate: "",
            products: [{ product: "", qty: 1, price: 0, discount: 0 }],
            subtotal: 0,
            discountTotal: 0,
            total: 0,
            amount: 0,
          },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const watchedProducts = watch("products",[]);

  const calcSubtotal = () => {
    return watchedProducts.reduce((acc, item) => {
      const base = (item.qty || 0) * (item.price || 0);
      return acc + base;
    }, 0);
  };

  const calcDiscountTotal = () => {
    return watchedProducts.reduce((acc, item) => {
      const base = (item.qty || 0) * (item.price || 0);
      const discountAmt = (base * (item.discount || 0)) / 100;
      return acc + discountAmt;
    }, 0);
  };

  const calcTotal = () => {
    const subtotal = calcSubtotal();
    const discountTotal = calcDiscountTotal();
    return subtotal - discountTotal;
  };

  useEffect(() => {
    const subtotal = calcSubtotal();
    const discountTotal = calcDiscountTotal();
    const total = calcTotal();

    setValue("subtotal", subtotal);
    setValue("discountTotal", discountTotal);
    setValue("total", total);
    setValue("amount", total);
  }, [JSON.stringify(watchedProducts)]);

  const selectedWarehouse = watch("warehouseId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingVendors(true);
        setLoadingWarehouses(true);
        setLoadingProducts(true);

        const [vendorRes, warehouseRes, productRes] = await Promise.all([
          vendorApi.dropdown(),
          warehouseApi.dropdown(),
          productApi.dropdown({ limit: 20 }),
        ]);

        setVendors(
          vendorRes.map((v) => ({
            _id: v._id,
            name: v.name,
            address: v.address || {},
          }))
        );

        setWarehouses(
          warehouseRes.map((w) => ({
            _id: w._id,
            name: w.name,
            address: w.address || {},
          }))
        );

        setProducts(
          productRes.map((p) => ({
            _id: p._id,
            name: p.name,
            price: p.price,
          }))
        );

      } catch {
        toast.error("Failed to load purchase form data");
      } finally {
        setLoadingVendors(false);
        setLoadingWarehouses(false);
        setLoadingProducts(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);

      const res = await locationApi.dropdown({});

      setLocations(
        res.map((loc) => ({
          _id: loc._id,
          name: loc.name,
          warehouseId: loc.warehouseId,
        }))
      );
    } catch {
      toast.error("Failed to load locations");
    } finally {
      setLoadingLocations(false);
    }
  };

  fetchLocations();
}, []);

  const selectedLocation = watch("locationId");

useEffect(() => {
  if (!selectedLocation || locations.length === 0 || warehouses.length === 0)
    return;

  const location = locations.find(l => l._id === selectedLocation);
  if (!location) return;

  const warehouse = warehouses.find(
    w => w._id === location.warehouseId
  );

  if (warehouse) {
    setValue("warehouseId", warehouse._id);

    setWarehouseAddress({
      name: warehouse.name,
      address: warehouse.address?.address,
      city: warehouse.address?.city,
      state: warehouse.address?.state,
      country: warehouse.address?.country,
      phone: warehouse.address?.phone,
    });
  }
}, [selectedLocation, locations, warehouses]);

const selectedVendor = watch("vendorId");

useEffect(() => {
  if (!selectedVendor || vendors.length === 0) return;

  const vendor = vendors.find(v => v._id === selectedVendor);
  if (!vendor) return;

  setVendorAddress({
    name: vendor.name,
    address: vendor.address?.address,
    city: vendor.address?.city,
    state: vendor.address?.state,
    country: vendor.address?.country,
    phone: vendor.address?.phone,
    email: vendor.address?.email,
  });
}, [selectedVendor, vendors]);

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      setLoading(true);
  
      if (mode === "create") {
        const response = await purchaseApi.create(data);
  
        if (response.status) {
          toast.success("Purchase created successfully");
  
          if (response.purchaseId) {
            router.push(`/flow-tool/purchase/purchase-orders/${response.purchaseId}`);
          } else {
            router.push("/flow-tool/purchase/purchase-orders");
          }
        } else {
          toast.error(response.message || "Failed to create Purchase");
        }
      } 
      else if (mode === "edit" && purchaseId) {
        const response = await purchaseApi.edit(purchaseId, data);
  
        if (response.status) {
          toast.success("Purchase updated successfully");
          router.refresh();
        } else {
          toast.error(response.message || "Failed to update Purchase");
        }
      }
    } catch (error) {
      toast.error(
        mode === "create"
          ? "Failed to create Purchase"
          : "Failed to update Purchase"
      );
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} Purchase:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/flow-tool/purchase/purchase-orders");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Purchase Information</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Create a new purchase order"
              : "Update purchase details"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">


            <div className="col-span-1 space-y-2">
              <FormField
                id="vendorId"
                label="Vendor"
                type="dropdown"
                required
                options={vendors}
                loading={loadingVendors}
                value={watch("vendorId")}
                onValueChange={(v) =>
                  setValue("vendorId", v, { shouldValidate: true })
                }
                error={errors.vendorId}
              />

              {vendorAddress && (
                <div className="border rounded-md p-4 bg-gray-50 text-sm">
                    <p className="font-semibold mb-1">Vendor Address</p>
                    <p>{vendorAddress.name}</p>
                    <p>{vendorAddress.address}</p>
                    <p>
                      {vendorAddress.city}, {vendorAddress.state}
                    </p>
                    <p>{vendorAddress.country}</p>
                    <p>{vendorAddress.phone}</p>
                  </div>
                )}
              </div>

             <div className="col-span-1 space-y-2">
              <FormField
                id="locationId"
                label="Location"
                type="dropdown"
                required
                options={locations}
                loading={loadingLocations}
                value={watch("locationId")}
                onValueChange={(v) =>
                  setValue("locationId", v, { shouldValidate: true })
                }
                error={errors.locationId}
              />

              {warehouseAddress && (
                <div className="border rounded-md p-4 bg-gray-50 text-sm">
                  <p className="font-semibold mb-1">Warehouse Address</p>
                  <p>{warehouseAddress.name}</p>
                  <p>{warehouseAddress.address}</p>
                  <p>
                    {warehouseAddress.city}, {warehouseAddress.state}
                  </p>
                  <p>{warehouseAddress.country}</p>
                  <p>{warehouseAddress.phone}</p>
                </div>
              )}
            </div>

                  <FormField
                    id="deliveryDate"
                    label="Delivery Date"
                    type="date"
                    register={register("deliveryDate")}
                  />
            
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Products</h3>

            {fields.map((field, index) => {
              const qty = watch(`products.${index}.qty`) || 0;
              const price = watch(`products.${index}.price`) || 0;
              const discount = watch(`products.${index}.discount`) || 0;

              const productTotal = qty * price * (1 - discount / 100);

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-5 gap-4 items-end"
                >
                  <FormField
                    id={`products.${index}.product`}
                    label="Product"
                    type="dropdown"
                    required
                    options={products}
                    loading={loadingProducts}
                    value={watch(`products.${index}.product`)}
                    onValueChange={(v) => {
                      const selected = products.find((p) => p._id === v);
                      setValue(`products.${index}.product`, v, { shouldValidate: true });
                      setValue(`products.${index}.price`, selected?.price || 0, { shouldValidate: true });
                      setValue(`products.${index}.productName`, selected?.name || "");
                    }}
                    error={errors.products?.[index]?.product}
                  />

                  <FormField
                    id={`products.${index}.qty`}
                    label="Qty"
                    type="number"
                    register={register(`products.${index}.qty`, {
                      valueAsNumber: true,
                    })}
                  />

                  <FormField
                    id={`products.${index}.price`}
                    label="Price"
                    type="number"
                    register={register(`products.${index}.price`, {
                      valueAsNumber: true,
                    })}
                  />

                  <FormField
                    id={`products.${index}.discount`}
                    label="Discount %"
                    type="number"
                    register={register(`products.${index}.discount`, {
                      valueAsNumber: true,
                    })}
                  />

                  {/* Product total */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {productTotal.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 p-1 ml-2"
                      title="Remove item"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ product: "", qty: 1, price: 0, discount: 0 })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

          <div className="flex justify-end mt-6">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{Number(watch("subtotal") || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount</span>
                <span>- {Number(watch("discountTotal") || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>{Number(watch("total") || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" variant="outline" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "Create Purchase" : "Update Purchase"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}