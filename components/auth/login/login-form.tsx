"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { get, has } from "lodash";

import { loginSchema, type LoginFormData } from "@/lib/validations/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/ui/password-input";
import FormDivider from "@/components/auth/shared/form-devider";
import { authApi } from "@/lib/api/auth";
import { cookieStorage } from "@/lib/utils/cookies";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      // Step 1: Call backend login API
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      const status = get(response, "status", false);
      const message = get(response, "message", "Invalid credentials");
      const token = get(response, "token", "");

      if (!status) {
        toast.error("Login failed", {
          description: message,
        });
        setLoading(false);
        return;
      }

      // Step 2: Store token and user info in cookies
      cookieStorage.setAuthToken(token);
      
      if (has(response, "user")) {
        const userId = get(response, "user.userId", "");
        const orgId = get(response, "user.orgId", "");
        const fullName = get(response, "user.fullName", "User");

        cookieStorage.setUserInfo({ userId, orgId });

        toast.success("Login successful!", {
          description: `Welcome back, ${fullName}!`,
        });
        router.push("/flow-tool");
        router.refresh();
      } else {
        // LoginRedirectResponse - handle redirect if needed
        const redirectUrl = get(response, "redirectUrl");
        
        toast.info(message);
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : get(error, "response.data.message", "An error occurred. Please try again.");
      
      toast.error("Login failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Please contact your administrator");
  };

  const handleSignUp = () => {
    router.push("/auth/register");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-10">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-600 text-base">
          Sign in to your account to continue
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            className="h-11 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-gray-700 font-medium text-sm"
            >
              Password
            </Label>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-11 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 mt-6"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <FormDivider text="New to Flowtool?" />

      {/* Register Link */}
      <button
        type="button"
        onClick={handleSignUp}
        className="w-full h-11 border border-gray-300 hover:border-gray-400 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
      >
        Create an account
      </button>
    </div>
  );
}
