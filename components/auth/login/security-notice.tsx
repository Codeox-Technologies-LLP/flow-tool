import { Shield } from "lucide-react";

export default function SecurityNotice() {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
        <Shield className="w-4 h-4" />
        Protected by enterprise-grade security
      </p>
    </div>
  );
}
