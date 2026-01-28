"use client";

import { ClientForm } from "@/components/crm/client/client-form";
import { PageHeader } from "@/components/shared/page-header";

export default function AddClientPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Client"
        description="Quick setup - add details later in Client settings"
        backUrl="/flow-tool/crm/clients"
      />

        <ClientForm mode="create" />
    </div>
  );
}