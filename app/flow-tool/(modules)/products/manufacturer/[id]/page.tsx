import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { ManufacturerForm } from "@/components/products/manufacturer/manufacturer-form";
import { getManufacturerDetail } from "@/api/manufacturer/server-manufacturer";

interface EditManufacturerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditManufacturerPage({ params }: EditManufacturerPageProps) {
  const { id } = await params;
  
  const [detailResponse] = await Promise.all([
    getManufacturerDetail(id),
  ]);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/products/manufacturer");
  }

  console.log("detailResponse", detailResponse);
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={detailResponse.data.name}
        description={detailResponse.data.name || "Update product information and settings"}
        backUrl="/flow-tool/products/manufacturer"
      />

      <SplitLayout>
        <ManufacturerForm mode="edit" manufacturer={detailResponse.data} manufacturerId={id} />
      </SplitLayout>
    </div>
  );
}
