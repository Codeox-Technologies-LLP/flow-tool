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
import { BrandFormData, brandSchema } from "@/lib/validations/brand";
import { brandApi, BrandData } from "@/api/brand/brand";

interface BrandFormProps {
  mode: "create" | "edit";
  brand?: BrandData;
  brandId?: string;
}

const formFields = [
  {
    label: "Brand Name",
    id: "name" as const,
    required: true,
    placeholder: "Enter Brand name",
  }
];

export function BrandForm({
  mode,
  brand,
  brandId,
}: BrandFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues:
      mode === "edit" && brand
        ? {
            name: brand.name || ""
          }
        : {
            name: ""
          },
  });

  const onSubmit = async (data: BrandFormData) => {
    try {
      setLoading(true);

      if (mode === "create") {
        // Remove empty optional fields for create
        const cleanedData = Object.fromEntries(
          Object.entries(data).filter(([, value]) => value?.trim())
        );

        const response = await brandApi.create(cleanedData);

        if (response.status) {
          toast.success("brand created successfully!", {
            description: `brand ID: ${response.brandId}`,
          });
          reset();
          // Redirect to the detail page of the newly created brand
          if (response.brandId) {
            router.push(`/flow-tool/products/brand/${response.brandId}`);
          } else {
            router.push("/flow-tool/products/brand");
          }
        } else {
          toast.error("Failed to create brand", {
            description: response.message,
          });
        }
      } else if (mode === "edit" && brandId) {
        const cleanedData: Record<string, unknown> = {
          id: brandId,
          name: data.name,
        };

        const response = await brandApi.edit(brandId, cleanedData);

        if (response.status) {
          toast.success("brand updated successfully");
          // Refresh the page to update audit log without redirecting
          router.refresh();
        } else {
          toast.error(response.message || "Failed to update brand");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(
        mode === "create"
          ? "Failed to create brand"
          : "Failed to update brand",
        {
          description: errorMessage,
        }
      );
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} brand:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/flow-tool/products/brand");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Brand Information</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Enter brand details and location"
              : "Update the brand details below"}
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
                  {mode === "create" ? "Create brand" : "Update brand"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
