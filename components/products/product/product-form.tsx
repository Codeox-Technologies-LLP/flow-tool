"use client";

import { useEffect, useState } from "react";
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
import { brandApi } from "@/api/brand/brand";
import { manufacturerApi } from "@/api/manufacturer/manufacturer";

interface ProductFormProps {
    mode: "create" | "edit";
    product?: ProductData;
    productId?: string;
}

const PRODUCT_TYPES = [
  { _id: "goods", name: "Goods" },
  { _id: "service", name: "Service" },
];

const PRODUCT_SCOPE = [
  { _id: "company", name: "Company" },
  { _id: "organisation", name: "Organisation" },
];

const UOM_OPTIONS = [
  { _id: "kg", name: "Kilogram (kg)" },
  { _id: "g", name: "Gram (g)" },
  { _id: "cm", name: "Centimeter (cm)" },
  { _id: "m", name: "Meter (m)" },
  { _id: "l", name: "Liter (l)" },
  { _id: "ml", name: "Milliliter (ml)" },
  { _id: "pcs", name: "Piece (pcs)" },
  { _id: "box", name: "Box" },
  { _id: "packet", name: "Packet" },
  { _id: "dozen", name: "Dozen" },
  { _id: "set", name: "Set" },
  { _id: "pair", name: "Pair" },
  { _id: "unit", name: "Unit" },
];

export function ProductForm({
    mode,
    product,
    productId,
}: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState<Array<{ _id: string; name: string }>>([]);
    const [manufacturers, setManufacturers] = useState<Array<{ _id: string; name: string }>>([]);
    const [loadingBrands, setLoadingBrands] = useState(false);
    const [loadingManufacturers, setLoadingManufacturers] = useState(false);


    useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const res = await brandApi.dropdown();
          setBrands(
            res.map((b: any) => ({
              _id: b._id,
              name: b.name,
            }))
          );
      } finally {
        setLoadingBrands(false);
      }
    };

    const fetchManufacturers = async () => {
      try {
        setLoadingManufacturers(true);
        const res = await manufacturerApi.dropdown();
          setManufacturers(
            res.map((m: any) => ({
              _id: m._id,
              name: m.name,
            }))
          );
      } finally {
        setLoadingManufacturers(false);
      }
    };

    fetchBrands();
    fetchManufacturers();
  }, []);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
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

    const selectedType = watch("type");
    const selectedScope = watch("productScope");
    const selectedUom = watch("uom");
    const productName = watch("name");
    const productType = watch("type");

    useEffect(() => {
    if (mode !== "create") return;

    if (productName?.trim()) {
        const prefix = productType === "goods" ? "PRD" : "SRV";
        const namePart = productName
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 3)
        .toUpperCase();

        const uniquePart = Date.now().toString().slice(-6);

        setValue(
        "productCode",
        `${prefix}-${namePart}-${uniquePart}`,
        { shouldValidate: true }
        );
    }
    }, [productName, productType, mode, setValue]);

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
                        router.push(`/flow-tool/products/items/${response.productId}`);
                    } else {
                        router.push("/flow-tool/products/items");
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
        router.push("/flow-tool/products/items");
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
                        {/* Product Type Dropdown */}
                        <FormField
                            id="type"
                            label="Product Type"
                            type="dropdown"
                            placeholder="Select product type (goods/service)"
                            searchPlaceholder="Search product types..."
                            emptyText="No product types found"
                            required
                            options={PRODUCT_TYPES}
                            value={selectedType}
                            onValueChange={(value) => setValue("type", value as "goods" | "service", { shouldValidate: true })}
                            error={errors.type}
                        />

                        {/* Product Scope Dropdown */}
                        <FormField
                            id="productScope"
                            label="Product Scope"
                            type="dropdown"
                            placeholder="Select product scope (company/organisation)"
                            searchPlaceholder="Search product scopes..."
                            emptyText="No product scopes found"
                            required
                            options={PRODUCT_SCOPE}
                            value={selectedScope}
                            onValueChange={(value) => setValue("productScope", value as "company" | "organisation", { shouldValidate: true })}
                            error={errors.productScope}
                        />

                        {/* Name */}
                        <FormField
                            id="name"
                            label="Name"
                            type="text"
                            placeholder="Enter product name"
                            required
                            register={register("name")}
                            error={errors.name}
                        />

                        {/* Product Code */}
                        <FormField
                            id="productCode"
                            label="Product Code"
                            type="text"
                            placeholder="Enter product code/SKU"
                            register={register("productCode")}
                            error={errors.productCode}
                        />

                        {/* Manufacturer */}
                        <FormField
                            id="manufacture"
                            label="Manufacturer"
                            type="dropdown"
                            placeholder="Select manufacturer"
                            searchPlaceholder="Search manufacturers..."
                            emptyText="No manufacturers found"
                            options={manufacturers}
                            value={watch("manufacture")}
                            onValueChange={(value) =>
                                setValue("manufacture", value, { shouldValidate: true })
                            }
                            loading={loadingManufacturers}
                            error={errors.manufacture}
                        />

                        {/* Brand */}
                        <FormField
                            id="brand"
                            label="Brand"
                            type="dropdown"
                            placeholder="Select brand"
                            searchPlaceholder="Search brands..."
                            emptyText="No brands found"
                            options={brands}
                            value={watch("brand")}
                            onValueChange={(value) =>
                                setValue("brand", value, { shouldValidate: true })
                            }
                            loading={loadingBrands}
                            error={errors.brand}
                        />

                        {/* Cost Price */}
                        <FormField
                            id="price"
                            label="Cost Price"
                            type="number"
                            placeholder="Enter cost price"
                            required
                            register={register("price", { valueAsNumber: true })}
                            error={errors.price}
                        />

                        {/* Unit Dropdown */}
                        <FormField
                            id="uom"
                            label="Unit"
                            type="dropdown"
                            placeholder="Select unit (e.g., kg, dozen)"
                            searchPlaceholder="Search units..."
                            emptyText="No units found"
                            required
                            options={UOM_OPTIONS}
                            value={selectedUom}
                            onValueChange={(value) => setValue("uom", value, { shouldValidate: true })}
                            error={errors.uom}
                        />

                        {/* Description */}
                        <FormField
                            id="description"
                            label="Description"
                            type="text"
                            placeholder="Enter product description"
                            register={register("description")}
                            error={errors.description}
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