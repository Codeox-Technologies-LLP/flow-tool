"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { productApi, ProductPurchaseResponse } from "@/api/product/product";

interface ProductPurchaseProps {
    productId: string;
    product: any;
}

export function ProductPurchase({ productId, product }: ProductPurchaseProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [purchaseData, setPurchaseData] = useState<ProductPurchaseResponse["result"] | null>(null);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await productApi.productPurchase(productId);

                if (data.status && data.result) {
                    setPurchaseData(data.result);
                } else {
                    setError("Failed to fetch purchase data");
                }
            } catch (error) {
                console.error("Error fetching purchases:", error);
                setError("An error occurred while fetching purchase data");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [productId]);

    return (
        <DataTable
            title="Purchase History"
            description="View all purchase orders for this product"
            tableHeaders={purchaseData?.tableHeader || []}
            components={purchaseData?.components || []}
            data={purchaseData?.data || []}
            loading={loading}
            error={error}
            searchable={false}
            pageable={false}
        />
    );
}