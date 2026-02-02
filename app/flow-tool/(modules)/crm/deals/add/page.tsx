"use client";

import { DealForm } from "@/components/crm/deal/deal-form";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";

export default function AddDealPage() {
  return (
    <div className="flex flex-col h-full">

      <SplitLayoutWithAudit>
        <div className=" flex flex-col gap-3">

      <PageHeader
        title="Add New Deal"
        description="Quick setup - add details later in Deal settings"
        backUrl="/flow-tool/crm/deals"
      />
        <DealForm mode="create" />
        </div>
      </SplitLayoutWithAudit>
    </div>
  );
}
