import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { getDeliveryDetail } from "@/api/delivery/server-delivery";
import { DeliveryForm } from "@/components/sales/delivery/delivery-form";
import { StatusActions } from "@/components/shared/StatusActions";

interface EditDeliveryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDeliveryPage({ params }: EditDeliveryPageProps) {
  const { id } = await params;
  
  const detailResponse = await getDeliveryDetail(id);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/sales/deliveries");
  }

  const { delivery, actions } = detailResponse.data;

  const deliveryData = {
    relatedTo: delivery.relatedTo,
    contactId: delivery.contactId || undefined,
    assignedTo: delivery.assignedTo || undefined,
    locationId: delivery.locationId || undefined,
    billingAddress: delivery.billingAddress,
    deliveryAddress: delivery.deliveryAddress,
    dealId: delivery.dealId || undefined,
    quotationId: delivery.quotationId || undefined,
    expiryDate: delivery.expiryDate 
      ? new Date(delivery.expiryDate).toISOString().split('T')[0] 
      : undefined,
    amount: delivery.amount,
    status: delivery.status,
    products: delivery.products.map((p: any) => ({
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
        title={`Edit Delivery - ${delivery.deliveryId}`}
        description="Update Delivery information and products"
        backUrl="/flow-tool/sales/deliveries"
        actions={
          <StatusActions
            entityId={delivery.id}
            entity="delivery"
            actions={actions}
            type="status"
          />
        }
      />

        <DeliveryForm mode="edit" delivery={deliveryData} deliveryId={id} />
    </div>
  );
}