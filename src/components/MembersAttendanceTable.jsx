import React from "react";
import { ArrowUpRight, Filter, Info } from "lucide-react";

const MembersAttendanceTable = () => {
  // Sample data to match the image
  const attendanceData = [
    {
      id: 1,
      status: "present",
      name: "Sahil Panchpal",
      email: "Sahilpanchpal@infra.com",
      phone: "+91 8171839997"
    },
    {
      id: 2,
      status: "absent",
      name: "Sahil Panchpal",
      email: "Sahilpanchpal@infra.com",
      phone: "+91 8171839997"
    },
    {
      id: 3,
      status: "absent",
      name: "Sahil Panchpal",
      email: "Sahilpanchpal@infra.com",
      phone: "+91 8171839997"
    },
    {
      id: 4,
      status: "absent",
      name: "Sahil Panchpal",
      email: "Sahilpanchpal@infra.com",
      phone: "+91 8171839997"
    },
    {
      id: 5,
      status: "present",
      name: "John Doe",
      email: "john.doe@infra.com",
      phone: "+91 9876543210"
    },
    {
      id: 6,
      status: "absent",
      name: "Jane Smith",
      email: "jane.smith@infra.com",
      phone: "+91 8765432109"
    },
    {
      id: 7,
      status: "present",
      name: "Mike Johnson",
      email: "mike.johnson@infra.com",
      phone: "+91 7654321098"
    },
    {
      id: 8,
      status: "absent",
      name: "Sarah Wilson",
      email: "sarah.wilson@infra.com",
      phone: "+91 6543210987"
    }
  ];

  const getStatusIcon = (status) => {
    if (status === "present") {
      return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
    } else {
      return (
        <div className="flex items-center justify-center">
          <Info size={16} className="text-red-500" />
        </div>
      );
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-[var(--darkBlue)] text-lg">
          Members Attendance
        </h2>
        <div className="flex gap-4 text-sm">
          <button className="flex items-center gap-1 text-[var(--darkBlue)] hover:text-blue-600 transition-colors">
            View All <ArrowUpRight size={16} />
          </button>
          <button className="flex items-center gap-1 text-[var(--darkBlue)] hover:text-blue-600 transition-colors">
            Filter <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Table Container - Height calculated for exactly 4 rows + header */}
      <div className="bg-[#F4F6FF] rounded-xl overflow-hidden">
        <div
          className="overflow-y-auto"
          style={{
            height: '270px', // Height for header (48px) + 4 rows (48px each) = 240px
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none',  /* IE and Edge */
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; /* Chrome, Safari and Opera */
            }
          `}</style>

          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F4F6FF] z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--darkBlue)] uppercase tracking-wider h-12">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--darkBlue)] uppercase tracking-wider h-12">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--darkBlue)] uppercase tracking-wider h-12">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--darkBlue)] uppercase tracking-wider h-12">
                  Phone No.
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#F4F6FF] divide-y divide-gray-100">
              {attendanceData.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-blue-50 transition-colors h-12"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(member.status)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-[var(--darkBlue)]">
                      {member.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-[var(--darkBlue)]">
                      {member.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-[var(--darkBlue)]">
                      {member.phone}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MembersAttendanceTable;
