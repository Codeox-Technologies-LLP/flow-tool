"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

import {
  companySetupSchema,
  type CompanyFormData,
} from "@/lib/validations/company-setup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companyApi } from "@/lib/api/company";
import { cookieStorage } from "@/lib/utils/cookies";

const CompanySetupForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isValid },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySetupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      status: "active" as const,
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setLoading(true);

    try {
      // Verify user info exists in cookies (used by axios interceptor)
      const userInfo = cookieStorage.getUserInfo<{
        userId: string;
        orgId: string;
      }>();

      if (!userInfo?.userId || !userInfo?.orgId) {
        toast.error("User information not found. Please login again.");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
        return;
      }

      // Prepare payload - userId and orgId sent via headers
      const payload = {
        name: data.name.trim(),
        status: data.status,
      };

      const response = await companyApi.setup(payload);

      if (response.status) {
        toast.success("🎉 Welcome aboard!", {
          description: "Your workspace is ready to go.",
        });

        // Store additional data if returned from API
        // if (response.roleId || response.store?._id) {
        //   cookieStorage.setUserInfo({
        //     ...userInfo,
        //     ...(response.roleId && { roleId: response.roleId }),
        //     ...(response.store?._id && { companyId: response.store._id }),
        //   });
        // }

        toast.success("🎉 Welcome aboard!", {
          description: "Your workspace is ready to go.",
        });

        setTimeout(() => {
          router.push("/app");
          router.refresh();
        }, 1000);
      } else {
        throw new Error(response.message || "Company setup failed");
      }
    } catch (error: unknown) {
      console.error("Company creation error:", error);
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : error instanceof Error
          ? error.message
          : "Failed to create company";
      toast.error("Oops! Something went wrong", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Decorative Background - Same as Auth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-blue-50 via-white to-blue-50/30"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Side - Information */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium mb-4 border border-blue-100">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Configuration Required
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                Company Information
              </h1>
              <p className="text-slate-600 leading-relaxed">
                Enter your organization name to initialize your workspace. This
                will be used across all modules and reports.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200/50 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Quick Setup
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Additional settings can be configured later from the
                    administration panel
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Secure Environment
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Your data is encrypted and stored securely in compliance
                    with industry standards
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Organization Details
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Required fields are marked with an asterisk (*)
              </p>
            </div>

            <form onSubmit={hookFormSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-700 flex items-center gap-1"
                >
                  Company Name
                  <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your company or organization name"
                  autoFocus
                  {...register("name")}
                  className={`h-11 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Continue to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySetupForm;
