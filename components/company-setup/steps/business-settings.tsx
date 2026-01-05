"use client";

import { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompanyFormData } from "@/lib/validations/company-setup";
import {
  getCurrencyByCountryCode,
  uniqueCurrencies,
} from "@/lib/data/countries";

const BusinessSettings = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CompanyFormData>();

  const country = watch("country");
  const currency = watch("currency");

  // Auto-select currency based on selected country
  useEffect(() => {
    if (country?.code && !currency?.code) {
      const curr = getCurrencyByCountryCode(country.code);
      if (curr) {
        setValue("currency", curr);
      }
    }
  }, [country?.code, currency?.code, setValue]);

  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = uniqueCurrencies.find(
      (c) => c.code === currencyCode
    );
    if (selectedCurrency) {
      setValue("currency", selectedCurrency);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currency" className="text-sm text-gray-600">
          Default currency for transactions
        </Label>
        <Controller
          name="currency.code"
          control={control}
          render={({ field }) => (
            <>
              <Select
                value={field.value || ""}
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Which currency will you use?" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCurrencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code} - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currency && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                  <span className="text-red-500">⚠</span>
                  {errors.currency.message as string}
                </p>
              )}
            </>
          )}
        />
        {currency?.code && (
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
            <span className="text-green-600">✓</span>
            All transactions will use {currency.name} ({currency.symbol})
          </p>
        )}
      </div>
    </div>
  );
};

export default BusinessSettings;
