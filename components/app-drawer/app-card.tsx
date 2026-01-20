import Link from "next/link";
import type { AppCardProps } from "@/types/app";

const AppCard = ({ module, route, IconComponent }: AppCardProps) => {
  return (
    <Link
      href={`/flow-tool${route}`}
      className="group flex flex-col items-center justify-center gap-4 p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Icon */}
      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:scale-110 transition-all duration-300">
        <IconComponent className="w-8 h-8" strokeWidth={2.5} />
      </div>
      
      {/* App Name */}
      <span className="text-sm font-semibold text-slate-700 text-center leading-tight group-hover:text-blue-600 transition-colors duration-300">
        {module.displayName}
      </span>
    </Link>
  );
};

export default AppCard;
