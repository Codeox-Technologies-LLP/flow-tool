import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { BrandForm } from "@/components/products/brand/brand-form";
import { getBrandDetail } from "@/api/brand/server-brand";

interface EditBrandPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = await params;
  
  const [detailResponse] = await Promise.all([
    getBrandDetail(id),
  ]);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/products/brand");
  }

  console.log("detailResponse", detailResponse);
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={detailResponse.data.name}
        description={detailResponse.data.name || "Update product information and settings"}
        backUrl="/flow-tool/products/brand"
      />

      <SplitLayout>
        <BrandForm mode="edit" brand={detailResponse.data} brandId={id} />
      </SplitLayout>
    </div>
  );
}
