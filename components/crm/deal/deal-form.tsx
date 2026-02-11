"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

import { dealSchema, type DealFormData } from "@/lib/validations/deal";
import { dealApi } from "@/api/deal/deal";
import { clientApi } from "@/api/client/client";
import { contactApi } from "@/api/contact/contact";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import { useEntityDraftStore } from "@/stores/useEntityDraftStore";
import { leadApi } from "@/api/lead/lead";

interface DealFormProps {
  mode: "create" | "edit";
  deal?: {
    clientId: string;
    contactId?: string | null;
    title: string;
    value?: number;
    stage?: string;
    probability?: number;
    closeDate?: string;
    note?: string;
    leadId?: string | null;
  };
  dealId?: string;
}


export function DealForm({ mode, deal, dealId }: DealFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Array<{ _id: string; name: string }>>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [contacts, setContacts] = useState<Array<{ _id: string; name: string }>>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [leads, setLeads] = useState<Array<{ _id: string; name: string }>>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: mode === "edit" && deal
      ? {
          clientId: deal.clientId || "",
          contactId: deal.contactId || null,
          title: deal.title || "",
          value: deal.value || 0,
          stage: deal.stage || "",
          probability: deal.probability || 0,
          closeDate: deal.closeDate || "",
          note: deal.note || "",
          leadId: deal.leadId || null,
        }
      : {
          clientId: "",
          contactId: null,
          title: "",
          value: 0,
          stage: "",
          probability: 0,
          closeDate: "",
          note: "",
          leadId: undefined,
        },
  });

  const searchParams = useSearchParams();
const leadId = searchParams.get("leadId");

const setDraft = useEntityDraftStore((s) => s.setDraft);
const clearDraft = useEntityDraftStore((s) => s.clearDraft);


  const selectedClient = watch("clientId");
  const selectedContact = watch("contactId");
  const selectedLead = watch("leadId");
