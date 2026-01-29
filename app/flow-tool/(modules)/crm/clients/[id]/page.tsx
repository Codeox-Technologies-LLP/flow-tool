import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { getClientDetail } from "@/api/client/server-client";
import { ClientForm } from "@/components/crm/client/client-form";

interface EditClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;
  
  const detailResponse = await getClientDetail(id);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/crm/clients");
  }

  const clientData = (detailResponse.data as any).data || detailResponse.data;

  const client = {
    id: clientData.id,
    client: clientData.client,
    name: clientData.name,
    email: clientData.email,
    type: clientData.type,
    source: clientData.source,
    billingAddress: clientData.billingAddress,
    deliveryAddresses: clientData.deliveryAddresses,
    contacts: clientData.contacts,
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={client.name || "Edit Client"}
        description="Update Client information and settings"
        backUrl="/flow-tool/crm/clients"
      />

      <ClientForm mode="edit" client={client} clientId={id} />
    </div>
  );
}