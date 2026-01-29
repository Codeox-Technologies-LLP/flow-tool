import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { PurchaseForm } from "@/components/purchase/purchase/purchase-form";
import { getPurchaseDetail } from "@/api/purchase/server-purchase";

interface EditPurchasePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPurchasePage({ params }: EditPurchasePageProps) {
  const { id } = await params;
  
   const detailResponse = await getPurchaseDetail(id);
  
  
    if (!detailResponse || !detailResponse.status || !detailResponse.data) {
      redirect("/flow-tool/purchase/purchase-orders");
    }
  
    const purchase = detailResponse.data.purchase;
    console.log(purchase,"akkak")
  
    const purchaseData = {
      vendorId: purchase.vendorId,
      locationId: purchase.locationId,
       products: (purchase.products || []).map((p) => ({
        product: p.product,
        qty: p.qty,
        price: p.price,
        discount: p.discount ?? 0,
      })),
      amount: purchase.amount ?? 0,
      subtotal: purchase.subtotal ?? 0,
      discountTotal: purchase.discountTotal ?? 0,
      total: purchase.total ?? 0,
    };
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={purchase.purchaseId}
        description={purchase.purchaseId || "Update product information and settings"}
        backUrl="/flow-tool/purchase/purchase-orders"
      />

      <SplitLayout>
        <PurchaseForm mode="edit" purchase={purchaseData} purchaseId={id} />
      </SplitLayout>
    </div>
  );
}
