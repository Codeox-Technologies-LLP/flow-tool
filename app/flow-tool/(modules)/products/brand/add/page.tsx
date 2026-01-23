"use client";

import { BrandForm } from "@/components/products/brand/brand-form";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";

export default function AddBrandPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Brand"
        description="Quick setup - add details later in brand settings"
        backUrl="/flow-tool/products/brand"
      />

      <SplitLayoutWithAudit>
        <BrandForm mode="create" />
      </SplitLayoutWithAudit>
    </div>
  );
}