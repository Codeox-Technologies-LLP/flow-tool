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
import { CategoryFormData, categorySchema } from "@/lib/validations/category";
import { categoryApi, CategoryData } from "@/api/category/category";

interface CategoryFormProps {
  mode: "create" | "edit";
  category?: CategoryData;
  categoryId?: string;
}

const formFields = [
  {
    label: "Category Name",
    id: "name" as const,
    required: true,
    placeholder: "Enter Category name",
  },
  {
    label: "Short Code",
    id: "code" as const,
    placeholder:"Enter code",
  }
];

export function CategoryForm({
  mode,
  category,
  categoryId,
}: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues:
      mode === "edit" && category
        ? {
            name: category.name || "",
            code: category.code || "",
          }
        : {
            name: "",
            code: ""
          },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setLoading(true);

      if (mode === "create") {
        // Remove empty optional fields for create
        const cleanedData = Object.fromEntries(
          Object.entries(data).filter(([, value]) => value?.trim())
        );

        const response = await categoryApi.create(cleanedData);

        if (response.status) {
          toast.success("category created successfully!", {
            description: `category ID: ${response.categoryId}`,
          });
          reset();
          // Redirect to the detail page of the newly created category
          if (response.categoryId) {
            router.push(`/flow-tool/products/categories/${response.categoryId}`);
          } else {
            router.push("/flow-tool/products/categories");
          }
        } else {
          toast.error("Failed to create category", {
            description: response.message,
          });
        }
      } else if (mode === "edit" && categoryId) {
        const cleanedData: Record<string, unknown> = {
          id: categoryId,
          name: data.name,
        };

        if (data.code?.trim()) cleanedData.shortCode = data.code;

        const response = await categoryApi.edit(categoryId, cleanedData);

        if (response.status) {
          toast.success("category updated successfully");
          // Refresh the page to update audit log without redirecting
          router.refresh();
        } else {
          toast.error(response.message || "Failed to update category");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(
        mode === "create"
          ? "Failed to create category"
          : "Failed to update category",
        {
          description: errorMessage,
        }
      );
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} category:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/flow-tool/products/categories");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Enter category details and location"
              : "Update the category details below"}
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
                  {mode === "create" ? "Create category" : "Update category"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
