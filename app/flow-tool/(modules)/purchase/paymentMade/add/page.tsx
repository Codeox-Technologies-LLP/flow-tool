"use client";

import { PaymentMadeForm } from "@/components/purchase/paymentMade/paymentMade-form";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";

export default function AddPaymentMadePage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Payment"
        description="Quick setup - add details later in purchase settings"
        backUrl="/flow-tool/purchase/paymentMade"
      />

      {/* <SplitLayoutWithAudit> */}
        <PaymentMadeForm mode="create" />
      {/* </SplitLayoutWithAudit> */}
    </div>
  );
}