"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompanyFormData } from "@/lib/validations/company-setup";
import { countries } from "@/lib/data/countries";

const AddressDetails = () => {
  const {
    watch,
    setValue,
    formState: {},
  } = useFormContext<CompanyFormData>();

  const country = watch("country");
  const addressDetails = watch("addressDetails");

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = countries.find((c) => c.code === countryCode);
    if (selectedCountry) {
      setValue("country", {
        code: selectedCountry.code,
        name: selectedCountry.name,
      });
      // Update nested country in addressDetails
      setValue("addressDetails", {
        ...addressDetails,
        country: selectedCountry.name,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Country - Primary Selection */}
      <div className="space-y-2">
        <Label htmlFor="country" className="text-sm text-gray-600">
          Country
        </Label>
        <Select value={country?.code || ""} onValueChange={handleCountryChange}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Where is your company based?" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.flag} {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Additional Location Details */}
      <details className="group" open>
        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors list-none flex items-center gap-2">
          <span className="transform group-open:rotate-90 transition-transform">
            ▶
          </span>
          Add city and region (optional)
        </summary>

        <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm text-gray-600">
                City
              </Label>
              <Input
                id="city"
                autoFocus
                value={addressDetails?.city || ""}
                onChange={(e) =>
                  setValue("addressDetails", {
                    ...addressDetails,
                    city: e.target.value,
                  })
                }
                placeholder="San Francisco"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm text-gray-600">
                State / Province
              </Label>
              <Input
                id="state"
                value={addressDetails?.state || ""}
                onChange={(e) =>
                  setValue("addressDetails", {
                    ...addressDetails,
                    state: e.target.value,
                  })
                }
                placeholder="California"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-sm text-gray-600">
              Postal code
            </Label>
            <Input
              id="postalCode"
              value={addressDetails?.postalCode || ""}
              onChange={(e) =>
                setValue("addressDetails", {
                  ...addressDetails,
                  postalCode: e.target.value,
                })
              }
              placeholder="94102"
              className="h-11"
            />
          </div>
        </div>
      </details>
    </div>
  );
};

export default AddressDetails;
