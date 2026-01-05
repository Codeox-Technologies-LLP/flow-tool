"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

import {
  companySetupSchema,
  type CompanyFormData,
} from "@/lib/validations/company-setup";
import { Button } from "@/components/ui/button";
import BasicInfo from "./steps/basic-info";
import AddressDetails from "./steps/address-details";
import BusinessSettings from "./steps/business-settings";

const steps = [
  {
    id: 1,
    question: "First, what's your company called?",
    description: "Don't worry, you can change this later",
  },
  {
    id: 2,
    question: "Where is your company located?",
    description: "This helps us set up the right defaults for you",
  },
  {
    id: 3,
    question: "Almost done! Let's set up your currency",
    description: "We'll use this for all your transactions",
  },
];

const CompanySetupForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const methods = useForm<CompanyFormData>({
    resolver: zodResolver(companySetupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      legalName: "",
      shortCode: "",
      industry: "",
      website: "",
      email: "",
      phone: "",
      description: "",
      country: {
        code: "",
        name: "",
      },
      addressDetails: {
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      currency: {
        code: "",
        symbol: "",
        name: "",
      },
      businessType: "",
      operationType: "",
      timezone: "",
      status: "active" as const,
      parentId: null,
    },
  });

  const { watch, trigger, getValues } = methods;

  // Handle Enter key to proceed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in a textarea
      if ((e.target as HTMLElement)?.tagName === "TEXTAREA") return;

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (currentStep < steps.length) {
          handleNext();
        } else {
          handleSubmit();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  const preparePayload = () => {
    const formData = getValues();
    const payload: any = {
      name: formData.name.trim(),
    };

    if (formData.legalName?.trim())
      payload.legalName = formData.legalName.trim();
    if (formData.shortCode?.trim())
      payload.shortCode = formData.shortCode.trim();
    if (formData.image) payload.image = formData.image;
    if (formData.phone?.trim()) payload.phone = formData.phone.trim();
    if (formData.email?.trim())
      payload.email = formData.email.trim().toLowerCase();
    if (formData.website?.trim()) payload.website = formData.website.trim();
    if (formData.currency) payload.currency = formData.currency;
    if (formData.timezone?.trim()) payload.timezone = formData.timezone.trim();
    if (formData.country) payload.country = formData.country;
    if (formData.industry?.trim()) payload.industry = formData.industry.trim();
    if (formData.businessType?.trim())
      payload.businessType = formData.businessType.trim();
    if (formData.operationType?.trim())
      payload.operationType = formData.operationType.trim();
    if (formData.description?.trim())
      payload.description = formData.description.trim();
    if (formData.status) payload.status = formData.status;
    if (formData.parentId !== undefined) payload.parentId = formData.parentId;

    if (formData.addressDetails) {
      const hasAddressData = Object.values(formData.addressDetails).some(
        (val) => val?.trim()
      );
      if (hasAddressData) {
        payload.addressDetails = formData.addressDetails;
      }
    }

    return payload;
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof CompanyFormData)[] = [];

    switch (currentStep) {
      case 1: {
        fieldsToValidate = ["name"];
        const email = watch("email");
        const website = watch("website");
        if (email && email.trim()) fieldsToValidate.push("email");
        if (website && website.trim()) fieldsToValidate.push("website");
        break;
      }
      case 2:
      case 3:
        break;
    }

    if (fieldsToValidate.length > 0) {
      const result = await trigger(fieldsToValidate);
      return result;
    }

    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();

    if (!isValid) {
      toast.error("Please fill in the required information");
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateCurrentStep();

    if (!isValid) {
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);

    try {
      const payload = preparePayload();

      const response = await fetch("/api/company/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Company setup failed");
      }

      await response.json();

      toast.success("🎉 All set!", {
        description: "Your workspace is ready to go.",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Company creation error:", error);
      toast.error("Oops! Something went wrong", {
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfo />;
      case 2:
        return <AddressDetails />;
      case 3:
        return <BusinessSettings />;
      default:
        return <BasicInfo />;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-3xl">
            {/* Question */}
            <div className="mb-8 sm:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Step {currentStep} of {steps.length}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {steps[currentStep - 1].question}
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                {steps[currentStep - 1].description}
              </p>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderStep()}

              {/* Navigation */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ← Back
                  </Button>
                )}

                <div className="flex-1" />

                {currentStep < steps.length ? (
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 px-8"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating workspace...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Helper Text */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Press{" "}
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                  Enter
                </kbd>{" "}
                to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default CompanySetupForm;
