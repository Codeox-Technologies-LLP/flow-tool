"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

import { warehouseSchema, type WarehouseFormData } from "@/lib/validations/warehouse";
import { warehouseApi, type WarehouseData } from "@/lib/api/warehouse";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";

interface WarehouseEditFormProps {
  warehouse: WarehouseData;
  warehouseId: string;
}

export function WarehouseEditForm({ warehouse, warehouseId }: WarehouseEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: warehouse.name || "",
      shortCode: warehouse.shortCode || "",
      phone: warehouse.phone || "",
      address: warehouse.description || "",
      city: warehouse.city || "",
      country: (warehouse.country as string) || "",
      state: (warehouse.state as string) || "",
      zipCode: (warehouse.zipCode as string) || "",
      description: warehouse.description || "",
    },
  });

  const onSubmit = async (data: WarehouseFormData) => {
    try {
      setLoading(true);
      
      // Remove empty optional fields to avoid "undefined → ''" in audit logs
      const cleanedData: Record<string, unknown> = {
        id: warehouseId,
        name: data.name,
      };
      
      // Only include non-empty optional fields
      if (data.shortCode?.trim()) cleanedData.shortCode = data.shortCode;
      if (data.phone?.trim()) cleanedData.phone = data.phone;
      if (data.address?.trim()) cleanedData.address = data.address;
      if (data.city?.trim()) cleanedData.city = data.city;
      if (data.state?.trim()) cleanedData.state = data.state;
      if (data.country?.trim()) cleanedData.country = data.country;
      if (data.zipCode?.trim()) cleanedData.zipCode = data.zipCode;
      if (data.description?.trim()) cleanedData.description = data.description;
      
      const response = await warehouseApi.edit(warehouseId, cleanedData);

      if (response.status) {
        toast.success("Warehouse updated successfully");
        // Refresh the page to update audit log without redirecting
        router.refresh();
      } else {
        toast.error(response.message || "Failed to update warehouse");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
      console.error("Error updating warehouse:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/flow-tool/inventory/warehouses");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Information</CardTitle>
          <CardDescription>
            Update the warehouse details below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Warehouse Name"
              id="name"
              required
              error={errors.name?.message}
              register={register("name")}
              placeholder="Enter warehouse name"
            />

            <FormField
              label="Short Code"
              id="shortCode"
              error={errors.shortCode?.message}
              register={register("shortCode")}
              placeholder="e.g., WH-001"
            />

            <FormField
              label="Phone Number"
              id="phone"
              error={errors.phone?.message}
              register={register("phone")}
              placeholder="Enter phone number"
            />

            <FormField
              label="City"
              id="city"
              error={errors.city?.message}
              register={register("city")}
              placeholder="Enter city"
            />

            <FormField
              label="State"
              id="state"
              error={errors.state?.message}
              register={register("state")}
              placeholder="Enter state"
            />

            <FormField
              label="Country"
              id="country"
              error={errors.country?.message}
              register={register("country")}
              placeholder="Enter country"
            />

            <FormField
              label="Zip Code"
              id="zipCode"
              error={errors.zipCode?.message}
              register={register("zipCode")}
              placeholder="Enter zip code"
            />

            <FormField
              label="Address"
              id="address"
              error={errors.address?.message}
              register={register("address")}
              placeholder="Enter warehouse address"
            />
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
            <Button type="submit" disabled={loading} variant="outline">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Warehouse
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
