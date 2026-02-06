"use client";

import { useSearchParams } from "next/navigation";
import { BillForm } from "@/components/purchase/bill/bill-form";
import { PageHeader } from "@/components/shared/page-header";

export default function AddBillPage() {
  const searchParams = useSearchParams();
  const receiptId = searchParams.get("receiptId");

  if (!receiptId) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title="Add New Bill"
          description="Receipt not selected"
          backUrl="/flow-tool/purchase/receipt"
        />

        <div className="flex flex-1 items-center justify-center">
          <p className="text-red-500 text-sm">
            Receipt ID missing. Please create the bill from the receipt detail
            page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Bill"
        description="Quick setup - add details later in Bill settings"
        backUrl="/flow-tool/purchase/bill"
      />

      <BillForm mode="create" receiptId={receiptId} />
    </div>
  );
}