//   const selectedStage = watch("stage");

  // Fetch clients for dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const response = await clientApi.list({ page: 1, limit: 100 });
        if (response?.result?.data) {
          setClients(
            response.result.data.map((client) => ({
              _id: client.id as string, // Use 'id' from API response
              name: client.client, // Use 'client' field for name
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        toast.error("Failed to load clients");
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // Fetch contacts when client is selected
  useEffect(() => {
    if (!selectedClient) {
      setContacts([]);
      return;
    }

    const fetchContacts = async () => {
      try {
        setLoadingContacts(true);
        const response = await contactApi.list({ 
          page: 1, 
          limit: 100,
          // Note: API doesn't support clientId filtering, so we fetch all and filter client-side
        });
        if (response?.result?.data) {
          // Filter contacts that belong to the selected client
          const availableContacts = response.result.data
            .filter((contact) => contact.clientData?._id === selectedClient)
            .map((contact) => ({
              _id: contact.id as string,
              name: contact.name,
            }));
          setContacts(availableContacts);
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
        toast.error("Failed to load contacts");
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchContacts();
  }, [selectedClient]);

  useEffect(() => {

  const fetchLeads = async () => {
    try {
      setLoadingLeads(true);
      const response = await leadApi.dropdown();
      if (response?.length) {
        setLeads(
          response.map((lead) => ({
            _id: lead._id,
            name: lead.enquiryId,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoadingLeads(false);
    }
  };

  fetchLeads();
}, []);

  useEffect(() => {
      if (!leadId || mode !== "create") return;

      const hydrateFromLead = async () => {
        const res = await leadApi.detail(leadId);
        if (!res?.status || !res.data) return;

        setDraft("deal:create", {
          leadId,
          title: `${res.data.name} Deal`,
          value: Number(res.data.expectedValue) || 0,
        });
      };

      hydrateFromLead();
    }, [leadId, mode, setDraft]);

    const draft = useEntityDraftStore(
      (s) => s.drafts["deal:create"]
    );

    useEffect(() => {
      if (!draft || !leadId || mode !== "create") return;

      Object.entries(draft).forEach(([key, value]) => {
        setValue(key as any, value as any, {
          shouldValidate: false,
          shouldDirty: false,
        });
      });
    }, [draft, leadId, mode, setValue]);

    useEffect(() => {
      return () => {
        clearDraft("deal:create");
      };
    }, [clearDraft]);

  const onSubmit = async (data: DealFormData) => {
    try {
      setLoading(true);

      // Clean the data - remove empty strings
      const cleanedData: Record<string, unknown> = {
        relatedTo: data.clientId,
        title: data.title.trim(),
      };

      if (leadId) {
  cleanedData.leadId = leadId;
}

      if (data.contactId) cleanedData.contactId = data.contactId;
      if (data.value !== undefined) cleanedData.value = data.value;
      if (data.leadId) cleanedData.leadId = data.leadId;
      if (data.stage?.trim()) cleanedData.stage = data.stage;
      if (data.probability !== undefined) cleanedData.probability = data.probability;
      if (data.closeDate) cleanedData.closeDate = data.closeDate;
      if (data.note?.trim()) cleanedData.note = data.note;

      if (mode === "create") {
        const response = await dealApi.create(cleanedData);
        
        if (response.status) {
          toast.success("Deal created successfully!", {
            description: `Deal ID: ${response.dealId}`,
          });
          
          clearDraft("deal:create");
          // Redirect to the newly created deal detail page
          if (response.dealId) {
            router.push(`/flow-tool/crm/deals/${response.dealId}`);
          } else {
            router.push("/flow-tool/crm/deals");
          }
        } else {
          toast.error("Failed to create deal", {
            description: response.message,
          });
        }
      } else if (mode === "edit" && dealId) {
        const response = await dealApi.edit(dealId, cleanedData);
        
        if (response.status) {
          toast.success("Deal updated successfully");
          router.refresh();
        } else {
          toast.error(response.message || "Failed to update deal");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(
        mode === "create"
          ? "Failed to create deal"
          : "Failed to update deal",
        {
          description: errorMessage,
        }
      );
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} deal:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/flow-tool/crm/deals");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Deal Information</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Enter deal details and assign to a client"
              : "Update the deal details below"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Client Dropdown */}
            <FormField
              id="clientId"
              label="Client"
              type="dropdown"
              placeholder="Select client"
              searchPlaceholder="Search clients..."
              emptyText="No clients found"
              required
              options={clients}
              value={selectedClient}
              onValueChange={(value) => setValue("clientId", value, { shouldValidate: true })}
              loading={loadingClients}
              disabled={mode === "edit"}
              error={errors.clientId}
            />

            {/* Contact Dropdown */}
            <FormField
              id="contactId"
              label="Contact"
              type="dropdown"
              placeholder="Select contact (optional)"
              searchPlaceholder="Search contacts..."
              emptyText="No contacts found"
              options={[
                { _id: "none", name: "None" },
                ...contacts,
              ]}
              value={selectedContact ?? "none"}
              onValueChange={(value) => {
                setValue("contactId", value === "none" ? null : value, {
                  shouldValidate: true,
                });
              }}
              loading={loadingContacts}
              disabled={!selectedClient || loadingContacts}
              error={errors.contactId}
            />

            <FormField
              id="leadId"
              label="Lead"
              type="dropdown"
              placeholder="Select lead (optional)"
              searchPlaceholder="Search leads..."
              emptyText="No leads found"
              options={leads}
              value={selectedLead ?? undefined}
              onValueChange={(value) =>
                setValue("leadId", value || undefined, { shouldValidate: true })
              }
              loading={loadingLeads}
              error={errors.leadId}
            />

            {/* Deal Name */}
            <FormField
              id="title"
              label="Deal Name"
              type="text"
              placeholder="Enter deal name"
              required
              register={register("title")}
              error={errors.title}
            />

            {/* Amount */}
            <FormField
              id="value"
              label="Value"
              type="number"
              placeholder="Enter deal value"
              register={register("value", { valueAsNumber: true })}
              error={errors.value}
            />

            {/* Probability */}
            <FormField
              id="probability"
              label="Probability (%)"
              type="number"
              placeholder="Enter probability (0-100)"
              register={register("probability", { valueAsNumber: true })}
              error={errors.probability}
            />

            {/* Expected Close Date */}
            <FormField
              id="closeDate"
              label="Expected Close Date"
              type="date"
              placeholder="Select expected close date"
              register={register("closeDate")}
              error={errors.closeDate}
            />

            {/* note */}
            <FormField
              id="note"
              label="Note"
              type="text"
              placeholder="Enter deal note (optional)"
              register={register("note")}
              error={errors.note}
              className="col-span-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} variant="outline">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "Create Deal" : "Update Deal"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}