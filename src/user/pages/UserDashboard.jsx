import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../shared/hooks/useAuth";
import { useNotifications } from "../../shared/hooks/useNotifications";
import api from "../../shared/services/apiService";

import {
  Home,
  Target,
  BarChart3,
  Activity,
  PieChart,
  TrendingUp,
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get("/dashboard/summary");

        // ✅ safer assignment
        const payload = response?.data?.data ?? response?.data ?? null;
        setDashboardData(payload);
      } catch (err) {
        setError(err?.message || "Failed to fetch dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name || "User"}!
            </h1>
            <p className="text-gray-600">
              Here&apos;s what&apos;s happening with your work today.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats Cards */}
      <DashboardStats data={dashboardData} isLoading={isLoading} error={error} />

      {/* Dashboard Charts */}
      <DashboardCharts data={dashboardData} isLoading={isLoading} />
    </div>
  );
};

// ✅ Dashboard Stats Component
const DashboardStats = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-lg">!</span>
          </div>
          <div>
            <p className="text-red-800 font-semibold">
              Error loading dashboard data
            </p>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      title: "Total Leads",
      value: Number(data?.totals?.leads || 0),
      icon: Target,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Total Inventory",
      value: Number(data?.totals?.inventory || 0),
      icon: BarChart3,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Overall Total",
      value: Number(data?.totals?.overall || 0),
      icon: Activity,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                {stat.value.toLocaleString()}
              </p>
            </div>

            <div
              className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon size={28} className={stat.textColor} />
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  stat.color === "blue"
                    ? "bg-blue-500"
                    : stat.color === "green"
                    ? "bg-green-500"
                    : "bg-purple-500"
                }`}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ✅ Dashboard Charts Component
const DashboardCharts = ({ data, isLoading }) => {
  if (isLoading || !data) return null;

  const leadsTotal = Number(data?.leads?.total || 0);
  const inventoryTotal = Number(data?.inventory?.total || 0);

  // ✅ Prepare data for charts
  const leadsStatusData = data?.leads?.statusBreakdown
    ? Object.entries(data.leads.statusBreakdown).map(([key, value]) => ({
        name: key,
        value: Number(value || 0),
        percentage:
          leadsTotal > 0 ? ((Number(value || 0) / leadsTotal) * 100).toFixed(1) : "0.0",
      }))
    : [];

  const inventoryStatusData = data?.inventory?.statusBreakdown
    ? Object.entries(data.inventory.statusBreakdown).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: Number(value || 0),
        percentage:
          inventoryTotal > 0
            ? ((Number(value || 0) / inventoryTotal) * 100).toFixed(1)
            : "0.0",
      }))
    : [];

  const inventoryTypeData = data?.inventory?.typeBreakdown
    ? Object.entries(data.inventory.typeBreakdown)
        .filter(([_, value]) => Number(value) > 0)
        .map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: Number(value || 0),
          percentage:
            inventoryTotal > 0
              ? ((Number(value || 0) / inventoryTotal) * 100).toFixed(1)
              : "0.0",
        }))
    : [];

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Status Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PieChart size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Leads Status Breakdown
              </h3>
              <p className="text-sm text-gray-600">
                Distribution of lead statuses
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {leadsStatusData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                        ? "bg-green-500"
                        : index === 2
                        ? "bg-yellow-500"
                        : "bg-purple-500"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{leadsTotal}</p>
              <p className="text-xs text-blue-600 font-medium">Total Leads</p>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {leadsStatusData.length > 0 ? leadsStatusData[0]?.value || 0 : 0}
              </p>
              <p className="text-xs text-green-600 font-medium">Top Status</p>
            </div>
          </div>
        </div>

        {/* Inventory Status Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-green-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Inventory Status
              </h3>
              <p className="text-sm text-gray-600">
                Current inventory breakdown
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {inventoryStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === 0
                        ? "bg-green-500"
                        : index === 1
                        ? "bg-blue-500"
                        : index === 2
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {inventoryTotal}
              </p>
              <p className="text-sm text-green-600 font-medium">
                Total Inventory
              </p>
            </div>
          </div>
        </div>

        {/* Property Type Distribution */}
        {inventoryTypeData.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Property Type Distribution
                  </h3>
                  <p className="text-sm text-gray-600">
                    Inventory breakdown by property categories
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">
                  Total Properties
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {inventoryTotal}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {inventoryTypeData.map((item, index) => {
                const colors = [
                  { bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-600" },
                  { bg: "bg-green-500", light: "bg-green-100", text: "text-green-600" },
                  { bg: "bg-purple-500", light: "bg-purple-100", text: "text-purple-600" },
                  { bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-600" },
                  { bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-600" },
                  { bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-600" },
                ];

                const color = colors[index % colors.length];

                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 ${color.light} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                        >
                          <div className={`w-3 h-3 ${color.bg} rounded-full`} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.value} properties
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-sm font-bold ${color.text}`}>
                          {item.percentage}%
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${color.bg} rounded-full transition-all duration-1000 ease-out group-hover:shadow-sm`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {inventoryTypeData.length}
                </p>
                <p className="text-xs text-gray-500">Active Types</p>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {inventoryTypeData.length > 0 ? inventoryTypeData[0]?.percentage : "0.0"}%
                </p>
                <p className="text-xs text-gray-500">Top Category</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Activity size={20} className="text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-600">Latest follow-ups and updates</p>
          </div>
        </div>

        <RecentFollowups />
      </div>
    </div>
  );
};

const RecentFollowups = () => {
  const { notifications, loading } = useNotifications();

  const followups = useMemo(() => {
    if (!Array.isArray(notifications)) return [];

    const isSameDay = (d1, d2) => {
      if (!d1 || !d2) return false;
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    };

    const today = new Date();

    return notifications
      .filter((n) => String(n.category || "").toLowerCase() === "followup")
      .map((n) => ({ ...n, _parsedDate: new Date(n.createdAt) }))
      .filter(
        (n) =>
          !isNaN(n._parsedDate.getTime()) && isSameDay(n._parsedDate, today)
      )
      .sort((a, b) => b._parsedDate - a._parsedDate)
      .slice(0, 6);
  }, [notifications]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Loading recent activity…
      </div>
    );
  }

  if (!followups || followups.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Home size={48} className="mx-auto mb-4 opacity-20" />
        <p>No recent follow-ups</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {followups.map((f) => (
        <li key={f._id} className="p-3 rounded-lg">
          <div className="text-sm text-gray-800 whitespace-pre-wrap">
            {f.message}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(f.createdAt).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserDashboard;
