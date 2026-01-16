"use client";

import Link from "next/link";
import {
  ShoppingCart,
  FileText,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
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

export default function PurchaseDashboard() {
  const modules = [
    {
      name: "Purchase Orders",
      description: "Create and manage purchase orders",
      route: "/flow-tool/purchase/orders",
      icon: ShoppingCart,
      color: "bg-blue-500",
      stats: { count: 247, label: "Active" },
    },
    {
      name: "Requisitions",
      description: "Handle purchase requisitions and approvals",
      route: "/flow-tool/purchase/requisitions",
      icon: FileText,
      color: "bg-green-500",
      stats: { count: 58, label: "Pending" },
    },
    {
      name: "Vendors",
      description: "Manage vendor relationships and contracts",
      route: "/flow-tool/purchase/vendors",
      icon: Users,
      color: "bg-purple-500",
      stats: { count: 142, label: "Vendors" },
    },
    {
      name: "Receipts",
      description: "Track and verify goods received",
      route: "/flow-tool/purchase/receipts",
      icon: Package,
      color: "bg-orange-500",
      stats: { count: 189, label: "This Month" },
    },
    {
      name: "Invoices",
      description: "Process vendor invoices and payments",
      route: "/flow-tool/purchase/invoices",
      icon: FileText,
      color: "bg-indigo-500",
      stats: { count: 95, label: "Unpaid" },
    },
    {
      name: "Contracts",
      description: "Manage purchase contracts and agreements",
      route: "/flow-tool/purchase/contracts",
      icon: FileText,
      color: "bg-teal-500",
      stats: { count: 34, label: "Active" },
    },
  ];

  const overviewStats = [
    {
      label: "Total Spend",
      value: "$1.8M",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Open Orders",
      value: "247",
      change: "+12 today",
      trend: "up",
      icon: ShoppingCart,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Average Lead Time",
      value: "7 days",
      change: "-1.2 days",
      trend: "down",
      icon: Clock,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Overdue Deliveries",
      value: "18",
      change: "5 critical",
      trend: "warning",
      icon: AlertTriangle,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  // Chart Data
  const spendTrendData = [
    { month: "Jan", spend: 280000, budget: 300000, orders: 45 },
    { month: "Feb", spend: 310000, budget: 300000, orders: 52 },
    { month: "Mar", spend: 265000, budget: 300000, orders: 48 },
    { month: "Apr", spend: 335000, budget: 350000, orders: 58 },
    { month: "May", spend: 385000, budget: 350000, orders: 64 },
    { month: "Jun", spend: 425000, budget: 400000, orders: 71 },
  ];

  const categoryDistribution = [
    { name: "Raw Materials", value: 42, amount: 756000 },
    { name: "Equipment", value: 23, amount: 414000 },
    { name: "Supplies", value: 18, amount: 324000 },
    { name: "Services", value: 12, amount: 216000 },
    { name: "Others", value: 5, amount: 90000 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  const vendorPerformance = [
    { vendor: "Acme Corp", onTime: 95, quality: 92, rating: 4.8 },
    { vendor: "Global Supplies", onTime: 88, quality: 94, rating: 4.5 },
    { vendor: "Tech Solutions", onTime: 92, quality: 89, rating: 4.6 },
    { vendor: "Prime Materials", onTime: 85, quality: 91, rating: 4.3 },
    { vendor: "Swift Logistics", onTime: 90, quality: 87, rating: 4.4 },
  ];

  const orderStatusData = [
    { status: "Pending Approval", count: 23, value: 184000 },
    { status: "Approved", count: 45, value: 405000 },
    { status: "In Transit", count: 67, value: 603000 },
    { status: "Received", count: 89, value: 801000 },
    { status: "Completed", count: 112, value: 1008000 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Purchase Dashboard
        </h1>
        <p className="text-slate-600">
          Comprehensive overview of your procurement and purchasing activities
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
                      : stat.trend === "down"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
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
        {/* Spend Trend Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Monthly Spend vs Budget
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={spendTrendData}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                dataKey="spend"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSpend)"
                name="Actual Spend"
              />
              <Area
                type="monotone"
                dataKey="budget"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorBudget)"
                name="Budget"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Spend by Category
          </h3>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="50%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
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
              {categoryDistribution.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">
                      {category.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      ${(category.amount / 1000).toFixed(0)}K ({category.value}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Status Pipeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Order Status Pipeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis dataKey="status" type="category" stroke="#64748b" fontSize={12} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Orders" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vendor Performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Top Vendor Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="vendor" stroke="#64748b" fontSize={12} angle={-45} textAnchor="end" height={80} />
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
              <Bar dataKey="onTime" fill="#10b981" name="On-Time %" radius={[8, 8, 0, 0]} />
              <Bar dataKey="quality" fill="#3b82f6" name="Quality %" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Module Cards */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Purchase Modules
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
