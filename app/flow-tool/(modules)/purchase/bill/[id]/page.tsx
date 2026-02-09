import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { getBillDetail } from "@/api/bill/server-bill";
import { BillForm } from "@/components/purchase/bill/bill-form";
import { StatusActions } from "@/components/shared/StatusActions";
import { EntityDeleteAction } from "@/components/shared/entity-delete-action";

interface EditBillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBillPage({ params }: EditBillPageProps) {
  const { id } = await params;

  const detailResponse = await getBillDetail(id);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/purchase/bill");
  }

  const { bill, actions, permissions } = detailResponse.data;
  const isDraft = bill.status === "draft";

  const billData = {
    id: bill.id,
    orgId: bill.orgId,
    vendorId: bill.vendorId,
    warehouseId: bill.warehouseId,
    locationId: bill.locationId,
    deliveryDate: bill.deliveryDate,

    products: bill.products.map(p => ({
      product: p.product,
      productName: p.productName,
      qty: p.qty,
      price: p.price,
      discount: p.discount ?? 0,
    })),

    subtotal: bill.subtotal,
    discountTotal: bill.discountTotal,
    total: bill.total,
    amount: bill.amount,
  };
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={bill.billId}
        description={bill.billId || "Update product information and settings"}
        backUrl="/flow-tool/purchase/bill"
        actions={
          <div className="flex items-center gap-2">
            <StatusActions
              entityId={bill.id}
              entity="bill"
              actions={actions}
              type="status"
            />
            {bill.status === "draft" && (
              <EntityDeleteAction
                id={bill.id}
                entity="bill"
                entityName="Bill"
                visible={permissions.canDelete}
                redirectTo="/flow-tool/purchase/bill"
              />
            )}
          </div>
        }
      />

      <SplitLayout>
        <BillForm mode="edit" bill={billData} billId={id} isDraft={isDraft} />
      </SplitLayout>
    </div>
  );
}
