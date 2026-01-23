import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayout } from "@/components/shared/split-layout";
import { getCategoryDetail } from "@/api/category/server-category";
import { CategoryForm } from "@/components/products/category/category-form";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  
  const [detailResponse] = await Promise.all([
    getCategoryDetail(id),
  ]);

  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/products/categories");
  }

  console.log("detailResponse", detailResponse);
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={detailResponse.data.name}
        description={detailResponse.data.name || "Update product information and settings"}
        backUrl="/flow-tool/products/categories"
      />

      <SplitLayout>
        <CategoryForm mode="edit" category={detailResponse.data} categoryId={id} />
      </SplitLayout>
    </div>
  );
}
