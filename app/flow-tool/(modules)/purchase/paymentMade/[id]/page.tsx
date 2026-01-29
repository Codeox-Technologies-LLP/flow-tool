import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { getPaymentMadeDetail } from "@/api/paymentMade/server-paymentMade";
import { PaymentMadeForm } from "@/components/purchase/paymentMade/paymentMade-form";

interface EditPaymentMadePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPaymentMadePage({ params }: EditPaymentMadePageProps) {
  const { id } = await params;
  
  const [detailResponse] = await Promise.all([
    getPaymentMadeDetail(id),
  ]);

  if (!detailResponse || !detailResponse.status || !detailResponse.payment) {
    redirect("/flow-tool/purchase/paymentMade");
  }

  console.log("detailResponsedddd", detailResponse);
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={detailResponse.payment.paymentMadeId}
        description={detailResponse.payment.paymentMadeId || "Update product information and settings"}
        backUrl="/flow-tool/purchase/paymentMade"
      />

      <SplitLayout>
        <PaymentMadeForm mode="edit" paymentMade={detailResponse.payment} paymentMadeId={id} />
      </SplitLayout>
    </div>
  );
}
