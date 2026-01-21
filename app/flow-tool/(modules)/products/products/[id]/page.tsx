import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { getProductDetail } from "@/api/product/server-product";
import { ProductForm } from "@/components/products/product/product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  const [detailResponse] = await Promise.all([
    getProductDetail(id),
  ]);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/products/products");
  }

  console.log("detailResponse", detailResponse);
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={detailResponse.data.name}
        description={detailResponse.data.productId || "Update product information and settings"}
        backUrl="/flow-tool/products/products"
      />

      <SplitLayout>
        <ProductForm mode="edit" product={detailResponse.data} productId={id} />
      </SplitLayout>
    </div>
  );
}
