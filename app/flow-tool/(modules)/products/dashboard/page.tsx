"use client";

import Link from "next/link";
import {
  Package,
  Layers,
  Tag,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Star,
  ShoppingCart,
  Box,
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

export default function ProductsDashboard() {
  const modules = [
    {
      name: "All Products",
      description: "View and manage all product listings",
      route: "/flow-tool/products/all",
      icon: Package,
      color: "bg-blue-500",
      stats: { count: 2847, label: "Active" },
    },
    {
      name: "Categories",
      description: "Organize products into categories",
      route: "/flow-tool/products/categories",
      icon: Layers,
      color: "bg-green-500",
      stats: { count: 48, label: "Categories" },
    },
    {
      name: "Brands",
      description: "Manage product brands and manufacturers",
      route: "/flow-tool/products/brands",
      icon: Tag,
      color: "bg-purple-500",
      stats: { count: 156, label: "Brands" },
    },
    {
      name: "Variants",
      description: "Handle product variations and options",
      route: "/flow-tool/products/variants",
      icon: Box,
      color: "bg-orange-500",
      stats: { count: 1243, label: "Variants" },
    },
    {
      name: "Pricing",
      description: "Set and manage product pricing rules",
      route: "/flow-tool/products/pricing",
      icon: DollarSign,
      color: "bg-indigo-500",
      stats: { count: 567, label: "Price Rules" },
    },
    {
      name: "Reviews",
      description: "Monitor customer product reviews",
      route: "/flow-tool/products/reviews",
      icon: Star,
      color: "bg-yellow-500",
      stats: { count: 3842, label: "Reviews" },
    },
  ];

  const overviewStats = [
    {
      label: "Total Products",
      value: "2,847",
      change: "+127 this month",
      trend: "up",
      icon: Package,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Average Rating",
      value: "4.6",
      change: "+0.3 points",
      trend: "up",
      icon: Star,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      label: "Out of Stock",
      value: "43",
      change: "-12 restocked",
      trend: "down",
      icon: AlertTriangle,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      label: "Total Value",
      value: "$8.4M",
      change: "+22.4%",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  // Chart Data
  const productGrowthData = [
    { month: "Jan", products: 2450, newProducts: 78, discontinued: 12 },
    { month: "Feb", products: 2516, newProducts: 82, discontinued: 16 },
    { month: "Mar", products: 2589, newProducts: 91, discontinued: 18 },
    { month: "Apr", products: 2662, newProducts: 95, discontinued: 22 },
    { month: "May", products: 2735, newProducts: 104, discontinued: 31 },
    { month: "Jun", products: 2847, newProducts: 127, discontinued: 15 },
  ];

  const categoryDistribution = [
    { name: "Electronics", value: 32, count: 911 },
    { name: "Fashion", value: 25, count: 712 },
    { name: "Home & Living", value: 18, count: 512 },
    { name: "Sports & Outdoors", value: 15, count: 427 },
    { name: "Others", value: 10, count: 285 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  const topSellingProducts = [
    { product: "Wireless Headphones", sold: 1847, revenue: 147760 },
    { product: "Smart Watch Pro", sold: 1523, revenue: 304600 },
    { product: "Running Shoes", sold: 1298, revenue: 103840 },
    { product: "Coffee Maker", sold: 1156, revenue: 92480 },
    { product: "Yoga Mat Premium", sold: 1024, revenue: 40960 },
  ];

  const priceRangeData = [
    { range: "$0-$50", count: 987, percentage: 35 },
    { range: "$51-$100", count: 854, percentage: 30 },
    { range: "$101-$200", count: 569, percentage: 20 },
    { range: "$201-$500", count: 285, percentage: 10 },
    { range: "$500+", count: 152, percentage: 5 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Products Dashboard
        </h1>
        <p className="text-slate-600">
          Manage your product catalog, pricing, and inventory metrics
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
        {/* Product Growth Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Product Growth Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={productGrowthData}>
              <defs>
                <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
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
                dataKey="products"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProducts)"
                name="Total Products"
              />
              <Line
                type="monotone"
                dataKey="newProducts"
                stroke="#10b981"
                strokeWidth={2}
                name="New Products"
                dot={{ fill: "#10b981", r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Products by Category
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
                      {category.count} items ({category.value}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Top Selling Products
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="product" stroke="#64748b" fontSize={12} angle={-45} textAnchor="end" height={100} />
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
              <Bar yAxisId="left" dataKey="sold" fill="#10b981" name="Units Sold" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill="#3b82f6" name="Revenue ($)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Price Range Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Price Range Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceRangeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis dataKey="range" type="category" stroke="#64748b" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" name="Products" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Module Cards */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Product Modules
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
