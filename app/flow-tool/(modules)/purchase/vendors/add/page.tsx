"use client";

import { VendorForm } from "@/components/purchase/vendor/vendor-form";
import { PageHeader } from "@/components/shared/page-header";

export default function AddVendorPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Vendor"
        description="Quick setup - add details later in Vendor settings"
        backUrl="/flow-tool/purchase/vendors"
      />

        <VendorForm mode="create" />
    </div>
  );
}
