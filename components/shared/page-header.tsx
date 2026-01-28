import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  backUrl?: string;
  actions?: ReactNode;
  showBackButton?: boolean;
}

export function PageHeader({
  title,
  description,
  backUrl,
  actions,
  showBackButton = true,
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 rounded-xl">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {showBackButton && backUrl && (
              <Link href={backUrl}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-gray-600 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
