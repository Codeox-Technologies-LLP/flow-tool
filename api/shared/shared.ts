import { apiClient } from "@/api/axios";

/* ---------------- Clients ---------------- */
export const fetchClients = async () => {
  const res = await apiClient.get("/dropdown/clients");
  return res.data;
};

/* ---------------- Locations ---------------- */
export const fetchLocations = async () => {
  const res = await apiClient.get("/dropdown/locations");
  return res.data;
};

/* ---------------- Users (Assigned To) ---------------- */
export const fetchUsers = async () => {
  const res = await apiClient.get("/dropdown/users");
  return res.data;
};

/* ---------------- Products (by location) ---------------- */
export const fetchProductsByLocation = async (
  locationId: string,
) => {
  const res = await apiClient.get("/dropdown/locations", {
    params: { locationId },
  });
  return res.data;
};
