"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

import { clientSchema, type ClientFormData } from "@/lib/validations/client";
import { clientApi } from "@/api/client/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import { Separator } from "@/components/ui/separator";
import { ClientData } from "@/types/client";

type ClientFormDataExtended = Omit<ClientFormData, 'deliveryAddresses' | 'contacts'> & {
  deliveryAddresses: NonNullable<ClientFormData['deliveryAddresses']>;
  contacts: NonNullable<ClientFormData['contacts']>;
};

interface ClientFormProps {
  mode: "create" | "edit";
  client?: ClientData;
  clientId?: string;
  currentUserId?: string;
}

const CLIENT_TYPES = [
  { _id: "individual", name: "Individual" },
  { _id: "business", name: "Business" },
];

const CLIENT_SOURCES = [
  { _id: "website", name: "Website" },
  { _id: "referral", name: "Referral" },
  { _id: "social_media", name: "Social Media" },
  { _id: "cold_call", name: "Cold Call" },
  { _id: "trade_show", name: "Trade Show" },
  { _id: "other", name: "Other" },
];

export function ClientForm({ mode, client, clientId, currentUserId }: ClientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Array<{ _id: string; name: string }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Get default values based on mode
  const getDefaultValues = (): ClientFormDataExtended => {
    if (mode === "edit" && client) {
      // Extract nested data if present
      const clientData = (client as any).data || client;
      
      return {
        name: clientData.name || "",
        email: clientData.email || "",
        source: clientData.source || "",
        type: clientData.type || "",
        billingAddress: clientData.billingAddress || {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
        deliveryAddresses: Array.isArray(clientData.deliveryAddresses) ? clientData.deliveryAddresses : [],
        contacts: Array.isArray(clientData.contacts) ? clientData.contacts : [],
      };
    }

    // Create mode defaults
    return {
      name: "",
      email: "",
      source: "",
      type: "",
      billingAddress: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      deliveryAddresses: [],
      contacts: [],
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<ClientFormDataExtended>({
    resolver: zodResolver(clientSchema) as any,
    defaultValues: getDefaultValues(),
  });

  // Field arrays for dynamic sections
  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: "contacts",
  });

  const {
    fields: deliveryAddressFields,
    append: appendDeliveryAddress,
    remove: removeDeliveryAddress,
  } = useFieldArray({
    control,
    name: "deliveryAddresses",
  });

  
  const onSubmit = async (data: ClientFormDataExtended) => {
    try {
      setLoading(true);

      // Clean the data - remove empty strings and empty objects
      const cleanedData: Record<string, unknown> = {
        name: data.name.trim(),
      };

      if (data.email?.trim()) cleanedData.email = data.email.trim();
      if (data.source?.trim()) cleanedData.source = data.source;
      if (data.type?.trim()) cleanedData.type = data.type;

      // Handle billing address
      if (data.billingAddress) {
        const hasContent = Object.values(data.billingAddress).some(
          (v) => v && v.toString().trim() !== ""
        );
        if (hasContent) {
          cleanedData.billingAddress = Object.fromEntries(
            Object.entries(data.billingAddress).filter(
              ([_, v]) => v && v.toString().trim() !== ""
            )
          );
        }
      }

      // Handle delivery addresses
      if (data.deliveryAddresses && data.deliveryAddresses.length > 0) {
        const validDeliveryAddresses = data.deliveryAddresses
          .filter((addr) =>
            Object.values(addr).some((v) => v && v.toString().trim() !== "")
          )
          .map((addr) =>
            Object.fromEntries(
              Object.entries(addr).filter(
                ([_, v]) => v && v.toString().trim() !== ""
              )
            )
          );

        if (validDeliveryAddresses.length > 0) {
          cleanedData.deliveryAddresses = validDeliveryAddresses;
        }
      }

      // Handle contacts - IMPORTANT: Don't send contacts array if empty or if only empty objects
      if (data.contacts && data.contacts.length > 0) {
        const validContacts = data.contacts
          .filter((contact) => contact.name || contact.email || contact.phone)
          .map((contact) => {
            const cleaned: Record<string, string> = {};
            if (contact.name?.trim()) cleaned.name = contact.name.trim();
            if (contact.email?.trim()) cleaned.email = contact.email.trim();
            if (contact.phone?.trim()) cleaned.phone = contact.phone.trim();
            return cleaned;
          });

        // Only include contacts if there are valid ones
        if (validContacts.length > 0) {
          cleanedData.contacts = validContacts;
        }
        // If no valid contacts, don't send the field at all
      }

      console.log("Submitting cleaned data:", cleanedData);

      if (mode === "create") {
        const response = await clientApi.create(cleanedData);

        if (response.status) {
          toast.success("Client created successfully!");

          // Redirect to the newly created client detail page
          if (response.clientId) {
            router.push(`/flow-tool/crm/clients/${response.clientId}`);
          } else {
            router.push("/flow-tool/crm/clients");
          }
        } else {
          toast.error("Failed to create client", {
            description: response.message,
          });
        }
      } else if (mode === "edit" && clientId) {
        const response = await clientApi.edit(clientId, cleanedData);

        if (response.status) {
          toast.success("Client updated successfully");
          router.refresh();
        } else {
          toast.error(response.message || "Failed to update client");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(
        mode === "create" ? "Failed to create client" : "Failed to update client",
        {
          description: errorMessage,
        }
      );
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} client:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/flow-tool/crm/clients");
  };

  const addContact = () => {
    appendContact({ name: "", email: "", phone: "" });
  };

  const addDeliveryAddress = () => {
    appendDeliveryAddress({
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Enter client details and contact information"
              : "Update the client details below"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <FormField
                id="name"
                label="Name"
                type="text"
                placeholder="Enter client name"
                required
                register={register("name")}
                error={errors.name}
              />

              {/* Email */}
              <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="Enter email"
                register={register("email")}
                error={errors.email}
              />

              {/* Type */}
              <FormField
                id="type"
                label="Client Type"
                type="dropdown"
                placeholder="Select type"
                searchPlaceholder="Search types..."
                emptyText="No types found"
                options={CLIENT_TYPES}
                value={watch("type")}
                onValueChange={(value) =>
                  setValue("type", value, { shouldValidate: true })
                }
                error={errors.type}
              />

              {/* Source */}
              <FormField
                id="source"
                label="Source"
                type="dropdown"
                placeholder="Select source"
                searchPlaceholder="Search sources..."
                emptyText="No sources found"
                options={CLIENT_SOURCES}
                value={watch("source")}
                onValueChange={(value) =>
                  setValue("source", value, { shouldValidate: true })
                }
                error={errors.source}
              />

            </div>
          </div>

          <Separator />

          {/* Billing Address */}
          <div>
            <h3 className="text-sm font-medium mb-4">Billing Address</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Street - Full width */}
              <div className="col-span-2">
                <FormField
                  id="billingAddress.street"
                  label="Street Address"
                  type="text"
                  placeholder="Enter street address"
                  register={register("billingAddress.street")}
                  error={errors.billingAddress?.street}
                />
              </div>

              {/* City */}
              <FormField
                id="billingAddress.city"
                label="City"
                type="text"
                placeholder="Enter city"
                register={register("billingAddress.city")}
                error={errors.billingAddress?.city}
              />

              {/* State */}
              <FormField
                id="billingAddress.state"
                label="State/Province"
                type="text"
                placeholder="Enter state"
                register={register("billingAddress.state")}
                error={errors.billingAddress?.state}
              />

              {/* Country */}
              <FormField
                id="billingAddress.country"
                label="Country"
                type="text"
                placeholder="Enter country"
                register={register("billingAddress.country")}
                error={errors.billingAddress?.country}
              />

              {/* Zip Code */}
              <FormField
                id="billingAddress.zipCode"
                label="Zip Code"
                type="text"
                placeholder="Enter zip code"
                register={register("billingAddress.zipCode")}
                error={errors.billingAddress?.zipCode}
              />
            </div>
          </div>

          <Separator />

          {/* Delivery Addresses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Delivery Addresses</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDeliveryAddress}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Address
              </Button>
            </div>

            {deliveryAddressFields.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No delivery addresses added yet. Click "Add Address" to create one.
              </p>
            ) : (
              <div className="space-y-4">
                {deliveryAddressFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        Delivery Address {index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDeliveryAddress(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Street - Full width */}
                      <div className="col-span-2">
                        <FormField
                          id={`deliveryAddresses.${index}.street`}
                          label="Street Address"
                          type="text"
                          placeholder="Enter street address"
                          register={register(`deliveryAddresses.${index}.street`)}
                          error={errors.deliveryAddresses?.[index]?.street}
                        />
                      </div>

                      {/* City */}
                      <FormField
                        id={`deliveryAddresses.${index}.city`}
                        label="City"
                        type="text"
                        placeholder="Enter city"
                        register={register(`deliveryAddresses.${index}.city`)}
                        error={errors.deliveryAddresses?.[index]?.city}
                      />

                      {/* State */}
                      <FormField
                        id={`deliveryAddresses.${index}.state`}
                        label="State/Province"
                        type="text"
                        placeholder="Enter state"
                        register={register(`deliveryAddresses.${index}.state`)}
                        error={errors.deliveryAddresses?.[index]?.state}
                      />

                      {/* Country */}
                      <FormField
                        id={`deliveryAddresses.${index}.country`}
                        label="Country"
                        type="text"
                        placeholder="Enter country"
                        register={register(`deliveryAddresses.${index}.country`)}
                        error={errors.deliveryAddresses?.[index]?.country}
                      />

                      {/* Zip Code */}
                      <FormField
                        id={`deliveryAddresses.${index}.zipCode`}
                        label="Zip Code"
                        type="text"
                        placeholder="Enter zip code"
                        register={register(`deliveryAddresses.${index}.zipCode`)}
                        error={errors.deliveryAddresses?.[index]?.zipCode}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Contacts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Contacts</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContact}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>

            {contactFields.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No contacts added yet. Click "Add Contact" to create one.
              </p>
            ) : (
              <div className="space-y-4">
                {contactFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Contact {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContact(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Name */}
                      <FormField
                        id={`contacts.${index}.name`}
                        label="Name"
                        type="text"
                        placeholder="Enter name"
                        register={register(`contacts.${index}.name`)}
                        error={errors.contacts?.[index]?.name}
                      />

                      {/* Email */}
                      <FormField
                        id={`contacts.${index}.email`}
                        label="Email"
                        type="email"
                        placeholder="Enter email"
                        register={register(`contacts.${index}.email`)}
                        error={errors.contacts?.[index]?.email}
                      />

                      {/* Phone - Full width */}
                      <div className="col-span-2">
                        <FormField
                          id={`contacts.${index}.phone`}
                          label="Phone"
                          type="number"
                          placeholder="Enter phone"
                          register={register(`contacts.${index}.phone`)}
                          error={errors.contacts?.[index]?.phone}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
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
                  {mode === "create" ? "Create Client" : "Update Client"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}