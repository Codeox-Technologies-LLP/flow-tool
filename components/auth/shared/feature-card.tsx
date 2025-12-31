import React from "react";

const FeatureCard = ({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) => (
  <div className="flex gap-4 items-start bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 hover:bg-white/80 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
    <div
      className={`shrink-0 w-11 h-11 ${color} rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}
    >
      {icon}
    </div>
    <div>
      <h3 className="text-gray-900 font-semibold text-base mb-1">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export default FeatureCard;
