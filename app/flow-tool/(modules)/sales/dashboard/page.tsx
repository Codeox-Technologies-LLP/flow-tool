"use client";

import Link from "next/link";
import {
  ShoppingBag,
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle2,
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

export default function SalesDashboard() {
  const modules = [
    {
      name: "Orders",
      description: "Manage sales orders and fulfillment",
      route: "/flow-tool/sales/orders",
      icon: ShoppingBag,
      color: "bg-blue-500",
      stats: { count: 342, label: "Active" },
    },
    {
      name: "Quotations",
      description: "Create and track sales quotations",
      route: "/flow-tool/sales/quotations",
      icon: FileText,
      color: "bg-green-500",
      stats: { count: 127, label: "Pending" },
    },
    {
      name: "Customers",
      description: "Manage customer relationships",
      route: "/flow-tool/sales/customers",
      icon: Users,
      color: "bg-purple-500",
      stats: { count: 1847, label: "Total" },
    },
    {
      name: "Invoices",
      description: "Generate and track sales invoices",
      route: "/flow-tool/sales/invoices",
      icon: FileText,
      color: "bg-orange-500",
      stats: { count: 298, label: "Outstanding" },
    },
    {
      name: "Deliveries",
      description: "Track order deliveries and logistics",
      route: "/flow-tool/sales/deliveries",
      icon: ShoppingBag,
      color: "bg-indigo-500",
      stats: { count: 156, label: "In Transit" },
    },
    {
      name: "Returns",
      description: "Handle product returns and refunds",
      route: "/flow-tool/sales/returns",
      icon: AlertCircle,
      color: "bg-red-500",
      stats: { count: 23, label: "Processing" },
    },
  ];

  const overviewStats = [
    {
      label: "Total Revenue",
      value: "$3.2M",
      change: "+18.7%",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Active Orders",
      value: "342",
      change: "+24 today",
      trend: "up",
      icon: ShoppingBag,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Conversion Rate",
      value: "72%",
      change: "+4.2%",
      trend: "up",
      icon: Target,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Average Deal Size",
      value: "$9,356",
      change: "+$1,245",
      trend: "up",
      icon: Award,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  // Chart Data
  const revenueData = [
    { month: "Jan", revenue: 520000, target: 500000, orders: 124 },
    { month: "Feb", revenue: 485000, target: 500000, orders: 118 },
    { month: "Mar", revenue: 610000, target: 600000, orders: 145 },
    { month: "Apr", revenue: 675000, target: 650000, orders: 167 },
    { month: "May", revenue: 720000, target: 700000, orders: 182 },
    { month: "Jun", revenue: 845000, target: 800000, orders: 198 },
  ];

  const productCategoryData = [
    { name: "Electronics", value: 35, amount: 1120000 },
    { name: "Clothing", value: 28, amount: 896000 },
    { name: "Home & Garden", value: 18, amount: 576000 },
    { name: "Sports", value: 12, amount: 384000 },
    { name: "Others", value: 7, amount: 224000 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  const salesPipelineData = [
    { stage: "Qualified Leads", count: 245, value: 2450000 },
    { stage: "Proposal Sent", count: 178, value: 1780000 },
    { stage: "Negotiation", count: 124, value: 1240000 },
    { stage: "Closed Won", count: 89, value: 890000 },
    { stage: "Closed Lost", count: 34, value: 340000 },
  ];

  const topProductsData = [
    { product: "Premium Widget", sales: 1250, revenue: 375000 },
    { product: "Pro Gadget", sales: 980, revenue: 294000 },
    { product: "Elite Tool", sales: 845, revenue: 253500 },
    { product: "Smart Device", sales: 720, revenue: 216000 },
    { product: "Deluxe Kit", sales: 650, revenue: 195000 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Sales Dashboard
        </h1>
        <p className="text-slate-600">
          Track your sales performance, revenue, and customer engagement metrics
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
                      ? "bg-red-100 text-red-700"
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
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Revenue vs Target
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorTarget)"
                name="Target"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Product Category Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Sales by Category
          </h3>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="50%" height={300}>
              <PieChart>
                <Pie
                  data={productCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {productCategoryData.map((entry, index) => (
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
              {productCategoryData.map((category, index) => (
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

        {/* Sales Pipeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Sales Pipeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesPipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="stage" stroke="#64748b" fontSize={12} angle={-15} textAnchor="end" height={80} />
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
              <Bar dataKey="count" fill="#3b82f6" name="Opportunities" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Top Performing Products
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="product" stroke="#64748b" fontSize={12} angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" fill="#10b981" name="Units Sold" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill="#3b82f6" name="Revenue ($)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Module Cards */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Sales Modules
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
