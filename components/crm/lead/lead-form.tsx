"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { allCountries } from "country-region-data";

import { leadSchema, type LeadFormData } from "@/lib/validations/lead";
import { leadApi } from "@/api/lead/lead";
import { userApi } from "@/api/user/user";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";

interface LeadFormProps {
    mode: "create" | "edit";
    lead?: {
        name: string;
        phone?: string;
        title?: string;
        companyName?: string;
        email?: string;
        expectedValue?: string | number;
        source?: string;
        industry?: string;
        country?: string;
        state?: string;
        district?: string;
        zipCode?: string;
        leadOwner?: string;
        assignedTo?: string;
        website?: string;
        socialLinks?: string;
        description?: string;
    };
    enquiryId?: string;
}

const LEAD_SOURCES = [
    { _id: "social_media", name: "Social Media" },
    { _id: "website", name: "Website" },
    { _id: "referal", name: "Referral" },
    { _id: "cold_call", name: "Cold Call" },
];

const INDUSTRY_OPTIONS = [
    { _id: "technology", name: "Technology" },
    { _id: "healthcare", name: "Healthcare" },
    { _id: "finance", name: "Finance" },
    { _id: "retail", name: "Retail" },
    { _id: "manufacturing", name: "Manufacturing" },
    { _id: "education", name: "Education" },
    { _id: "real_estate", name: "Real Estate" },
    { _id: "hospitality", name: "Hospitality" },
    { _id: "other", name: "Other" },
];

const REGION_LABEL_MAP: Record<string, string> = {
    "United States": "State",
    Canada: "Province",
    "United Kingdom": "County",
    India: "State",
    Australia: "State",
    default: "State/Region",
};

