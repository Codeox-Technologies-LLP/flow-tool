import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome, {session.user.fullName}!</p>
          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <p>Email: {session.user.email}</p>
            <p>User ID: {session.user.userId}</p>
            <p>Org ID: {session.user.orgId}</p>
            <p>Role: {session.user.orgRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
