"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { leadApi } from "@/api/lead/lead";
import { toast } from "sonner";

interface Action {
  key: string;
  label: string;
  active?: boolean;
  type?: "redirect";
  route?: string;
}

interface LeadStatusActionsProps {
  actions: Action[];
  leadId: string;
}

export function   LeadStatusActions({ actions, leadId }: LeadStatusActionsProps) {
  const router = useRouter();

  const handleClick = async (action: Action) => {

    try {
      await leadApi.edit(leadId, {
        status: action.key,
      });


      toast.success("Status updated", {
        description: `Lead status changed to "${action.label}"`,
      });

      router.refresh();

      if (action.route) {
      router.push(`${action.route}?leadId=${leadId}`);
    }
    } catch (error) {
      console.error("Failed to update lead status", error);
    }
  };

  return (
  <div className="flex gap-2">
    {actions.map((action) => (
      <button
        key={action.key}
        onClick={() => handleClick(action)}
        className={`
          px-4 py-2 text-sm rounded-lg cursor-pointer 
          ${action.active 
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}
        `}
      >
        {action.label}
      </button>
    ))}
  </div>
);
}
