import { purchaseApi } from "@/api/purchase/purchase";
import { vendorApi } from "@/api/vendor/vendor";
import { productApi } from "@/api/product/product";

export function getDeleteApi(entity: string) {
  switch (entity) {
    case "purchase":
      return purchaseApi.delete;
    case "vendor":
      return vendorApi.delete;
    case "product":
      return productApi.delete;
    default:
      throw new Error("Unknown delete entity");
  }
}
