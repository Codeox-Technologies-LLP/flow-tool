import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { getDealAudit, getDealDetail } from "@/api/deal/server-deal";
import { DealForm } from "@/components/crm/deal/deal-form";
import { DealAuditLog } from "@/components/crm/deal/deal-audit-log";

interface EditDealPageProps {
    params: Promise<{ id: string }>; 
}

export default async function EditDealPage({ params }: EditDealPageProps) {
    const { id } = await params; 

    const detailResponse = await getDealDetail(id);
    const auditResponse = await getDealAudit(id);

    if (!detailResponse?.status || !detailResponse.data) {
        redirect("/flow-tool/crm/deals");
    }

    const dealData = detailResponse.data;

    const auditData = auditResponse.status ? auditResponse.data : [];

    const deal = {
        title: dealData.title,
        closeDate: dealData.closeDate,
            // typeof dealData.closeDate === "string"
            //     ? dealData.closeDate
            //     : dealData.closeDate?.toISOString(),
        value: dealData.value,
        clientId: dealData.clientId,
        contactId: dealData.contactId,
        probability: dealData.probability,
        note: dealData.note,
        stageOrder: dealData.stageOrder,
        pipelineId: dealData.pipeline?.id,
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title={dealData.title}
                description={dealData.title || "Update Deal information and settings"}
                backUrl="/flow-tool/crm/deals"
            />

            <SplitLayout
                sidePanel={<DealAuditLog auditData={auditData} />}
            >
                <DealForm mode="edit" deal={deal} dealId={id} />
            </SplitLayout>
        </div>
    );
}