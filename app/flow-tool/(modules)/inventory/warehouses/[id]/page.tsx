import { redirect } from "next/navigation";
import { getWarehouseDetail, getWarehouseAudit } from "@/lib/api/server-warehouse";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { WarehouseForm } from "@/components/inventory/warehouse/warehouse-form";
import { WarehouseAuditLog } from "@/components/inventory/warehouse/warehouse-audit-log";

interface EditWarehousePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWarehousePage({ params }: EditWarehousePageProps) {
  const { id } = await params;
  
  // Fetch warehouse details and audit log server-side
  const [detailResponse, auditResponse] = await Promise.all([
    getWarehouseDetail(id),
    getWarehouseAudit(id),
  ]);

  // Redirect if warehouse not found
  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/inventory/warehouses");
  }

  // Extract audit data or use empty array
  const auditData = auditResponse?.status && auditResponse.data ? auditResponse.data : [];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Edit Warehouse"
        description="Update warehouse information and settings"
        backUrl="/flow-tool/inventory/warehouses"
      />

      <SplitLayout
        sidePanel={<WarehouseAuditLog auditData={auditData} />}
      >
        <WarehouseForm mode="edit" warehouse={detailResponse.data} warehouseId={id} />
      </SplitLayout>
    </div>
  );
}
