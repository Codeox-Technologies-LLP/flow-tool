"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import { ManufacturerFormData, manufacturerSchema } from "@/lib/validations/manufacturer";
import { manufacturerApi, ManufacturerData } from "@/api/manufacturer/manufacturer";

interface ManufacturerFormProps {
  mode: "create" | "edit";
  manufacturer?: ManufacturerData;
  manufacturerId?: string;
}

const formFields = [
  {
    label: "Manufacturer Name",
    id: "name" as const,
    required: true,
    placeholder: "Enter Manufacturer name",
  }
];

export function ManufacturerForm({
  mode,
  manufacturer,
  manufacturerId,
}: ManufacturerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ManufacturerFormData>({
    resolver: zodResolver(manufacturerSchema),
    defaultValues:
      mode === "edit" && manufacturer
        ? {
            name: manufacturer.name || ""
          }
        : {
            name: ""
          },
  });

  const onSubmit = async (data: ManufacturerFormData) => {
    try {
      setLoading(true);

      if (mode === "create") {
        // Remove empty optional fields for create
        const cleanedData = Object.fromEntries(
          Object.entries(data).filter(([, value]) => value?.trim())
        );

        const response = await manufacturerApi.create(cleanedData);

        if (response.status) {
          toast.success("brand created successfully!", {
            description: `manufacturer ID: ${response.manufacturerId}`,
          });
          reset();
          // Redirect to the detail page of the newly created manufacturer
          if (response.manufacturerId) {
            router.push(`/flow-tool/products/manufacturer/${response.manufacturerId}`);
          } else {
            router.push("/flow-tool/products/manufacturer");
          }
        } else {
          toast.error("Failed to create manufacturer", {
            description: response.message,
          });
        }
      } else if (mode === "edit" && manufacturerId) {
        const cleanedData: Record<string, unknown> = {
          id: manufacturerId,
          name: data.name,
        };

        const response = await manufacturerApi.edit(manufacturerId, cleanedData);

        if (response.status) {
          toast.success("manufacturer updated successfully");
          // Refresh the page to update audit log without redirecting
          router.refresh();
        } else {
          toast.error(response.message || "Failed to update manufacturer");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(
        mode === "create"
          ? "Failed to create manufacturer"
          : "Failed to update manufacturer",
        {
          description: errorMessage,
        }
      );
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} manufacturer:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/flow-tool/products/manufacturer");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Manufacturer Information</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Enter manufacturer details and location"
              : "Update the manufacturer details below"}
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
                  {mode === "create" ? "Create manufacturer" : "Update manufacturer"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
