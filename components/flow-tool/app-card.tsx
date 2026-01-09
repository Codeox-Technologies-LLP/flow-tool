import Link from "next/link";
import type { AppCardProps } from "@/types/app";

const AppCard = ({ module, route, IconComponent }: AppCardProps) => {
  return (
    <Link
      key={module.displayName}
      href={`/app${route}`}
      className="group flex flex-col items-center gap-2 bg-primary rounded-lg border border-primary p-4 hover-border-brand transition-all duration-150"
    >
      {/* Icon */}
      <div className="w-10 h-10 bg-tertiary rounded-md flex items-center justify-center group-hover:bg-brand-light transition-colors duration-150">
        <IconComponent className="w-5 h-5 text-secondary group-hover:text-brand transition-colors duration-150" />
      </div>

      {/* Module Name */}
      <span className="text-xs font-medium text-primary text-center group-hover:text-brand transition-colors duration-150">
        {module.displayName}
      </span>
    </Link>
  );
};

export default AppCard;
