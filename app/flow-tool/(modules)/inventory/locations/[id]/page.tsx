import { redirect } from "next/navigation";
import { getLocationDetail } from "@/api/location/server-location";
import { PageHeader } from "@/components/shared/page-header";
import { SplitLayoutWithAudit } from "@/components/shared/split-layout";
import { LocationForm } from "@/components/inventory/location/location-form";

interface EditLocationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLocationPage({ params }: EditLocationPageProps) {
  const { id } = await params;
  
  // Fetch location details server-side
  const detailResponse = await getLocationDetail(id);

  // Redirect if location not found
  if (!detailResponse || !detailResponse.status || !detailResponse.data) {
    redirect("/flow-tool/inventory/locations");
  }

  const locationData = detailResponse.data;

  // Transform the data to match the form's expected structure
  const location = {
    warehouseId: locationData.warehouseId,
    parentId: locationData.parentId,
    name: locationData.name,
    type: locationData.type,
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={locationData.name}
        description={locationData.path || "Update location information and settings"}
        backUrl="/flow-tool/inventory/locations"
      />

      <SplitLayoutWithAudit>
        <LocationForm mode="edit" location={location} locationId={id} />
      </SplitLayoutWithAudit>
    </div>
  );
}
