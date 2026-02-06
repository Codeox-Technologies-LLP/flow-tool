import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { StatusActions } from "@/components/shared/StatusActions";
import { getPurchaseDetail } from "@/api/purchase/server-purchase";
import { PurchaseForm } from "@/components/purchase/purchase/purchase-form";
import { EntityDeleteAction } from "@/components/shared/entity-delete-action";

interface EditPurchasePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPurchasePage({
  params,
}: EditPurchasePageProps) {
  const { id } = await params;

  const detailResponse = await getPurchaseDetail(id);

  if (!detailResponse?.status || !detailResponse?.data) {
    redirect("/flow-tool/purchase/purchase-orders");
  }

  console.log("response", detailResponse);


  const { purchase, receiptId, billId, actions, permissions } = detailResponse.data;


  const isDraft = purchase.status === "draft";

  return (
    <div className="flex flex-col h-full">
      {/* <SplitLayoutWithAudit> */}
      <div className="flex flex-col gap-5">
        <PageHeader
          title="Purchase"
          description={purchase.purchaseId}
          backUrl="/flow-tool/purchase/purchase-orders"
          actions={
            <div className="flex items-center gap-2">
              <StatusActions
                entityId={purchase.id}
                entity="purchase"
                actions={actions}
                type="status"
              />
              {purchase.status === "draft" && (
                <EntityDeleteAction
                  id={purchase.id}
                  entity="purchase"
                  entityName="Purchase"
                  visible={permissions.canDelete}
                  redirectTo="/flow-tool/purchase/purchase-orders"
                />
              )}
            </div>
          }
        />

        <PurchaseForm
          mode="edit"
          purchase={purchase}
          receiptId={receiptId}
          billId={billId}
          purchaseId={id}
          isDraft={isDraft}
        />
      </div>
      {/* </SplitLayoutWithAudit> */}
    </div>
  );
}
