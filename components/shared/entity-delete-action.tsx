"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { getDeleteApi } from "./common-delete-api";

interface EntityDeleteActionProps {
  id: string;
  entityName: string;
  entity: "deal" | "lead" | "quotation" | "purchase" | "receipt" | "bill";
  redirectTo: string;
  visible?: boolean;
}

export function EntityDeleteAction({
  id,
  entityName,
  entity,
  redirectTo,
  visible = true,
}: EntityDeleteActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      const api = await getDeleteApi(entity);
      const res = await api(id);

      if (res.status) {
        toast.success(`${entityName} deleted successfully`);
        router.push(redirectTo);
        router.refresh();
      } else {
        toast.error(res.message || `Failed to delete ${entityName}`);
      }
    } catch {
      toast.error(`Failed to delete ${entityName}`);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash className="h-4 w-4" />
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDelete}
        loading={loading}
        title={`Delete ${entityName}?`}
        description={`This action cannot be undone. This will permanently delete the ${entityName} and remove all associated data from our servers.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}