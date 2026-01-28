"use client";

import { LeadForm } from "@/components/crm/lead/lead-form";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";

export default function AddLeadPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Lead"
        description="Quick setup - add details later in Lead settings"
        backUrl="/flow-tool/crm/leads"
      />

      <SplitLayoutWithAudit>
        <LeadForm mode="create" />
      </SplitLayoutWithAudit>
    </div>
  );
}