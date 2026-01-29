import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { getContactDetail } from "@/api/contact/server-contact";
import { ContactForm } from "@/components/crm/contact/contact-form";

interface EditContactPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditContactPage({ params }: EditContactPageProps) {
    const { id } = await params;

    // Fetch Contact details server-side
    const detailResponse = await getContactDetail(id);

    console.log("response", detailResponse);


    // Redirect if Contact not found
    if (!detailResponse || !detailResponse.status || !detailResponse.data) {
        redirect("/flow-tool/crm/contacts");
    }

    const contactData = (detailResponse.data as any).data || detailResponse.data;

    // Transform the data to match the form's expected structure
    const contact = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        clientId: contactData.client?._id,
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title={contactData.name}
                description={contactData.name || "Update Contact information and settings"}
                backUrl="/flow-tool/crm/contacts"
            />

            <ContactForm mode="edit" contact={contact} contactId={id} />
        </div>
    );
}
