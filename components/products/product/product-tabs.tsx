"use client";

import { ProductForm } from "./product-form";
import { ProductData } from "@/api/product/product";
import { ProductLocations } from "./product-locations";
import { ProductPurchase } from "./product-purchase";
import { ReusableTabs, TabConfig } from "@/components/ui/reusable-tabs";

interface ProductTabsProps {
  product: ProductData;
  productId: string;
  activeTab: string;
}

export function ProductTab({
  product,
  productId,
  activeTab,
}: ProductTabsProps) {
  const tabs: TabConfig[] = [
    {
      value: "overview",
      label: "Overview",
      content: <ProductForm mode="edit" product={product} productId={productId} />,
    },
    {
      value: "locations",
      label: "Locations",
      content: <ProductLocations productId={productId} />,
    },
    {
      value: "purchase",
      label: "Purchase",
      content: <ProductPurchase productId={productId} product={product} />,
    },
  ];

  return (
    <ReusableTabs 
      tabs={tabs} 
      activeTab={activeTab}
      tabsListClassName="grid w-full grid-cols-3 lg:w-[400px]"
    />
  );
}