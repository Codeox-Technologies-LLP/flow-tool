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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuditLog from "@/components/shared/audit-log";
import { PageHeader } from "@/components/shared/page-header";

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
      zipCode: "",
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
      <div className="flex-1 overflow-hidden flex gap-4 p-4">
        {/* Left Panel - Form */}
        <div className="flex-1 overflow-y-auto">
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
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Warehouse Name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Main Warehouse"
                      className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...register("name")}
                      autoFocus
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Short Code */}
                  <div className="space-y-1.5">
                    <Label htmlFor="shortCode" className="text-sm font-medium text-gray-700">
                      Short Code
                    </Label>
                    <Input
                      id="shortCode"
                      placeholder="e.g., WH-001"
                      className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...register("shortCode")}
                    />
                    {errors.shortCode && (
                      <p className="text-sm text-red-600">{errors.shortCode.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g., +1234567890"
                      className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="e.g., 123 Storage Lane"
                      className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="e.g., Los Angeles"
                      className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                      State
                    </Label>
                    <Input
                      id="state"
                      placeholder="e.g., CA"
                      className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...register("state")}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>

                  {/* ZIP Code */}
                  <div className="space-y-1.5">
                    <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                      ZIP Code
                    </Label>
                    <Input
                      id="zipCode"
                      placeholder="e.g., 90001"
                      className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...register("zipCode")}
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-red-600">{errors.zipCode.message}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                      Country
                    </Label>
                    <Input
                      id="country"
                      placeholder="e.g., USA"
                      className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...register("country")}
                    />
                    {errors.country && (
                      <p className="text-sm text-red-600">{errors.country.message}</p>
                    )}
                  </div>
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
      </div>

        {/* Right Panel - Audit Log */}
        <div className="w-[480px] border-l border-gray-200 overflow-y-auto bg-gray-50">
          <AuditLog entries={[]} />
        </div>
      </div>
    </div>
  );
}
