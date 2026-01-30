import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { getDeliveryDetail } from "@/api/delivery/server-delivery";
import { DeliveryForm } from "@/components/sales/delivery/delivery-form";

interface EditDeliveryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDeliveryPage({ params }: EditDeliveryPageProps) {
  const { id } = await params;
  
  const detailResponse = await getDeliveryDetail(id);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/sales/deliveries");
  }

  const deliveryData = detailResponse.data;

  const delivery = {
    relatedTo: deliveryData.relatedTo,
    contactId: deliveryData.contactId || undefined,
    assignedTo: deliveryData.assignedTo || undefined,
    locationId: deliveryData.locationId || undefined,
    billingAddress: deliveryData.billingAddress,
    deliveryAddress: deliveryData.deliveryAddress,
    dealId: deliveryData.dealId || undefined,
    quotationId: deliveryData.quotationId || undefined,
    expiryDate: deliveryData.expiryDate 
      ? new Date(deliveryData.expiryDate).toISOString().split('T')[0] 
      : undefined,
    amount: deliveryData.amount,
    status: deliveryData.status,
    products: deliveryData.products.map((p: any) => ({
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
        title={`Edit Delivery - ${deliveryData.deliveryId}`}
        description="Update Delivery information and products"
        backUrl="/flow-tool/sales/deliveries"
      />

        <DeliveryForm mode="edit" delivery={delivery} deliveryId={id} />
    </div>
  );
}