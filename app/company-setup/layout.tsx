import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Setup - Flowtool",
  description: "Set up your company profile",
};

export default function CompanySetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50">
      {children}
    </div>
  );
}
