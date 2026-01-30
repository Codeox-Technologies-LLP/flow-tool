import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { getProformaDetail } from "@/api/proforma/server-proforma";
import { ProformaForm } from "@/components/sales/proforma/proforma-form";

interface EditProformaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProformaPage({ params }: EditProformaPageProps) {
  const { id } = await params;
  
  const detailResponse = await getProformaDetail(id);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/sales/proformas");
  }

  const proformaData = detailResponse.data;

  const proforma = {
    relatedTo: proformaData.relatedTo,
    contactId: proformaData.contactId || undefined,
    assignedTo: proformaData.assignedTo || undefined,
    locationId: proformaData.locationId || undefined,
    billingAddress: proformaData.billingAddress,
    deliveryAddress: proformaData.deliveryAddress,
    dealId: proformaData.dealId || undefined,
    quotationId: proformaData.quotationId || undefined,
    expiryDate: proformaData.expiryDate 
      ? new Date(proformaData.expiryDate).toISOString().split('T')[0] 
      : undefined,
    amount: proformaData.amount,
    status: proformaData.status,
    products: proformaData.products.map((p: any) => ({
      product: p.product,
      productName: p.productName,
      qty: p.qty,
      rate: p.rate,
      discount: p.discount,
      tax: 0,
      description: p.description || "",
    })),
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={`Edit Proforma - ${proformaData.proformaId}`}
        description="Update proforma information and products"
        backUrl="/flow-tool/sales/proformas"
      />

        <ProformaForm mode="edit" proforma={proforma} proformaId={id} />
    </div>
  );
}