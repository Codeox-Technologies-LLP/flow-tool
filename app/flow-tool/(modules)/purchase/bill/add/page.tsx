"use client";

import { BillForm } from "@/components/purchase/bill/bill-form";
import { PageHeader } from "@/components/shared/page-header";

export default function AddBillPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Bill"
        description="Quick setup - add details later in Bill settings"
        backUrl="/flow-tool/purchase/bill"
      />

        <BillForm mode="create" />
    </div>
  );
}
