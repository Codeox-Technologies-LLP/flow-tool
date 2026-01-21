"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";
import { LocationForm } from "@/components/inventory/location/location-form";

export default function AddLocationPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Location"
        description="Quick setup - add details later in location settings"
        backUrl="/flow-tool/inventory/locations"
      />

      <SplitLayoutWithAudit>
        <LocationForm mode="create" />
      </SplitLayoutWithAudit>
    </div>
  );
}
