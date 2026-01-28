"use client";

import { QuotationForm } from "@/components/inventory/quotations/quotation-form";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";

export default function AddQuotationPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Quotation"
        description="Create a quotation and add products later"
        backUrl="/flow-tool/sales/quotations"
      />

      <SplitLayoutWithAudit>
        <QuotationForm mode="create" />
      </SplitLayoutWithAudit>
    </div>
  );
}
