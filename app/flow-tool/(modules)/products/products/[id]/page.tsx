import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { getProductDetail } from "@/api/product/server-product";
import { ProductForm } from "@/components/products/product/product-form";

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;

  const detailResponse = await getProductDetail(id);
  if (!detailResponse?.status || !detailResponse.data) {
    redirect("/flow-tool/products/products");
  }

  const product = detailResponse.data;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={product.name}
        description={
          product.productId || "Update product information and settings"
        }
        backUrl="/flow-tool/products/products"
      />

      <SplitLayout>
        <ProductForm
          mode="edit"
          product={product}
          productId={id}
        />
      </SplitLayout>
    </div>
  );
}
