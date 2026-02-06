import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { getReceiptDetail } from "@/api/receipt/server-receipt";
import { ReceiptForm } from "@/components/purchase/receipt/receipt-form";
import { StatusActions } from "@/components/shared/StatusActions";
import { EntityDeleteAction } from "@/components/shared/entity-delete-action";

interface EditReceiptPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReceiptPage({ params }: EditReceiptPageProps) {
  const { id } = await params;

  const detailResponse = await getReceiptDetail(id);

  if (!detailResponse?.status || !detailResponse?.data?.receipt) {
    redirect("/flow-tool/purchase/receipt");
  }

  const { receipt, actions, permissions } = detailResponse.data;
  const isDraft = receipt.status === "draft";

  const receiptData = {
    receiptId: receipt.receiptId,
    vendorId: receipt.vendorId,
    locationId: receipt.locationId,
    products: (receipt.products || []).map((p) => ({
      product: p.product,
      qty: p.qty,
      price: p.price,
      discount: p.discount ?? 0,
      returnedCount: p.returnedCount ?? 0,
    })),
    amount: receipt.amount ?? 0,
    subtotal: receipt.subtotal ?? 0,
    discountTotal: receipt.discountTotal ?? 0,
    total: receipt.total ?? 0,
    deliveryDate: receipt.deliveryDate,
    status: receipt.status,

  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Receipt"
        description={receipt.receiptId}
        backUrl="/flow-tool/purchase/receipt"
        actions={
          <div className="flex items-center gap-2">
            <StatusActions
              entityId={receipt.id}
              entity="receipt"
              actions={actions}
              type="status"
            />
            {receipt.status === "draft" && (
              <EntityDeleteAction
                id={receipt.id}
                entity="receipt"
                entityName="Receipt"
                visible={permissions.canDelete}
                redirectTo="/flow-tool/purchase/receipt"
              />
            )}
          </div>
        }
      />

      <SplitLayout>
        <ReceiptForm
          mode="edit"
          receipt={receiptData}
          receiptId={id}
          isDraft={isDraft}
        />
      </SplitLayout>
    </div>
  );
}