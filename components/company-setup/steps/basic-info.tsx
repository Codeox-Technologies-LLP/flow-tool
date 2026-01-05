"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompanyFormData } from "@/lib/validations/company-setup";

const industries = [
  "Manufacturing",
  "Retail & E-commerce",
  "Wholesale & Distribution",
  "Healthcare",
  "Technology & Software",
  "Construction",
  "Automotive",
  "Food & Beverage",
  "Pharmaceuticals",
  "Textile & Apparel",
  "Electronics",
  "Agriculture",
  "Logistics & Transportation",
  "Real Estate",
  "Professional Services",
  "Other",
];

const BasicInfo = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CompanyFormData>();

  const generateShortCode = (companyName: string): string => {
    if (!companyName) return "";

    const cleaned = companyName.trim().replace(/[^a-zA-Z0-9\s]/g, "");
    const words = cleaned.split(/\s+/).filter((word) => word.length > 0);

    if (words.length === 0) return "";

    if (words.length === 1) {
      return words[0].substring(0, 4).toUpperCase();
    }

    return words
      .slice(0, 4)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Company Name - Featured */}
      <div className="space-y-3">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <>
              <Input
                {...field}
                id="name"
                autoFocus
                onChange={(e) => {
                  field.onChange(e);
                  const autoShortCode = generateShortCode(e.target.value);
                  setValue("shortCode", autoShortCode);
                }}
                placeholder="e.g., Acme Corporation"
                className="h-14 text-lg px-4 border-2 focus:border-blue-500 transition-colors"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                  <span className="text-red-500">⚠</span>
                  {errors.name.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Expandable Additional Details */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors list-none flex items-center gap-2">
          <span className="transform group-open:rotate-90 transition-transform">▶</span>
          Add more details (optional)
        </summary>
        
        <div className="mt-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Legal Name */}
            <div className="space-y-2">
              <Label htmlFor="legalName" className="text-sm text-gray-600">
                Legal name
              </Label>
              <Controller
                name="legalName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="legalName"
                    placeholder="Official registered name"
                    className="h-11"
                  />
                )}
              />
            </div>

            {/* Short Code */}
            <div className="space-y-2">
              <Label htmlFor="shortCode" className="text-sm text-gray-600">
                Short code
              </Label>
              <Controller
                name="shortCode"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="shortCode"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    placeholder="Auto-generated"
                    className="h-11 font-mono"
                    maxLength={10}
                  />
                )}
              />
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm text-gray-600">
              Industry
            </Label>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="What industry are you in?" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-600">
                Email
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="contact@company.com"
                      className="h-11"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm text-gray-600">
                Phone
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="h-11"
                  />
                )}
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm text-gray-600">
              Website
            </Label>
            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    id="website"
                    type="url"
                    placeholder="https://www.company.com"
                    className="h-11"
                  />
                  {errors.website && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.website.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </details>
    </div>
  );
};

export default BasicInfo;
