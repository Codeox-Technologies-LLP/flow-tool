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
import { paymentApi } from "@/api/payments/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentFormData, paymentSchema } from "@/lib/validations/payment";
import { quotationApi } from "@/api/quotations/quotation";

interface PaymentFormProps {
  mode: "create" | "edit";
  payment?: {
    relatedTo: string;
    createdAt: string;
    paymentMethod?: string;
    amount: number;
    refNo?: string;
  };
  paymentId?: string;
}

export function PaymentForm({ mode, payment, paymentId }: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Array<{ _id: string; name: string }>>([]);
  const [loadingClients, setLoadingClients] = useState(true);


 const {
     register,
     handleSubmit,
     formState: { errors },
     setValue,
     watch,
   } = useForm<PaymentFormData>({
     resolver: zodResolver(paymentSchema),
     defaultValues: mode === "edit" && payment
       ? {
           relatedTo: payment.relatedTo || "",
           createdAt: payment.createdAt || "",
           paymentMethod: payment.paymentMethod || "",
           amount: payment.amount || 0,
           refNo: payment.refNo || "",
         }
       : {
           relatedTo: "",
           createdAt: "",
           paymentMethod: "",
           amount: 0,
           refNo: "",
         },
   });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const res = await quotationApi.dropdownClients();
        if (res) {
          setClients(
            res.map((client: any) => ({
              _id: client._id,
              name: client.name,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        toast.error("Failed to load clients");
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setLoading(true);

      const cleanedData: Record<string, unknown> = {
        relatedTo: data.relatedTo,
        createdAt: data.createdAt,
        paymentMethod: data.paymentMethod,
        amount: data.amount,
        refNo: data.refNo,
      };

      if (mode === "create") {
        const response = await paymentApi.create(cleanedData);
        
        if (response.status) {
          toast.success("Payment created successfully!", {
            description: `Payment ID: ${response.paymentId}`,
          });
          
          if (response.paymentId) {
            router.push(`/flow-tool/sales/payments/${response.paymentId}`);
          } else {
            router.push("/flow-tool/sales/payments");
          }
        } else {
          toast.error("Failed to create payment", {
            description: response.message,
          });
        }
      } else if (mode === "edit" && paymentId) {
        const response = await paymentApi.edit(paymentId, cleanedData);
        
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
    router.push("/flow-tool/sales/payments");
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
              {/* Client */}
              <FormField
                id="relatedTo"
                label="Client"
                type="dropdown"
                placeholder="Select client"
                searchPlaceholder="Search clients..."
                emptyText="No clients found"
                required
                options={clients}
                value={watch("relatedTo")}
                onValueChange={(value) => setValue("relatedTo", value, { shouldValidate: true })}
                loading={loadingClients}
                error={errors.relatedTo}
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
                id="paymentMethod"
                label="Payment Method"
                type="dropdown"
                placeholder="Select Payment Method"
                options={[
                  { _id: "bank", name: "Bank" },
                  { _id: "cash", name: "Cash" },
                  { _id: "card", name: "Card" },
                ]}
                value={watch("paymentMethod")}
                onValueChange={(value) =>
                  setValue("paymentMethod", value, { shouldValidate: true })
                }
                required
                error={errors.paymentMethod}
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