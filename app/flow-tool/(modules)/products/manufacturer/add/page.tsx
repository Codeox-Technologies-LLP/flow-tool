"use client";

import { ManufacturerForm } from "@/components/products/manufacturer/manufacturer-form";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";

export default function AddManufacturerPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Manufacturer"
        description="Quick setup - add details later in manufacturer settings"
        backUrl="/flow-tool/products/manufacturer"
      />

      <SplitLayoutWithAudit>
        <ManufacturerForm mode="create" />
      </SplitLayoutWithAudit>
    </div>
  );
}