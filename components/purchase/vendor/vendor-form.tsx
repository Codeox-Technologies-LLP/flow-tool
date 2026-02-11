"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { z } from "zod";

import { vendorApi } from "@/api/vendor/vendor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";

const vendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
});

type VendorFormData = z.infer<typeof vendorSchema>;

interface VendorFormProps {
  mode: "create" | "edit";
  vendor?: VendorFormData & { _id?: string };
  vendorId?: string;
}

export function VendorForm({ mode, vendor, vendorId }: VendorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: mode === "edit" && vendor ? vendor : {
      name: "",
      companyName: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
      zip: "",
    },
  });

  const onSubmit = async (data: VendorFormData) => {
    try {
      setLoading(true);

      // Clean the data - remove empty strings
      const cleanedData: Record<string, string> = { 
        name: data.name.trim() 
      };
      
      if (data.companyName?.trim()) cleanedData.companyName = data.companyName.trim();
      if (data.email?.trim()) cleanedData.email = data.email.trim();
      if (data.phone?.trim()) cleanedData.phone = data.phone.trim();
      if (data.address?.trim()) cleanedData.address = data.address.trim();
      if (data.country?.trim()) cleanedData.country = data.country.trim();
      if (data.state?.trim()) cleanedData.state = data.state.trim();
      if (data.city?.trim()) cleanedData.city = data.city.trim();
      if (data.zip?.trim()) cleanedData.zip = data.zip.trim();

      if (mode === "create") {
        const response = await vendorApi.create(cleanedData);
        
        if (response.status) {
          toast.success("Vendor created successfully!");
          router.push("/flow-tool/purchase/vendors");
          router.refresh();
        } else {
          toast.error("Failed to create vendor", {
            description: response.message,
          });
        }
      } else if (mode === "edit" && vendorId) {
        const response = await vendorApi.edit(vendorId, cleanedData);
        
        if (response.status) {
          toast.success("Vendor updated successfully");
          router.refresh();
        } else {
          toast.error(response.message || "Failed to update vendor");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(
        mode === "create" ? "Failed to create vendor" : "Failed to update vendor",
        { description: errorMessage }
      );
      console.error(`Error ${mode === "create" ? "creating" : "updating"} vendor:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Vendor Information</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Enter vendor details to create a new vendor"
              : "Update the vendor details below"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="name"
              label="Vendor Name"
              type="text"
              placeholder="Enter vendor name"
              required
              register={register("name")}
              error={errors.name}
            />

            <FormField
              id="companyName"
              label="Company Name"
              type="text"
              placeholder="Enter company name"
              register={register("companyName")}
              error={errors.companyName}
            />

            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="Enter email address"
              register={register("email")}
              error={errors.email}
            />

            <FormField
              id="phone"
              label="Phone"
              type="text"
              placeholder="Enter phone number"
              register={register("phone")}
              error={errors.phone}
            />

            <div className="col-span-2">
              <FormField
                id="address"
                label="Address"
                type="text"
                placeholder="Enter address"
                register={register("address")}
                error={errors.address}
              />
            </div>

            <FormField
              id="country"
              label="Country"
              type="text"
              placeholder="Enter country"
              register={register("country")}
              error={errors.country}
            />

            <FormField
              id="state"
              label="State"
              type="text"
              placeholder="Enter state"
              register={register("state")}
              error={errors.state}
            />

            <FormField
              id="city"
              label="City"
              type="text"
              placeholder="Enter city"
              register={register("city")}
              error={errors.city}
            />

            <FormField
              id="zip"
              label="ZIP Code"
              type="text"
              placeholder="Enter ZIP code"
              register={register("zip")}
              error={errors.zip}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/flow-tool/purchase/vendors")}
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
                  {mode === "create" ? "Create Vendor" : "Update Vendor"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}