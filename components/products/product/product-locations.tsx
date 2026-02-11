"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { productApi, ProductLocationResponse } from "@/api/product/product";

interface ProductLocationsProps {
  productId: string;
}

export function ProductLocations({ productId }: ProductLocationsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<ProductLocationResponse["result"] | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.productLocation(productId);
        
        if (data.status && data.result) {
          setLocationData(data.result);
        } else {
          setError("Failed to fetch location data");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setError("An error occurred while fetching location data");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [productId]);

  return (
    <DataTable
      title="Product Locations"
      description="View stock levels across all locations"
      tableHeaders={locationData?.tableHeader || []}
      components={locationData?.components || []}
      data={locationData?.data || []}
      loading={loading}
      error={error}
      searchable={false}
      pageable={false}
    />
  );
}