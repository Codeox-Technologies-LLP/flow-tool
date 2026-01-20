"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import Link from "next/link";

import { warehouseSchema, type WarehouseFormData } from "@/lib/validations/warehouse";
import { warehouseApi } from "@/lib/api/warehouse";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { FormField } from "@/components/shared/form-field";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";

export default function AddWarehousePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      shortCode: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
    },
  });

  const onSubmit = async (data: WarehouseFormData) => {
    setLoading(true);

    try {
      // Remove empty optional fields
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== "")
      );

      const response = await warehouseApi.create(cleanedData);

      if (response.status) {
        toast.success("Warehouse created successfully!", {
          description: `Warehouse ID: ${response.warehouseId}`,
        });
        reset();
        router.push("/flow-tool/inventory/warehouses");
      } else {
        toast.error("Failed to create warehouse", {
          description: response.message,
        });
      }
    } catch (error) {
      console.error("Error creating warehouse:", error);
      toast.error("Failed to create warehouse", {
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PageHeader
        title="Add New Warehouse"
        description="Quick setup - add details later in warehouse settings"
        backUrl="/flow-tool/inventory/warehouses"
      />

      {/* Split Screen Content */}
      <SplitLayoutWithAudit>
        <div className="space-y-4">
          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="warehouse-form">
            {/* Single Card with All Fields */}
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-white py-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  Warehouse Information
                </CardTitle>
                <CardDescription className="text-sm">
                  Enter warehouse details and location
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Warehouse Name */}
                  <FormField
                    id="name"
                    label="Warehouse Name"
                    placeholder="e.g., Main Warehouse"
                    required
                    error={errors.name}
                    register={register("name")}
                    fullWidth
                    autoFocus
                  />

                  {/* Short Code */}
                  <FormField
                    id="shortCode"
                    label="Short Code"
                    placeholder="e.g., WH-001"
                    error={errors.shortCode}
                    register={register("shortCode")}
                  />

                  {/* Phone */}
                  <FormField
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="e.g., +1234567890"
                    error={errors.phone}
                    register={register("phone")}
                  />

                  {/* Address */}
                  <FormField
                    id="address"
                    label="Street Address"
                    placeholder="e.g., 123 Storage Lane"
                    error={errors.address}
                    register={register("address")}
                    fullWidth
                  />

                  {/* City */}
                  <FormField
                    id="city"
                    label="City"
                    placeholder="e.g., Los Angeles"
                    error={errors.city}
                    register={register("city")}
                  />

                  {/* State */}
                  <FormField
                    id="state"
                    label="State"
                    placeholder="e.g., CA"
                    error={errors.state}
                    register={register("state")}
                  />

                  {/* Country */}
                  <FormField
                    id="country"
                    label="Country"
                    placeholder="e.g., USA"
                    error={errors.country}
                    register={register("country")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 pb-4">
              <Link href="/flow-tool/inventory/warehouses">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="h-9 px-4"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Warehouse
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </SplitLayoutWithAudit>
    </div>
  );
}