import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { getLeadAudit, getLeadDetail } from "@/api/lead/server-lead";
import { LeadForm } from "@/components/crm/lead/lead-form";
import { LeadAuditLog } from "@/components/crm/lead/lead-audit-log";

interface EditLeadPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLeadPage({ params }: EditLeadPageProps) {
  const { id } = await params;
  
  // Fetch Lead details and audit log server-side
  const [detailResponse, auditResponse] = await Promise.all([
    getLeadDetail(id),
    getLeadAudit(id),
  ]);

  // Redirect if Lead not found
  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/crm/leads");
  }

  // Extract audit data or use empty array
  const auditData = auditResponse?.status && auditResponse.data ? auditResponse.data : [];
  console.log("detailResponse", detailResponse);
  console.log("auditResponse", auditResponse);
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={detailResponse.data.name}
        description={detailResponse.data.enquiryId || "Update Lead information and settings"}
        backUrl="/flow-tool/crm/leads"
      />

      <SplitLayout
        sidePanel={<LeadAuditLog auditData={auditData} />}
      >
        <LeadForm mode="edit" lead={detailResponse.data} enquiryId={id} />
      </SplitLayout>
    </div>
  );
}
