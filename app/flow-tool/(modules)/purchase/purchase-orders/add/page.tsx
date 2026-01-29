"use client";

import { PurchaseForm } from "@/components/purchase/purchase/purchase-form";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";

export default function AddPurchasePage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Purchase"
        description="Quick setup - add details later in purchase settings"
        backUrl="/flow-tool/purchase/purchase-orders"
      />

      {/* <SplitLayoutWithAudit> */}
        <PurchaseForm mode="create" />
      {/* </SplitLayoutWithAudit> */}
    </div>
  );
}