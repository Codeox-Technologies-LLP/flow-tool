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
import { productApi, ProductData } from "@/api/product/product";
import { ProductFormData, productSchema } from "@/lib/validations/product";

interface ProductFormProps {
    mode: "create" | "edit";
    product?: ProductData;
    productId?: string;
}

const formFields = [
    {
        label: "Product Type",
        id: "type" as const,
        required: true,
        placeholder: "Select product type (goods/service)",
    },
    {
        label: "Product Scope",
        id: "productScope" as const,
        required: true,
        placeholder: "Select product scope (company/organisation)",
    },
    {
        label: "Name",
        id: "name" as const,
        required: true,
        placeholder: "Enter product name",
    },
    {
        label: "Product Code",
        id: "productCode" as const,
        placeholder: "Enter product code/SKU",
    },
    {
        label: "Manufacturer",
        id: "manufacture" as const,
        placeholder: "Enter manufacturer",
    },
    {
        label: "Brand",
        id: "brand" as const,
        placeholder: "Enter brand",
    },
    {
        label: "Cost Price",
        id: "price" as const,
        required: true,
        placeholder: "Enter cost price",
    },
    {
        label: "Unit",
        id: "uom" as const,
        required: true,
        placeholder: "Select unit (e.g., kg, dozen)",
    },
    {
        label: "Description",
        id: "description" as const,
        placeholder: "Enter product description",
    },
];

export function ProductForm({
    mode,
    product,
    productId,
}: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues:
            mode === "edit" && product
                ? {
                    type: (product.type as "goods" | "service") || "goods",
                    productScope: (product.productScope as "company" | "organisation") || "company",
                    name: product.name || "",
                    productCode: product.productCode || "",
                    manufacture: product.manufacture || "",
                    brand: product.brand || "",
                    price: product.price || 0,
                    uom: product.uom || "",
                    description: product.description || "",
                }
                : {
                    type: "goods",
                    productScope: "company",
                    name: "",
                    productCode: "",
                    manufacture: "",
                    brand: "",
                    price: 0,
                    uom: "",
                    description: "",
                },
    });

    const onSubmit = async (data: ProductFormData) => {
        try {
            setLoading(true);

            if (mode === "create") {
                const cleanedData = Object.fromEntries(
                    Object.entries(data).filter(([, value]) => value?.toString().trim())
                );

                const response = await productApi.create(cleanedData);

                if (response.status) {
                    toast.success("Product created successfully!", {
                        description: `Product ID: ${response.productId}`,
                    });
                    reset();
                    if (response.productId) {
                        router.push(`/flow-tool/products/products/${response.productId}`);
                    } else {
                        router.push("/flow-tool/products/products");
                    }
                } else {
                    toast.error("Failed to create product", {
                        description: response.message,
                    });
                }
            } else if (mode === "edit" && productId) {
                const cleanedData: Record<string, unknown> = {
                    id: productId,
                    name: data.name,
                };

                if (data.type?.trim()) cleanedData.type = data.type;
                if (data.productScope?.trim()) cleanedData.productScope = data.productScope;
                if (data.productCode?.trim()) cleanedData.productCode = data.productCode;
                if (data.manufacture?.trim()) cleanedData.manufacture = data.manufacture;
                if (data.brand?.trim()) cleanedData.brand = data.brand;
                if (data.price !== undefined && data.price !== null) cleanedData.price = data.price;
                if (data.uom?.trim()) cleanedData.uom = data.uom;
                if (data.description?.trim()) cleanedData.description = data.description;

                const response = await productApi.edit(productId, cleanedData);

                if (response.status) {
                    toast.success("Product updated successfully");
                    router.refresh();
                } else {
                    toast.error(response.message || "Failed to update product");
                }
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An error occurred";
            toast.error(
                mode === "create"
                    ? "Failed to create product"
                    : "Failed to update product",
                {
                    description: errorMessage,
                }
            );
            console.error(
                `Error ${mode === "create" ? "creating" : "updating"} product:`,
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push("/flow-tool/products/products");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                    <CardDescription>
                        {mode === "create"
                            ? "Enter product details and location"
                            : "Update the product details below"}
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
                                    {mode === "create" ? "Create Product" : "Update Product"}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}