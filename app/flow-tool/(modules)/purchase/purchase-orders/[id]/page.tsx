import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";
import { StatusActions } from "@/components/shared/StatusActions";
import { getPurchaseDetail } from "@/api/purchase/server-purchase";
import { PurchaseForm } from "@/components/purchase/purchase/purchase-form";

interface EditPurchasePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPurchasePage({
  params,
}: EditPurchasePageProps) {
  const { id } =await params;

  const detailResponse = await getPurchaseDetail(id);

  if (!detailResponse?.status || !detailResponse?.data) {
    redirect("/flow-tool/purchase/purchase-orders");
  }

  const { purchase, receiptId, billId, actions } = detailResponse.data;

  return (
    <div className="flex flex-col h-full">
      {/* <SplitLayoutWithAudit> */}
        <div className="flex flex-col gap-5">
          <PageHeader
            title="Purchase"
            description={purchase.purchaseId}
            backUrl="/flow-tool/purchase/purchase-orders"
            actions={
              <StatusActions
                entityId={purchase.id}
                entity="purchase"
                actions={actions}
                type="status"
              />
            }
          />

          <PurchaseForm
            mode="edit"
            purchase={purchase}
            receiptId={receiptId}
            billId={billId}
            purchaseId={id}
          />
        </div>
      {/* </SplitLayoutWithAudit> */}
    </div>
  );
}
