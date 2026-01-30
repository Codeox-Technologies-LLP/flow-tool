"use client";

import { InvoiceForm } from "@/components/sales/invoice/invoce-form";
import { PageHeader } from "@/components/shared/page-header";

export default function AddInvoicePage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Invoice"
        description="Quick setup - add details later in Invoice settings"
        backUrl="/flow-tool/sales/invoices"
      />

        <InvoiceForm mode="create" />
    </div>
  );
}
