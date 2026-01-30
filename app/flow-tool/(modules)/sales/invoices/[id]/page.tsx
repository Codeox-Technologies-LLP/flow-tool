import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { getInvoiceDetail } from "@/api/invoice/server-invoice";
import { InvoiceForm } from "@/components/sales/invoice/invoce-form";

interface EditInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { id } = await params;
  
  const detailResponse = await getInvoiceDetail(id);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/sales/invoices");
  }

  const invoiceData = detailResponse.data;

  const invoice = {
    relatedTo: invoiceData.relatedTo,
    contactId: invoiceData.contactId || undefined,
    assignedTo: invoiceData.assignedTo || undefined,
    locationId: invoiceData.locationId || undefined,
    billingAddress: invoiceData.billingAddress,
    deliveryAddress: invoiceData.deliveryAddress,
    dealId: invoiceData.dealId || undefined,
    quotationId: invoiceData.quotationId || undefined,
    expiryDate: invoiceData.expiryDate 
      ? new Date(invoiceData.expiryDate).toISOString().split('T')[0] 
      : undefined,
    amount: invoiceData.amount,
    status: invoiceData.status,
    products: invoiceData.products.map((p: any) => ({
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
        title={`Edit Invoice - ${invoiceData.invoiceId}`}
        description="Update Invoice information and products"
        backUrl="/flow-tool/sales/invoices"
      />

        <InvoiceForm mode="edit" invoice={invoice} invoiceId={id} />
    </div>
  );
}