import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import DonutChart from "./apexdonutchart";
import api from "../services/apiService";

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
    <div className="bg-white md:p-6 p-2 rounded-2xl w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Lead Status Overview</h3>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      
      <div className="flex items-center justify-around">
        <DonutChart
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
