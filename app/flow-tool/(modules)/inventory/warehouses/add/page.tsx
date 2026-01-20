"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";
import { WarehouseForm } from "@/components/inventory/warehouse/warehouse-form";

export default function AddWarehousePage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Warehouse"
        description="Quick setup - add details later in warehouse settings"
        backUrl="/flow-tool/inventory/warehouses"
      />

      <SplitLayoutWithAudit>
        <WarehouseForm mode="create" />
      </SplitLayoutWithAudit>
    </div>
  );
}