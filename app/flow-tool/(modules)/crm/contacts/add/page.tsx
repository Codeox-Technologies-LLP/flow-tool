"use client";

import { ContactForm } from "@/components/crm/contact/contact-form";
import { PageHeader } from "@/components/shared/page-header";

export default function AddContactPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Contact"
        description="Quick setup - add details later in Contact settings"
        backUrl="/flow-tool/crm/contacts"
      />
        <ContactForm mode="create" />
    </div>
  );
}
