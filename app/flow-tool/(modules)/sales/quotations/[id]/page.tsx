import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";
import { QuotationForm } from "@/components/inventory/quotations/quotation-form";
import { getQuotationDetail } from "@/api/quotations/quotation-server";
import { StatusActions } from "@/components/shared/StatusActions";

interface EditQuotationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuotationPage({
  params,
}: EditQuotationPageProps) {
  const { id } = await params;

  const detailResponse = await getQuotationDetail(id);

  console.log(detailResponse);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/sales/quotations");
  }

  const { quotation, client, deliveryId, actions } = detailResponse.data;

  return (
    <div className="flex flex-col h-full">
      <SplitLayoutWithAudit>
        <div className=" flex flex-col gap-5">

        <PageHeader
          title={`Quotation`}
          description={quotation.id}
          backUrl="/flow-tool/sales/quotations"
          actions={
            <StatusActions
              entityId={quotation.id}
              entity="quotation"
              actions={actions}
              type="status"
            />
          }
        />
        <QuotationForm
          mode="edit"
          quotation={quotation}
          client={client}
          deliveryId={deliveryId}
          quotationId={id}
        />
        </div>
      </SplitLayoutWithAudit>
    </div>
  );
}
