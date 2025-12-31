import { ReactNode } from "react"
import { Building2, Shield } from "lucide-react"
import FlowtoolLogo from "@/components/shared/FlowtoolLogo"
import FeatureCard from "@/components/auth/shared/feature-card"
import KeyBenefits from "@/components/auth/shared/key-benefits"

interface AuthBrandingSideProps {
  title: ReactNode
  description: string
  benefits?: Array<{ label: string }>
}

export default function AuthBrandingSide({
  title,
  description,
  benefits,
}: AuthBrandingSideProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between min-h-screen">
      <div className="max-w-2xl mx-auto w-full flex flex-col justify-between h-full py-12">
        {/* Logo Section */}
        <div>
          <FlowtoolLogo variant="default" width={180} height={50} />
          <div className="mt-16">
            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-gray-600 text-lg xl:text-xl leading-relaxed mb-8">
              {description}
            </p>

            {/* Key Benefits */}
            <KeyBenefits benefits={benefits} />
          </div>
        </div>

        {/* Features - Modern Cards */}
        <div className="space-y-3 my-12">
          <FeatureCard
            icon={<Building2 className="w-6 h-6" />}
            title="Unified workspace"
            description="Centralize all your business operations in one place"
            color="bg-blue-500"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Enterprise security"
            description="Bank-level encryption and compliance standards"
            color="bg-cyan-500"
          />
        </div>

        {/* Footer */}
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Flowtool. All rights reserved.
        </div>
      </div>
    </div>
  )
}