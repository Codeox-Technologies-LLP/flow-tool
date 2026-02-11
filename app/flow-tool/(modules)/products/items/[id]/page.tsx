import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { getProductDetail } from "@/api/product/server-product";
import { ProductTab } from "@/components/products/product/product-tabs"; 

interface EditProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function EditProductPage({ 
  params,
  searchParams 
}: EditProductPageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  
  const [detailResponse] = await Promise.all([
    getProductDetail(id),
  ]);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/products/items");
  }

  return (
    <div className="flex flex-col  h-full">
      <PageHeader
        title={detailResponse.data.name}
        description={detailResponse.data.productId || "Manage product information and settings"}
        backUrl="/flow-tool/products/items"
      />

      <SplitLayout>
        <ProductTab 
          product={detailResponse.data} 
          productId={id}
          activeTab={tab || "overview"}
        />
      </SplitLayout>
    </div>
  );
}