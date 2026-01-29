"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
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
import { clientApi } from "@/api/client/client";

interface ContactFormProps {
    mode: "create" | "edit";
    contact?: {
        clientId?: string;
        name: string;
        email?: string;
        phone?: string;
    };
    contactId?: string;
}

export function ContactForm({ mode, contact, contactId }: ContactFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Array<{ _id: string; name: string }>>([]);
    const [loadingClients, setLoadingClients] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: mode === "edit" && contact
            ? {
                clientId: contact.clientId || "",
                name: contact.name || "",
                email: contact.email || "",
                phone: contact.phone || "",
            }
            : {
                clientId: "",
                name: "",
                email: "",
                phone: "",
            },
    });

    const selectedClient = watch("clientId");

    // Fetch clients for dropdown
    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoadingClients(true);
                const response = await clientApi.list({ page: 1, limit: 100 });
                if (response?.result?.data) {
                    setClients(
                        response.result.data.map((client) => ({
                            _id: client.id, // Use the id field from ClientData
                            name: client.client,
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

    const onSubmit = async (data: ContactFormData) => {
        try {
            setLoading(true);

            // Clean the data - remove empty strings
            const cleanedData: Record<string, unknown> = {
                name: data.name.trim(),
            };

            if (data.clientId) cleanedData.clientId = data.clientId;
            if (data.email?.trim()) cleanedData.email = data.email.trim();
            if (data.phone?.trim()) cleanedData.phone = data.phone.trim();

            if (mode === "create") {
                const response = await contactApi.create(cleanedData);

                if (response.status) {
                    toast.success("Contact created successfully!", {
                        description: `Contact: ${data.name}`,
                    });

                    // Redirect to the contacts list page or detail page
                    if (response.contactId) {
                        router.push(`/flow-tool/crm/contacts/${response.contactId}`);
                    } else {
                        router.push("/flow-tool/crm/contacts");
                    }
                } else {
                    toast.error("Failed to create contact", {
                        description: response.message,
                    });
                }
            } else if (mode === "edit" && contactId) {
                const response = await contactApi.edit(contactId, cleanedData);

                if (response.status) {
                    toast.success("Contact updated successfully");
                    router.refresh();
                } else {
                    toast.error(response.message || "Failed to update contact");
                }
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An error occurred";
            toast.error(
                mode === "create"
                    ? "Failed to create contact"
                    : "Failed to update contact",
                {
                    description: errorMessage,
                }
            );
            console.error(
                `Error ${mode === "create" ? "creating" : "updating"} contact:`,
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push("/flow-tool/crm/contacts");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                        {mode === "create"
                            ? "Enter contact details and assign to a client"
                            : "Update the contact details below"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Client Dropdown */}
                        <FormField
                            id="clientId"
                            label="Client"
                            type="dropdown"
                            placeholder="Select client (optional)"
                            searchPlaceholder="Search clients..."
                            emptyText="No clients found"
                            options={[
                                { _id: "none", name: "None" },
                                ...clients,
                            ]}
                            value={selectedClient || "none"}
                            onValueChange={(value) => {
                                setValue("clientId", value === "none" ? "" : value, {
                                    shouldValidate: true,
                                });
                            }}
                            loading={loadingClients}
                            error={errors.clientId}
                        />

                        {/* Contact Name */}
                        <FormField
                            id="name"
                            label="Contact Name"
                            type="text"
                            placeholder="Enter contact name"
                            required
                            register={register("name")}
                            error={errors.name}
                        />

                        {/* Email */}
                        <FormField
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            register={register("email")}
                            error={errors.email}
                        />

                        {/* Phone */}
                        <FormField
                            id="phone"
                            label="Phone"
                            type="text"
                            placeholder="Enter phone number"
                            register={register("phone")}
                            error={errors.phone}
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
                                    {mode === "create" ? "Create Contact" : "Update Contact"}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}