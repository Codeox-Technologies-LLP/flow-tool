"use client";

import { ProductForm } from "@/components/products/product/product-form";
import { PageHeader } from "@/components/shared/page-header";

export default function AddProductPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title="Add New Product"
                description="Quick setup - add details later in product settings"
                backUrl="/flow-tool/products/items"
            />
            <ProductForm mode="create" />
        </div>
    );
}