export function LeadForm({ mode, lead, enquiryId }: LeadFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<Array<{ _id: string; name: string }>>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadSchema),
        defaultValues: mode === "edit" && lead
            ? {
                name: lead.name || "",
                phone: lead.phone || "",
                title: lead.title || "",
                companyName: lead.companyName || "",
                email: lead.email || "",
                expectedValue: lead.expectedValue || "",
                source: lead.source || "",
                industry: lead.industry || "",
                country: lead.country || "",
                state: lead.state || "",
                district: lead.district || "",
                zipCode: lead.zipCode || "",
                leadOwner: lead.leadOwner || "",
                assignedTo: lead.assignedTo || "",
                website: lead.website || "",
                socialLinks: lead.socialLinks || "",
                description: lead.description || "",
            }
            : {
                name: "",
                phone: "",
                title: "",
                companyName: "",
                email: "",
                expectedValue: "",
                source: "",
                industry: "",
                country: "",
                state: "",
                district: "",
                zipCode: "",
                leadOwner: "",
                assignedTo: "",
                website: "",
                socialLinks: "",
                description: "",
            },
    });

    const name = watch("name");
    const selectedCountry = watch("country");

    // Auto-generate title from name
    useEffect(() => {
        if (name && mode === "create") {
            setValue("title", `${name}'s Lead`, { shouldValidate: true });
        } else if (!name && mode === "create") {
            setValue("title", "");
        }
    }, [name, setValue, mode]);

    // Fetch users for assignedTo dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const response = await userApi.list({ page: 1, limit: 100 });
                if (response?.result?.data) {
                    setUsers(
                        response.result.data.map((user) => ({
                            _id: user.id as string,
                            name: user.name,
                        }))
                    );
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
                toast.error("Failed to load users");
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    // Get country options
    const countryOptions = allCountries.map(([countryName]) => ({
        _id: countryName,
        name: countryName,
    }));

    // Get state/region options based on selected country
    const getStatesForCountry = (countryName: string) => {
        const country = allCountries.find(([name]) => name === countryName);
        if (!country || !country[2]) return [];
        return country[2].map((region: any) => ({
            _id: region[0],
            name: region[0],
        }));
    };

    const stateOptions = selectedCountry ? getStatesForCountry(selectedCountry) : [];
    const regionLabel = REGION_LABEL_MAP[selectedCountry || ""] || REGION_LABEL_MAP.default;

    const onSubmit = async (data: LeadFormData) => {
        try {
            setLoading(true);

            // Clean the data - remove empty strings and convert to proper types
            const cleanedData: Record<string, unknown> = {
                name: data.name.trim(),
            };

            if (data.phone?.trim()) cleanedData.phone = data.phone.trim();
            if (data.title?.trim()) cleanedData.title = data.title.trim();
            if (data.companyName?.trim()) cleanedData.companyName = data.companyName.trim();
            if (data.email?.trim()) cleanedData.email = data.email.trim();
            if (data.expectedValue) cleanedData.expectedValue = data.expectedValue;
            if (data.source?.trim()) cleanedData.source = data.source;
            if (data.industry?.trim()) cleanedData.industry = data.industry;
            if (data.country?.trim()) cleanedData.country = data.country;
            if (data.state?.trim()) cleanedData.state = data.state;
            if (data.district?.trim()) cleanedData.district = data.district.trim();
            if (data.zipCode?.trim()) cleanedData.zipCode = data.zipCode.trim();
            if (data.leadOwner?.trim()) cleanedData.leadOwner = data.leadOwner.trim();
            if (data.assignedTo?.trim()) cleanedData.assignedTo = data.assignedTo;
            if (data.website?.trim()) cleanedData.website = data.website.trim();
            if (data.socialLinks?.trim()) cleanedData.socialLinks = data.socialLinks.trim();
            if (data.description?.trim()) cleanedData.description = data.description.trim();

            if (mode === "create") {
                const response = await leadApi.create(cleanedData);

                if (response.status) {
                    toast.success("Lead created successfully!", {
                        description: `Lead ID: ${response.enquiryId}`,
                    });

                    // Redirect to the newly created lead detail page
                    if (response.enquiryId) {
                        router.push(`/flow-tool/crm/leads/${response.enquiryId}`);
                    } else {
                        router.push("/flow-tool/crm/leads");
                    }
                } else {
                    toast.error("Failed to create lead", {
                        description: response.message,
                    });
                }
            } else if (mode === "edit" && enquiryId) {
                const response = await leadApi.edit(enquiryId, cleanedData);

                if (response.status) {
                    toast.success("Lead updated successfully");
                    router.refresh();
                } else {
                    toast.error(response.message || "Failed to update lead");
                }
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An error occurred";
            toast.error(
                mode === "create"
                    ? "Failed to create lead"
                    : "Failed to update lead",
                {
                    description: errorMessage,
                }
            );
            console.error(
                `Error ${mode === "create" ? "creating" : "updating"} lead:`,
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push("/flow-tool/crm/leads");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Lead Information</CardTitle>
                    <CardDescription>
                        {mode === "create"
                            ? "Enter lead details to create a new lead"
                            : "Update the lead details below"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">
                        {/* Name - 6 columns */}
                        <div className="col-span-12 lg:col-span-6">
                            <FormField
                                id="name"
                                label="Name"
                                type="text"
                                placeholder="Enter Name"
                                required
                                register={register("name")}
                                error={errors.name}
                            />
                        </div>

                        {/* Title - 6 columns */}
                        <div className="col-span-12 lg:col-span-6">
                            <FormField
                                id="title"
                                label="Title"
                                type="text"
                                placeholder="Enter Title"
                                register={register("title")}
                                error={errors.title}
                            />
                        </div>

                        {/* Company Name - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="companyName"
                                label="Company Name"
                                type="text"
                                placeholder="Enter Company/Business name"
                                register={register("companyName")}
                                error={errors.companyName}
                            />
                        </div>

                        {/* Email - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="Enter Email"
                                register={register("email")}
                                error={errors.email}
                            />
                        </div>

                        {/* Phone Number - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="phone"
                                label="Phone Number"
                                type="number"
                                placeholder="Enter a phone number"
                                register={register("phone")}
                                error={errors.phone}
                            />
                        </div>

                        {/* Expected Value - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="expectedValue"
                                label="Expected Value"
                                type="number"
                                placeholder="00.00"
                                register={register("expectedValue")}
                                error={errors.expectedValue}
                            />
                        </div>

                        {/* Lead Source - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="source"
                                label="Lead Source"
                                type="dropdown"
                                placeholder="Select source"
                                searchPlaceholder="Search sources..."
                                emptyText="No sources found"
                                options={LEAD_SOURCES}
                                value={watch("source")}
                                onValueChange={(value) => setValue("source", value, { shouldValidate: true })}
                                error={errors.source}
                            />
                        </div>

                        {/* Industry - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="industry"
                                label="Industry"
                                type="dropdown"
                                placeholder="Select Industry"
                                searchPlaceholder="Search industries..."
                                emptyText="No industries found"
                                options={INDUSTRY_OPTIONS}
                                value={watch("industry")}
                                onValueChange={(value) => setValue("industry", value, { shouldValidate: true })}
                                error={errors.industry}
                            />
                        </div>

                        {/* Country - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="country"
                                label="Country"
                                type="dropdown"
                                placeholder="Select Country"
                                searchPlaceholder="Search countries..."
                                emptyText="No countries found"
                                options={countryOptions}
                                value={watch("country")}
                                onValueChange={(value) => {
                                    setValue("country", value, { shouldValidate: true });
                                    setValue("state", ""); // Reset state when country changes
                                }}
                                error={errors.country}
                            />
                        </div>

                        {/* State/Region - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="state"
                                label={regionLabel}
                                type="dropdown"
                                placeholder={`Select ${regionLabel}`}
                                searchPlaceholder={`Search ${regionLabel.toLowerCase()}...`}
                                emptyText={`No ${regionLabel.toLowerCase()}s found`}
                                options={stateOptions}
                                value={watch("state")}
                                onValueChange={(value) => setValue("state", value, { shouldValidate: true })}
                                disabled={!selectedCountry || stateOptions.length === 0}
                                error={errors.state}
                            />
                        </div>

                        {/* District - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="district"
                                label="District"
                                type="text"
                                placeholder="Enter District"
                                register={register("district")}
                                error={errors.district}
                            />
                        </div>

                        {/* Zip Code - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="zipCode"
                                label="Zip Code"
                                type="text"
                                placeholder="Enter Zip Code"
                                register={register("zipCode")}
                                error={errors.zipCode}
                            />
                        </div>

                        {/* Lead Owner - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="leadOwner"
                                label="Lead Owner"
                                type="text"
                                placeholder="Lead Owner"
                                register={register("leadOwner")}
                                disabled={true}
                                error={errors.leadOwner}
                            />
                        </div>

                        {/* Assigned To - 4 columns */}
                        <div className="col-span-12 lg:col-span-4">
                            <FormField
                                id="assignedTo"
                                label="Assigned To"
                                type="dropdown"
                                placeholder="Select user"
                                searchPlaceholder="Search users..."
                                emptyText="No users found"
                                options={users}
                                value={watch("assignedTo")}
                                onValueChange={(value) => setValue("assignedTo", value, { shouldValidate: true })}
                                loading={loadingUsers}
                                error={errors.assignedTo}
                            />
                        </div>

                        {/* Website - 6 columns */}
                        <div className="col-span-12 lg:col-span-6">
                            <FormField
                                id="website"
                                label="Website"
                                type="text"
                                placeholder="Enter Website"
                                register={register("website")}
                                error={errors.website}
                            />
                        </div>

                        {/* Social Links - 6 columns */}
                        <div className="col-span-12 lg:col-span-6">
                            <FormField
                                id="socialLinks"
                                label="Social Links"
                                type="text"
                                placeholder="Enter any Social media links"
                                register={register("socialLinks")}
                                error={errors.socialLinks}
                            />
                        </div>

                        {/* Description - 12 columns */}
                        <div className="col-span-12">
                            <FormField
                                id="description"
                                label="Description"
                                type="text"
                                placeholder="Enter Description for this lead"
                                register={register("description")}
                                error={errors.description}
                            // rows={4}
                            />
                        </div>
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
                                    {mode === "create" ? "Create Lead" : "Update Lead"}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}