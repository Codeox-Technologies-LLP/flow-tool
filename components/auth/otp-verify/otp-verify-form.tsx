"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { get, fill, some } from "lodash";

import { otpSchema, type OtpFormData } from "@/lib/validations/otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";
import { cookieStorage } from "@/lib/utils/cookies";

const OtpVerifyForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer for resend OTP
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);

    // Update form value
    const otpString = newOtp.join("");
    setValue("otp", otpString, { shouldValidate: otpString.length === 6 });

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Update form value
    setValue("otp", pastedData, { shouldValidate: pastedData.length === 6 });

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const onSubmit = async (data: OtpFormData) => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      router.push("/auth/register");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.verifyOtp({
        email,
        otp: data.otp,
      });

      const status = get(response, "status", false);
      const message = get(response, "message", "OTP verification failed");
      const token = get(response, "token", "");
      const userId = get(response, "userId", "");
      const orgId = get(response, "orgId", "");

      if (status) {
        // Store token and user info in cookies
        cookieStorage.setAuthToken(token);
        cookieStorage.setUserInfo({ userId, orgId });

        // Clear temporary registration data
        cookieStorage.removeTempRegisterData();

        toast.success("Verification successful!", {
          description: message,
        });

        // Redirect to company setup
        router.push("/company-setup");
      } else {
        throw new Error(message);
      }
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : get(error, "response.data.message") ||
            get(error, "message", "Invalid OTP");

      toast.error("Verification failed", {
        description: errorMessage,
      });
      setOtp(fill(Array(6), ""));
      setValue("otp", "");
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    if (!email) {
      toast.error("Email not found. Please register again.");
      router.push("/auth/register");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.resendOtp(email);

      const status = get(response, "status", false);
      const message = get(response, "message", "Failed to resend OTP");

      if (status) {
        toast.success("New OTP sent!", {
          description: message,
        });
        setResendTimer(60);
        setOtp(fill(Array(6), ""));
        setValue("otp", "");
        inputRefs.current[0]?.focus();
      } else {
        throw new Error(message);
      }
    } catch (error: unknown) {
      console.error("Resend OTP error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : get(error, "response.data.message") ||
            get(error, "message", "Failed to resend OTP");

      toast.error("Resend failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="mb-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
          <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Verify your email
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-gray-900">
            {email || "your email"}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* OTP Input */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium text-sm">
            Verification code
          </Label>
          <div className="flex gap-2 justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-11 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-xs text-red-600 mt-1">{errors.otp.message}</p>
          )}
        </div>

        {/* Resend OTP */}
        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-500">
              Resend code in{" "}
              <span className="font-semibold text-blue-600">
                {resendTimer}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
            >
              {`Didn't receive code? Resend`}
            </button>
          )}
        </div>
        <Button
          type="submit"
          disabled={loading || some(otp, (digit) => !digit)}
          className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 mt-6"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Verify & Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Security Notice */}
        <p className="text-xs sm:text-sm text-gray-500 text-center mt-4">
          Your code is valid for 10 minutes
        </p>
      </form>
    </div>
  );
};

export default OtpVerifyForm;
