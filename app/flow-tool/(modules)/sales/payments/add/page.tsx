"use client";

import { PaymentForm } from "@/components/sales/payment/payment-form";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";

export default function AddPaymentPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Payment"
        description="Quick setup - add details later in purchase settings"
        backUrl="/flow-tool/sales/payments"
      />

      <SplitLayoutWithAudit>
        <PaymentForm mode="create" />
      </SplitLayoutWithAudit>
    </div>
  );
}