import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { getReceiptDetail } from "@/api/receipt/server-receipt";
import { ReceiptForm } from "@/components/purchase/receipt/receipt-form";
import { StatusActions } from "@/components/shared/StatusActions";

interface EditReceiptPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReceiptPage({ params }: EditReceiptPageProps) {
  const { id } = await params;

  const detailResponse = await getReceiptDetail(id);

  if (!detailResponse?.status || !detailResponse?.data?.receipt) {
    redirect("/flow-tool/purchase/receipt");
  }

  const { receipt, actions } = detailResponse.data;

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
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={receipt.receiptId}
        description="Update receipt information and settings"
        backUrl="/flow-tool/purchase/receipt"
        actions={
          <StatusActions
            entityId={receipt.id}
            entity="receipt"
            actions={actions}
            type="status"
          />
        }
      />

      <SplitLayout>
        <ReceiptForm
          mode="edit"
          receipt={receiptData}
          receiptId={id}
        />
      </SplitLayout>
    </div>
  );
}