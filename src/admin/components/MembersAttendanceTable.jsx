import React, { useState, useEffect } from "react";
import { ArrowUpRight, Filter, Info, RefreshCw } from "lucide-react";
import api from "../../shared/services/apiService";
import { toast } from "react-toastify";


const MembersAttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/auth/activeuser');
      
      if (response.data.success) {
        setAttendanceData(response.data.users || []);
      }
    } catch (err) {
      console.error('Error fetching active users:', err);
      setError(err.response?.data?.message || 'Failed to load attendance data');
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (isLoggedIn) => {
    if (isLoggedIn) {
      return <div className="w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full"></div>;
    } else {
      return (
        <div className="flex items-center justify-center">
          <Info size={16} className="text-red-500 lg:w-5 lg:h-5" />
        </div>
      );
    }
  };


  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 lg:mb-6">
        <h2 className="font-semibold text-[var(--darkBlue)] text-lg lg:text-xl">
          Members Attendance ({attendanceData.length})
        </h2>
        <div className="flex gap-4 lg:gap-6 text-sm lg:text-base">
          <button 
            onClick={fetchActiveUsers}
            disabled={loading}
            className="flex items-center gap-1 lg:gap-2 text-[var(--darkBlue)] hover:text-blue-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={`lg:w-5 lg:h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
 
        </div>
      </div>


      {/* Table Container - Responsive with horizontal scroll on mobile */}
      <div className="bg-[#F4F6FF] rounded-xl overflow-hidden lg:rounded-2xl">
        <div className="overflow-x-auto">
          <div
            className="overflow-y-auto min-w-full lg:min-w-0 scrollbar-hide"
            style={{ height: '270px' }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-[var(--darkBlue)] text-sm">Loading attendance...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Info size={40} className="text-red-500 mx-auto mb-3" />
                  <p className="text-red-500 mb-3">{error}</p>
                  <button 
                    onClick={fetchActiveUsers}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : attendanceData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-[var(--darkBlue)] text-sm">No attendance data available</p>
              </div>
            ) : (
              <table className="w-full text-sm lg:text-base min-w-[600px] lg:min-w-full">
                <thead className="sticky top-0 bg-[#F4F6FF] z-10 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 lg:py-3 text-left text-xs lg:text-sm font-medium text-[var(--darkBlue)] uppercase tracking-wider h-12 lg:h-14">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-3 text-left text-xs lg:text-sm font-medium text-[var(--darkBlue)] uppercase tracking-wider h-12 lg:h-14">
                      Name
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-3 text-left text-xs lg:text-sm font-medium text-[var(--darkBlue)] uppercase tracking-wider h-12 lg:h-14">
                      Email
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-3 text-left text-xs lg:text-sm font-medium text-[var(--darkBlue)] uppercase tracking-wider h-12 lg:h-14">
                      Phone No.
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#F4F6FF] divide-y divide-gray-100">
                  {attendanceData.map((member) => (
                    <tr
                      key={member._id}
                      className="hover:bg-blue-50 transition-colors h-12 lg:h-14"
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(member.isLoggedIn)}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <div className="font-medium text-[var(--darkBlue)] lg:font-semibold">
                          {member.name}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <div className="text-[var(--darkBlue)]">
                          {member.email}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <div className="text-[var(--darkBlue)]">
                          {member.phoneNumber || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};


export default MembersAttendanceTable;
