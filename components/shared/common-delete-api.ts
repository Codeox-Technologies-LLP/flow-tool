import { purchaseApi } from "@/api/purchase/purchase";
import { vendorApi } from "@/api/vendor/vendor";
import { productApi } from "@/api/product/product";
import { receiptApi } from "@/api/receipt/receipt";
import { billApi } from "@/api/bill/bill";

export function getDeleteApi(entity: string) {
  switch (entity) {
    case "purchase":
      return purchaseApi.delete;
    case "receipt":
      return receiptApi.delete;
    case "bill":
      return billApi.delete;
    case "vendor":
      return vendorApi.delete;
    case "product":
      return productApi.delete;
    default:
      throw new Error("Unknown delete entity");
  }
}
