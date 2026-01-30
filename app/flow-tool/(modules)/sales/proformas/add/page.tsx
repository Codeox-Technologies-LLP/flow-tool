"use client";

import { ProformaForm } from "@/components/sales/proforma/proforma-form";
import { PageHeader } from "@/components/shared/page-header";

export default function AddProformaPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Proforma"
        description="Quick setup - add details later in Proforma settings"
        backUrl="/flow-tool/sales/proformas"
      />

        <ProformaForm mode="create" />
    </div>
  );
}
