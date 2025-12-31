import type { Metadata } from "next";
import DecorativeBackground from "@/components/auth/shared/decorative-background";
import AuthBrandingSide from "@/components/auth/shared/auth-branding-side";
import FlowtoolLogo from "@/components/shared/FlowtoolLogo";

export const metadata: Metadata = {
  title: "Authentication - Flowtool",
  description: "Sign in to your Flowtool account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Decorative Background */}
      <DecorativeBackground />

      {/* Container */}
      <div className="w-full max-w-1920px mx-auto flex relative z-10">
        {/* Left Side - Branding & Features (Desktop only) */}
        <AuthBrandingSide
          title={
            <>
              Streamline your
              <br />
              workflow
            </>
          }
          description="A powerful ERP solution built for modern teams. Manage everything from sales to inventory in one unified platform."
        />

        {/* Right Side - Form Container */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-8 xl:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-10">
              <FlowtoolLogo variant="default" width={160} height={45} />
            </div>

            {/* Page Content (Login/Register/OTP forms) */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
