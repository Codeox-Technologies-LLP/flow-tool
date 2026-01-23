import { get } from "lodash";
import {
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadAnalyticsCardsProps } from "@/types/lead";

export function LeadAnalyticsCards({
  analytics,
  loading,
}: LeadAnalyticsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Leads */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Leads
          </CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {get(analytics, "summary.totalLeads", 0)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            All captured leads
          </p>
        </CardContent>
      </Card>

      {/* Active Leads */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Active Leads
          </CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {get(analytics, "statusDistribution.active", 0)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Currently engaged
          </p>
        </CardContent>
      </Card>

      {/* Inactive Leads */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Inactive Leads
          </CardTitle>
          <UserX className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {get(analytics, "statusDistribution.inactive", 0)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Not responding
          </p>
        </CardContent>
      </Card>

      {/* Alerts & Follow-ups */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Needs Attention
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {get(analytics, "alerts.needsAttention", 0)}
          </div>
          <p className="text-xs text-orange-600 mt-1">
            {get(analytics, "alerts.lowStock", 0)} pending follow-ups,{" "}
            {get(analytics, "alerts.outOfStock", 0)} overdue
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
