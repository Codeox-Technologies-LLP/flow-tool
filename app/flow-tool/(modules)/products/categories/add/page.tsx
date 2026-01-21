"use client";

import { CategoryForm } from "@/components/products/category/category-form";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";

export default function AddCategoryPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Category"
        description="Quick setup - add details later in category settings"
        backUrl="/flow-tool/products/categories"
      />
        <CategoryForm mode="create" />
    </div>
  );
}