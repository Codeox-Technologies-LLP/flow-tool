import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { getPaymentDetail } from "@/api/payments/server-payment";
import { PaymentForm } from "@/components/sales/payment/payment-form";

interface EditPaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPaymentPage({ params }: EditPaymentPageProps) {
  const { id } = await params;
  
  const [detailResponse] = await Promise.all([
    getPaymentDetail(id),
  ]);

  if (!detailResponse || !detailResponse.status || !detailResponse.payment) {
    redirect("/flow-tool/sales/payments");
  }

  console.log("detailResponsedddd", detailResponse);
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={detailResponse.payment.paymentId}
        description={detailResponse.payment.paymentId || "Update product information and settings"}
        backUrl="/flow-tool/sales/payments"
      />

      <SplitLayout>
        <PaymentForm mode="edit" payment={detailResponse.payment} paymentId={id} />
      </SplitLayout>
    </div>
  );
}
