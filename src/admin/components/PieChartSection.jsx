import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import BarChart from "./BarChart";
import api from "../../shared/services/apiService";

export default function PieChartSection() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/lead/dashLeads');
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white md:p-6 p-2 rounded-2xl flex items-center justify-center w-full h-full min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white md:p-6 p-2 rounded-2xl flex flex-col items-center justify-center w-full h-full min-h-[300px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading data</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-white md:p-6 p-2 rounded-2xl flex items-center justify-center w-full h-full min-h-[300px]">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white  p-2 rounded-2xl w-full h-full">
      {/* Chart Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lead Analytics</h3>
          <p className="text-sm text-gray-600">Distribution of lead statuses</p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <BarChart
          status2="Follow Ups"
          color2="var(--TotalFollowUps)"
          value2={dashboardData["Follow Ups"] || 0}

          status3="Not Connected"
          color3="var(--notInterested)"
          value3={dashboardData["Not Connected"] || 0}

          status4="Prospect"
          color4="var(--Prospect)"
          value4={dashboardData["Prospect"] || 0}

          status5="Closer"
          color5="var(--Closer)"
          value5={dashboardData["Closer"] || 0}
        />
      </div>
    </div>
  );
}
