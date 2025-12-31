import React from "react";

interface FlowtoolLogoProps {
  variant?: "default" | "light" | "dark";
  className?: string;
  width?: number;
  height?: number;
}

export const FlowtoolLogo: React.FC<FlowtoolLogoProps> = ({
  variant = "default",
  className = "",
  width = 200,
  height = 60,
}) => {
  const colors = {
    default: { primary: "#1e293b", icon: "#0ea5e9", iconLight: "#38bdf8" },
    light: { primary: "#ffffff", icon: "#38bdf8", iconLight: "#7dd3fc" },
    dark: { primary: "#0f172a", icon: "#0ea5e9", iconLight: "#38bdf8" },
  };

  const { primary, icon, iconLight } = colors[variant];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Icon - Smooth geometric hexagon with flow symbol */}
      <g transform="translate(8, 10)">
        {/* Outer hexagon with gradient */}
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: icon, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: iconLight, stopOpacity: 1 }} />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15"/>
          </filter>
        </defs>
        
        {/* Main hexagon */}
        <path
          d="M20 3 L34 11 L34 27 L20 35 L6 27 L6 11 Z"
          fill="url(#hexGradient)"
          filter="url(#shadow)"
        />
        
        {/* Inner glow effect */}
        <path
          d="M20 8 L28 13 L28 25 L20 30 L12 25 L12 13 Z"
          fill="white"
          opacity="0.2"
        />
        
        {/* Flow chevrons - smooth and centered */}
        <g transform="translate(20, 19)">
          <path
            d="M-4 -3 L0 -6 L4 -3"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M-4 2 L0 -1 L4 2"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </g>

      {/* Flowtool text - refined positioning */}
      <text
        x="54"
        y="38"
        fontFamily="Manrope, -apple-system, system-ui, sans-serif"
        fontSize="26"
        fontWeight="700"
        fill={primary}
        letterSpacing="-0.02em"
        style={{ userSelect: 'none' }}
      >
        Flowtool
      </text>
    </svg>
  );
};

export default FlowtoolLogo;
