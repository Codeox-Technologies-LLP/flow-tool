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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  { value: "internal-location", label: "Internal Location" },
  { value: "vendor-location", label: "Vendor Location" },
  { value: "customer-location", label: "Customer Location" },
  { value: "inventory-loss", label: "Inventory Loss" },
  { value: "production", label: "Production" },
  { value: "transit-location", label: "Transit Location" },
  { value: "view", label: "View" },
];

export function LocationForm({ mode, location, locationId }: LocationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [locations, setLocations] = useState<Array<{ id: string; name: string }>>([]);
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
              id: wh.id as string, // Use the MongoDB ObjectId
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
              id: loc.locationId as string,
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

  const formFields = [
    {
      label: "Warehouse",
      id: "warehouseId" as const,
      placeholder: "Select warehouse",
      type: "select" as const,
    },
    {
      label: "Parent Location",
      id: "parentId" as const,
      placeholder: "Select parent location (optional)",
      type: "select" as const,
    },
    {
      label: "Location Name",
      id: "name" as const,
      placeholder: "Enter location name",
      type: "text" as const,
    },
    {
      label: "Location Type",
      id: "type" as const,
      placeholder: "Select location type (optional)",
      type: "select" as const,
    },
  ];

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
        {formFields.map((field) => {
          if (field.type === "select") {
            if (field.id === "warehouseId") {
              return (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Select
                    value={selectedWarehouse}
                    onValueChange={(value) => setValue("warehouseId", value)}
                    disabled={loadingWarehouses || mode === "edit"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((wh) => (
                        <SelectItem key={wh.id} value={wh.id}>
                          {wh.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.warehouseId && (
                    <p className="text-sm text-red-600">{errors.warehouseId.message}</p>
                  )}
                </div>
              );
            } else if (field.id === "type") {
              return (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(value) => setValue("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>
              );
            } else if (field.id === "parentId") {
              return (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Select
                    value={selectedParent ?? "none"}
                    onValueChange={(value) => {
                      setValue("parentId", value === "none" ? null : value, {
                        shouldValidate: true,
                      });
                    }}
                    disabled={!selectedWarehouse || loadingLocations}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="none" value="none">None (Root Level)</SelectItem>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.parentId && (
                    <p className="text-sm text-red-600">{errors.parentId.message}</p>
                  )}
                </div>
              );
            }
          }

          return (
            <FormField
              key={field.id}
              label={field.label}
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              register={register(field.id)}
              error={errors[field.id]}
            />
          );
        })}
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
