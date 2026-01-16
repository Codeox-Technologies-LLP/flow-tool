"use client";

import Link from "next/link";
import {
  Users,
  UserPlus,
  Building2,
  TrendingUp,
  Mail,
  DollarSign,
  Calendar,
  Target,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CRMDashboard() {
  const modules = [
    {
      name: "Contacts",
      description: "Manage customer contacts and information",
      route: "/flow-tool/crm/contacts",
      icon: Users,
      color: "bg-blue-500",
      stats: { count: 1248, label: "Active" },
    },
    {
      name: "Leads",
      description: "Track and convert potential customers",
      route: "/flow-tool/crm/leads",
      icon: UserPlus,
      color: "bg-green-500",
      stats: { count: 156, label: "New" },
    },
    {
      name: "Accounts",
      description: "Manage company accounts and organizations",
      route: "/flow-tool/crm/accounts",
      icon: Building2,
      color: "bg-purple-500",
      stats: { count: 342, label: "Accounts" },
    },
    {
      name: "Opportunities",
      description: "Track sales opportunities and deals",
      route: "/flow-tool/crm/opportunities",
      icon: Target,
      color: "bg-orange-500",
      stats: { count: 89, label: "Open" },
    },
    {
      name: "Activities",
      description: "Schedule calls, meetings, and tasks",
      route: "/flow-tool/crm/activities",
      icon: Calendar,
      color: "bg-indigo-500",
      stats: { count: 234, label: "Today" },
    },
    {
      name: "Campaigns",
      description: "Manage marketing campaigns",
      route: "/flow-tool/crm/campaigns",
      icon: Mail,
      color: "bg-pink-500",
      stats: { count: 12, label: "Active" },
    },
  ];

  const overviewStats = [
    {
      label: "Total Revenue",
      value: "$2.4M",
      change: "+24.5%",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Active Leads",
      value: "156",
      change: "+18 new today",
      trend: "up",
      icon: UserPlus,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Conversion Rate",
      value: "68%",
      change: "+5.2%",
      trend: "up",
      icon: TrendingUp,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Pending Follow-ups",
      value: "43",
      change: "23 overdue",
      trend: "warning",
      icon: Clock,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  // Chart Data
  const salesTrendData = [
    { month: "Jan", revenue: 180000, deals: 24, target: 200000 },
    { month: "Feb", revenue: 220000, deals: 28, target: 200000 },
    { month: "Mar", revenue: 195000, deals: 22, target: 200000 },
    { month: "Apr", revenue: 245000, deals: 31, target: 250000 },
    { month: "May", revenue: 285000, deals: 35, target: 250000 },
    { month: "Jun", revenue: 310000, deals: 38, target: 300000 },
  ];

  const leadSourceDistribution = [
    { name: "Website", value: 35, count: 548 },
    { name: "Referrals", value: 28, count: 438 },
    { name: "Social Media", value: 20, count: 313 },
    { name: "Email Campaign", value: 12, count: 188 },
    { name: "Others", value: 5, count: 78 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  const pipelineStages = [
    { stage: "Prospecting", count: 45, value: 225000 },
    { stage: "Qualification", count: 32, value: 384000 },
    { stage: "Proposal", count: 18, value: 432000 },
    { stage: "Negotiation", count: 12, value: 480000 },
    { stage: "Closed Won", count: 23, value: 920000 },
  ];

  const activityData = [
    { name: "Mon", calls: 24, emails: 45, meetings: 8 },
    { name: "Tue", calls: 28, emails: 52, meetings: 12 },
    { name: "Wed", calls: 22, emails: 38, meetings: 6 },
    { name: "Thu", calls: 31, emails: 48, meetings: 10 },
    { name: "Fri", calls: 26, emails: 42, meetings: 9 },
    { name: "Sat", calls: 8, emails: 15, meetings: 2 },
    { name: "Sun", calls: 5, emails: 10, meetings: 1 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          CRM Dashboard
        </h1>
        <p className="text-slate-600">
          Comprehensive overview of your customer relationship management
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trend === "up"
                      ? "bg-green-100 text-green-700"
                      : stat.trend === "warning"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Revenue & Target Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesTrendData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorTarget)"
                name="Target"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Source Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Lead Source Distribution
          </h3>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="50%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {leadSourceDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {leadSourceDistribution.map((source, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">
                      {source.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {source.count} leads ({source.value}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Sales Pipeline by Stage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineStages} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis
                dataKey="stage"
                type="category"
                stroke="#64748b"
                fontSize={12}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                name="Deals"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Weekly Activity Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Calls"
              />
              <Line
                type="monotone"
                dataKey="emails"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Emails"
              />
              <Line
                type="monotone"
                dataKey="meetings"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Meetings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Module Cards */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          CRM Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.name}
                href={module.route}
                className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {module.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-slate-900">
                        {module.stats.count}
                      </span>
                      <span className="text-sm text-slate-500">
                        {module.stats.label}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
