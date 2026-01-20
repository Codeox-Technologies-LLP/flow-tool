"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

import {
  warehouseSchema,
  type WarehouseFormData,
} from "@/lib/validations/warehouse";
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

interface WarehouseFormProps {
  mode: "create" | "edit";
  warehouse?: WarehouseData;
  warehouseId?: string;
}

const formFields = [
  {
    label: "Warehouse Name",
    id: "name" as const,
    required: true,
    placeholder: "Enter warehouse name",
  },
  {
    label: "Short Code",
    id: "shortCode" as const,
    placeholder: "e.g., WH-001",
  },
  {
    label: "Phone Number",
    id: "phone" as const,
    placeholder: "Enter phone number",
  },
  {
    label: "City",
    id: "city" as const,
    placeholder: "Enter city",
  },
  {
    label: "State",
    id: "state" as const,
    placeholder: "Enter state",
  },
  {
    label: "Country",
    id: "country" as const,
    placeholder: "Enter country",
  },
  {
    label: "Zip Code",
    id: "zipCode" as const,
    placeholder: "Enter zip code",
  },
  {
    label: "Address",
    id: "address" as const,
    placeholder: "Enter warehouse address",
  },
];

export function WarehouseForm({
  mode,
  warehouse,
  warehouseId,
}: WarehouseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues:
      mode === "edit" && warehouse
        ? {
            name: warehouse.name || "",
            shortCode: warehouse.shortCode || "",
            phone: warehouse.phone || "",
            address: warehouse.description || "",
            city: warehouse.city || "",
            country: (warehouse.country as string) || "",
            state: (warehouse.state as string) || "",
            zipCode: (warehouse.zipCode as string) || "",
            description: warehouse.description || "",
          }
        : {
            name: "",
            shortCode: "",
            phone: "",
            address: "",
            country: "",
            state: "",
            city: "",
            zipCode: "",
            description: "",
          },
  });

  const onSubmit = async (data: WarehouseFormData) => {
    try {
      setLoading(true);

      if (mode === "create") {
        // Remove empty optional fields for create
        const cleanedData = Object.fromEntries(
          Object.entries(data).filter(([, value]) => value?.trim())
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
      } else if (mode === "edit" && warehouseId) {
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
        if (data.description?.trim())
          cleanedData.description = data.description;

        const response = await warehouseApi.edit(warehouseId, cleanedData);

        if (response.status) {
          toast.success("Warehouse updated successfully");
          // Refresh the page to update audit log without redirecting
          router.refresh();
        } else {
          toast.error(response.message || "Failed to update warehouse");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(
        mode === "create"
          ? "Failed to create warehouse"
          : "Failed to update warehouse",
        {
          description: errorMessage,
        }
      );
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} warehouse:`,
        error
      );
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
            {mode === "create"
              ? "Enter warehouse details and location"
              : "Update the warehouse details below"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {formFields.map((field) => (
              <FormField
                key={field.id}
                label={field.label}
                id={field.id}
                required={field.required}
                error={errors[field.id]?.message}
                register={register(field.id)}
                placeholder={field.placeholder}
              />
            ))}
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
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "Create Warehouse" : "Update Warehouse"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
