"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/ui/password-input";
import FormDivider from "@/components/auth/shared/form-devider";
import { authApi } from "@/lib/api/auth";
import { cookieStorage } from "@/lib/utils/cookies";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    debugger;
    try {
      const response = await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName || undefined,
        email: data.email,
        password: data.password,
      });

      if (response.status) {
        // Store registration data in cookie for OTP resend
        cookieStorage.setTempRegisterData({
          firstName: data.firstName,
          lastName: data.lastName || undefined,
          email: data.email,
          password: data.password,
        });

        toast.success("Registration successful!", {
          description: response.message,
        });

        router.push(`/auth/otp-verify?email=${encodeURIComponent(data.email)}`);
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      toast.error("Registration failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push("/auth/login");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Create your account
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Get started with Flowtool today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Fields Row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="firstName"
              className="text-gray-700 font-medium text-sm"
            >
              First name
            </Label>
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="John"
              className="h-10 sm:h-11 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="lastName"
              className="text-gray-700 font-medium text-sm"
            >
              Last name
            </Label>
            <Input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Doe"
              className="h-10 sm:h-11 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            className="h-10 sm:h-11 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-gray-700 font-medium text-sm"
          >
            Password
          </Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            className="h-10 sm:h-11 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 mt-5"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-3">
          By creating an account, you agree to our{" "}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Privacy Policy
          </button>
        </p>
      </form>

      {/* Divider */}
      <FormDivider text="Already have an account?" />

      {/* Login Link */}
      <button
        onClick={handleSignIn}
        className="w-full h-10 sm:h-11 border border-gray-300 hover:border-gray-400 rounded-md font-semibold text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-all duration-200"
      >
        Sign in instead
      </button>
    </div>
  );
};

export default RegisterForm;
