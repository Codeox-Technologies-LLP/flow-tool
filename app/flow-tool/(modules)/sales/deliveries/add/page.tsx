"use client";

import { DeliveryForm } from "@/components/sales/delivery/delivery-form";
import { PageHeader } from "@/components/shared/page-header";

export default function AddDeliveryPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add New Delivery"
        description="Quick setup - add details later in Delivery settings"
        backUrl="/flow-tool/sales/deliveries"
      />

        <DeliveryForm mode="create" />
    </div>
  );
}
