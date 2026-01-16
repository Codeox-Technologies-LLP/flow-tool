"use client";

import Link from "next/link";
import {
  Warehouse,
  MapPin,
  ArrowLeftRight,
  ArrowUpDown,
  Trash2,
  Store,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
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

export default function InventoryDashboard() {
  const modules = [
    {
      name: "Warehouses",
      description: "Manage warehouse locations and configurations",
      route: "/flow-tool/inventory/warehouses",
      icon: Warehouse,
      color: "bg-blue-500",
      stats: { count: 12, label: "Active" },
    },
    {
      name: "Locations",
      description: "Track storage locations within warehouses",
      route: "/flow-tool/inventory/locations",
      icon: MapPin,
      color: "bg-green-500",
      stats: { count: 48, label: "Locations" },
    },
    {
      name: "Internal Transfer",
      description: "Move inventory between locations",
      route: "/flow-tool/inventory/transfer",
      icon: ArrowLeftRight,
      color: "bg-purple-500",
      stats: { count: 23, label: "Pending" },
    },
    {
      name: "Inter Company Transfer",
      description: "Transfer inventory across companies",
      route: "/flow-tool/inventory/inter-company-transfer",
      icon: ArrowUpDown,
      color: "bg-orange-500",
      stats: { count: 7, label: "In Transit" },
    },
    {
      name: "Scraps",
      description: "Manage damaged or obsolete inventory",
      route: "/flow-tool/inventory/scrap",
      icon: Trash2,
      color: "bg-red-500",
      stats: { count: 15, label: "Items" },
    },
    {
      name: "Vendors",
      description: "Manage supplier relationships",
      route: "/flow-tool/inventory/vendors",
      icon: Store,
      color: "bg-indigo-500",
      stats: { count: 34, label: "Vendors" },
    },
  ];

  const overviewStats = [
    {
      label: "Total Stock Value",
      value: "$245,678",
      change: "+12.5%",
      trend: "up",
      icon: Package,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Low Stock Items",
      value: "43",
      change: "+8 from last week",
      trend: "warning",
      icon: AlertTriangle,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      label: "Stock In",
      value: "156",
      change: "+18.2%",
      trend: "up",
      icon: TrendingUp,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Stock Out",
      value: "89",
      change: "-5.4%",
      trend: "down",
      icon: TrendingDown,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  // Chart Data
  const stockTrendData = [
    { month: "Jan", stockIn: 120, stockOut: 80, value: 45000 },
    { month: "Feb", stockIn: 150, stockOut: 95, value: 52000 },
    { month: "Mar", stockIn: 180, stockOut: 110, value: 58000 },
    { month: "Apr", stockIn: 140, stockOut: 100, value: 51000 },
    { month: "May", stockIn: 200, stockOut: 130, value: 65000 },
    { month: "Jun", stockIn: 156, stockOut: 89, value: 71000 },
  ];

  const categoryDistribution = [
    { name: "Electronics", value: 35, count: 450 },
    { name: "Furniture", value: 25, count: 320 },
    { name: "Accessories", value: 20, count: 260 },
    { name: "Supplies", value: 15, count: 195 },
    { name: "Others", value: 5, count: 65 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  const warehousePerformance = [
    { name: "Main", capacity: 85, utilization: 72 },
    { name: "North", capacity: 70, utilization: 65 },
    { name: "South", capacity: 90, utilization: 78 },
    { name: "East", capacity: 60, utilization: 45 },
    { name: "West", capacity: 75, utilization: 68 },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Inventory Dashboard
        </h1>
        <p className="text-slate-600">
          Comprehensive overview of your inventory management system
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Stock Trend Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Stock Movement Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stockTrendData}>
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
                dataKey="stockIn"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIn)"
                name="Stock In"
              />
              <Area
                type="monotone"
                dataKey="stockOut"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOut)"
                name="Stock Out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Inventory by Category
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {categoryDistribution.map((category, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {category.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {category.count} items ({category.value}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warehouse Performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Warehouse Capacity & Utilization
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={warehousePerformance}>
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
              <Bar
                dataKey="capacity"
                fill="#94a3b8"
                radius={[8, 8, 0, 0]}
                name="Capacity %"
              />
              <Bar
                dataKey="utilization"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                name="Utilization %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Value Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Stock Value Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockTrendData}>
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
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
                name="Total Value"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <Link
              key={index}
              href={module.route}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 ${module.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                  {module.stats.count} {module.stats.label}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {module.name}
              </h3>
              <p className="text-sm text-slate-600">{module.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
