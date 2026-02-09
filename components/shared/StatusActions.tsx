"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Action } from "@/types/deal";
import { updateStatus } from "./status-actions";
import { extraActionRegistry } from "./extra-action-registry";

export function StatusActions({
  entityId,
  entity,
  actions,
  type = "status",
}: {
  entityId: string;
  entity: "deal" | "lead" | "quotation" | "purchase" | "receipt" | "delivery" | "bill";
  actions: Action[];
  type?: "status" | "stage";
}) {
  const router = useRouter();

  const activeAction = actions.find((a) => a.active);

  const extraButtons =
    activeAction?.extraButtons ??
    (activeAction?.extraButton ? [activeAction.extraButton] : []);

  const handleClick = async (action: Action) => {
    try {
      if (action.route) {
        router.push(action.route);
        return;
      }

      if (entity === "deal") {
        await updateStatus(entity, entityId, { order: action.order });
      } else {
        await updateStatus(entity, entityId, { status: action.key });
      }

      toast.success(`${type} updated`);
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error(`Failed to update ${type}`);
    }
  };

  const handleExtraButtonClick = async (btn: any) => {
    try {
      if (btn.key && extraActionRegistry[btn.key]) {
        await extraActionRegistry[btn.key]({ entityId });
        toast.success(`Action completed successfully`);
        router.refresh();
        return;
      }
      
      if (btn.route) {
        router.push(btn.route);
        return;
      }

      toast.warning(`No action defined for ${btn.label}`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to execute action`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {extraButtons.length === 0 && (
        <div className="flex gap-2">
          {actions.map((action) => (
            <button
              key={action.key}
              onClick={() => handleClick(action)}
              className={`
                px-4 py-2 text-sm rounded-lg cursor-pointer 
                ${
                  action.active
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {extraButtons.length > 0 && (
        <div className="flex gap-2">
          {extraButtons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => handleExtraButtonClick(btn)}
              className="border border-gray-500 text-black px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}