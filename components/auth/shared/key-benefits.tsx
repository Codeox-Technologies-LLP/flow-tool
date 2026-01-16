import type { Benefit, KeyBenefitsProps } from "@/types/auth";

const defaultBenefits: Benefit[] = [
  { label: "Real-time sync" },
  { label: "Cloud-based" },
  { label: "Mobile ready" },
];

export default function KeyBenefits({
  benefits = defaultBenefits,
}: KeyBenefitsProps) {
  return (
    <div className="flex flex-wrap gap-3 mt-8">
      {benefits.map((benefit) => (
        <span
          key={benefit.label}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {benefit.label}
        </span>
      ))}
    </div>
  );
}
