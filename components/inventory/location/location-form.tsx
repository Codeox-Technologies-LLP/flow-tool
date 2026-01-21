"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

import { locationSchema, type LocationFormData } from "@/lib/validations/location";
import { locationApi } from "@/api/location/location";
import { warehouseApi } from "@/api/warehouse/warehouse";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";

interface LocationFormProps {
  mode: "create" | "edit";
  location?: {
    warehouseId: string;
    parentId?: string | null;
    name: string;
    type?: string;
  };
  locationId?: string;
}

const LOCATION_TYPES = [
  { _id: "internal-location", name: "Internal Location" },
  { _id: "vendor-location", name: "Vendor Location" },
  { _id: "customer-location", name: "Customer Location" },
  { _id: "inventory-loss", name: "Inventory Loss" },
  { _id: "production", name: "Production" },
  { _id: "transit-location", name: "Transit Location" },
  { _id: "view", name: "View" },
];

export function LocationForm({ mode, location, locationId }: LocationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Array<{ _id: string; name: string }>>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [locations, setLocations] = useState<Array<{ _id: string; name: string }>>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: mode === "edit" && location
      ? {
          warehouseId: location.warehouseId || "",
          parentId: location.parentId || null,
          name: location.name || "",
          type: location.type || "",
        }
      : {
          warehouseId: "",
          parentId: null,
          name: "",
          type: "",
        },
  });

  const selectedWarehouse = watch("warehouseId");
  const selectedType = watch("type");
  const selectedParent = watch("parentId");

  // Fetch warehouses for dropdown
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setLoadingWarehouses(true);
        const response = await warehouseApi.list({ page: 1, limit: 100 });
        if (response?.result?.data) {
          setWarehouses(
            response.result.data.map((wh) => ({
              _id: wh.id as string, // Use the MongoDB ObjectId
              name: wh.name,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
        toast.error("Failed to load warehouses");
      } finally {
        setLoadingWarehouses(false);
      }
    };

    fetchWarehouses();
  }, []);

  // Fetch locations when warehouse is selected
  useEffect(() => {
    if (!selectedWarehouse) {
      setLocations([]);
      return;
    }

    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const response = await locationApi.list({ 
          page: 1, 
          limit: 100,
          warehouseId: selectedWarehouse,
        });
        if (response?.result?.data) {
          // Filter out the current location when in edit mode
          const availableLocations = response.result.data
            .filter((loc) => mode === "create" || loc.locationId !== locationId)
            .map((loc) => ({
              _id: loc.locationId as string,
              name: loc.name,
            }));
          setLocations(availableLocations);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        toast.error("Failed to load locations");
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [selectedWarehouse, mode, locationId]);

  const onSubmit = async (data: LocationFormData) => {
    try {
      setLoading(true);

      // Clean the data - remove empty strings
      const cleanedData: Record<string, unknown> = {
        warehouseId: data.warehouseId,
        name: data.name.trim(),
      };

      if (data.parentId) cleanedData.parentId = data.parentId;
      if (data.type?.trim()) cleanedData.type = data.type;

      if (mode === "create") {
        const response = await locationApi.create(cleanedData);
        
        if (response.status) {
          toast.success("Location created successfully!", {
            description: `Location ID: ${response.locationId}`,
          });
          
          // Redirect to the newly created location detail page
          if (response.locationId) {
            router.push(`/flow-tool/inventory/locations/${response.locationId}`);
          } else {
            router.push("/flow-tool/inventory/locations");
          }
        } else {
          toast.error("Failed to create location", {
            description: response.message,
          });
        }
      } else if (mode === "edit" && locationId) {
        const response = await locationApi.edit(locationId, cleanedData);
        
        if (response.status) {
          toast.success("Location updated successfully");
          router.refresh();
        } else {
          toast.error(response.message || "Failed to update location");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(
        mode === "create"
          ? "Failed to create location"
          : "Failed to update location",
        {
          description: errorMessage,
        }
      );
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} location:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/flow-tool/inventory/locations");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Enter location details and assign to a warehouse"
              : "Update the location details below"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Warehouse Dropdown */}
            <FormField
              id="warehouseId"
              label="Warehouse"
              type="dropdown"
              placeholder="Select warehouse"
              searchPlaceholder="Search warehouses..."
              emptyText="No warehouses found"
              required
              options={warehouses}
              value={selectedWarehouse}
              onValueChange={(value) => setValue("warehouseId", value, { shouldValidate: true })}
              loading={loadingWarehouses}
              disabled={mode === "edit"}
              error={errors.warehouseId}
            />

            {/* Parent Location Dropdown */}
            <FormField
              id="parentId"
              label="Parent Location"
              type="dropdown"
              placeholder="Select parent location (optional)"
              searchPlaceholder="Search locations..."
              emptyText="No locations found"
              options={[
                { _id: "none", name: "None (Root Level)" },
                ...locations,
              ]}
              value={selectedParent ?? "none"}
              onValueChange={(value) => {
                setValue("parentId", value === "none" ? null : value, {
                  shouldValidate: true,
                });
              }}
              loading={loadingLocations}
              disabled={!selectedWarehouse || loadingLocations}
              error={errors.parentId}
            />

            {/* Location Name */}
            <FormField
              id="name"
              label="Location Name"
              type="text"
              placeholder="Enter location name"
              required
              register={register("name")}
              error={errors.name}
            />

            {/* Location Type Dropdown */}
            <FormField
              id="type"
              label="Location Type"
              type="dropdown"
              placeholder="Select location type (optional)"
              searchPlaceholder="Search location types..."
              emptyText="No location types found"
              options={LOCATION_TYPES}
              value={selectedType}
              onValueChange={(value) => setValue("type", value, { shouldValidate: true })}
              error={errors.type}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} variant="outline">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "Create Location" : "Update Location"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
