"use client";

import { PaymentMadeForm } from "@/components/purchase/paymentMade/paymentMade-form";
import { PageHeader } from "@/components/shared/page-header";
import { useSearchParams } from "next/navigation";

export default function AddPaymentMadePage() {
  const searchParams = useSearchParams();
  const billId = searchParams.get("billId");
  
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Payment"
        description="Quick setup - add details later in purchase settings"
        backUrl="/flow-tool/purchase/paymentMade"
      />

        <PaymentMadeForm mode="create"  billId={billId ?? undefined} />
    </div>
  );
}