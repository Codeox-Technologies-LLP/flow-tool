"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import { vendorApi } from "@/api/vendor/vendor";
import { paymentMadeApi } from "@/api/paymentMade/paymentMade";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMadeFormData, paymentMadeSchema } from "@/lib/validations/paymentMade";

interface PaymentMadeFormProps {
  mode: "create" | "edit";
  billId?: string,
  paymentMade?: {
    vendorId: string;
    createdAt: string;
    paymentMadeMethod: string;
    amount: number;
    refNo: string;
  };
  paymentMadeId?: string;
}

export function PaymentMadeForm({ mode, billId, paymentMade, paymentMadeId }: PaymentMadeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<Array<{ _id: string; name: string }>>([]);
  const [loadingVendors, setLoadingVendors] = useState(true);


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PaymentMadeFormData>({
    resolver: zodResolver(paymentMadeSchema),
    defaultValues: mode === "edit" && paymentMade
      ? {
        vendorId: paymentMade.vendorId || "",
        createdAt: paymentMade.createdAt || "",
        paymentMadeMethod: paymentMade.paymentMadeMethod || "",
        amount: paymentMade.amount || 0,
        refNo: paymentMade.refNo || "",
      }
      : {
        vendorId: "",
        createdAt: "",
        paymentMadeMethod: "",
        amount: 0,
        refNo: "",
      },
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoadingVendors(true);
        const res = await vendorApi.dropdown();
        if (res) {
          setVendors(
            res.map((vendor: any) => ({
              _id: vendor._id,
              name: vendor.name,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
        toast.error("Failed to load vendors");
      } finally {
        setLoadingVendors(false);
      }
    };
    fetchVendors();
  }, []);

  const onSubmit = async (data: PaymentMadeFormData) => {
    try {
      setLoading(true);

      const cleanedData: Record<string, unknown> = {
        vendorId: data.vendorId,
        createdAt: data.createdAt,
        paymentMadeMethod: data.paymentMadeMethod,
        amount: data.amount,
        refNo: data.refNo,
        ...(billId && { billId }),
      };

      if (mode === "create") {
        const response = await paymentMadeApi.create(cleanedData);

        if (response.status) {
          toast.success("Payment created successfully!", {
            description: `Payment ID: ${response.paymentMadeId}`,
          });

          if (response.paymentMadeId) {
            router.push(`/flow-tool/purchase/paymentMade/${response.paymentMadeId}`);
          } else {
            router.push("/flow-tool/purchase/paymentMade");
          }
        } else {
          toast.error("Failed to create payment", {
            description: response.message,
          });
        }
      } else if (mode === "edit" && paymentMadeId) {
        const response = await paymentMadeApi.edit(paymentMadeId, cleanedData);

        if (response.status) {
          toast.success("Payment updated successfully");
          router.refresh();
        } else {
          toast.error(response.message || "Failed to update payment");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(
        mode === "create"
          ? "Failed to create payment"
          : "Failed to update payment",
        {
          description: errorMessage,
        }
      );
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} payment:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/flow-tool/purchase/paymentMade");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Enter payment details"
              : "Update payment details"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Vendor */}
            <FormField
              id="vendorId"
              label="Vendor"
              type="dropdown"
              placeholder="Select vendor"
              searchPlaceholder="Search vendors..."
              emptyText="No vendors found"
              required
              options={vendors}
              value={watch("vendorId")}
              onValueChange={(value) => setValue("vendorId", value, { shouldValidate: true })}
              loading={loadingVendors}
              error={errors.vendorId}
            />

            {/* Payment Date */}
            <FormField
              id="createdAt"
              label="Payment Date"
              type="date"
              required
              register={register("createdAt")}
              error={errors.createdAt}
            />

            {/* Payment Method */}
            <FormField
              id="paymentMadeMethod"
              label="Payment Method"
              type="dropdown"
              placeholder="Select Payment Method"
              options={[
                { _id: "bank", name: "Bank" },
                { _id: "cash", name: "Cash" },
                { _id: "card", name: "Card" },
              ]}
              value={watch("paymentMadeMethod")}
              onValueChange={(value) =>
                setValue("paymentMadeMethod", value, { shouldValidate: true })
              }
              required
              error={errors.paymentMadeMethod}
            />

            {/* Amount */}
            <FormField
              id="amount"
              label="Amount"
              type="number"
              placeholder="Enter amount"
              required
              register={register("amount", { valueAsNumber: true })}
              error={errors.amount}
            />

            {/* Reference No */}
            <FormField
              id="refNo"
              label="Reference No"
              type="text"
              placeholder="Enter reference number"
              required
              register={register("refNo")}
              error={errors.refNo}
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
                  {mode === "create" ? "Create Payment" : "Update Payment"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}