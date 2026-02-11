import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { getVendorDetail } from "@/api/vendor/server-vendor";
import { VendorForm } from "@/components/purchase/vendor/vendor-form";

interface EditVendorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVendorPage({ params }: EditVendorPageProps) {
  const { id } = await params;
  
  const detailResponse = await getVendorDetail(id);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/purchase/vendors");
  }

  const vendorData = detailResponse.data;

  const vendor = {
    name: vendorData.name,
    companyName: vendorData.companyName || "",
    email: vendorData.email || "",
    phone: vendorData.phone || "",
    address: vendorData.address || "",
    country: vendorData.country || "",
    state: vendorData.state || "",
    city: vendorData.city || "",
    zip: vendorData.zip || "",
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={vendorData.name}
        description="Update vendor information and settings"
        backUrl="/flow-tool/purchase/vendors"
      />

      <VendorForm mode="edit" vendor={vendor} vendorId={id} />
    </div>
  );
}