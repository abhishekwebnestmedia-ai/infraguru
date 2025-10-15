import React from 'react'
import { FileIcon, FilePlus, FilePlus2 } from "lucide-react";
import PieChartSection from './PieChartSection';
import MembersAttendanceTable from './MembersAttendanceTable';
import TeamLeadsAssigned from './TeamLeadsAssigned';
import FreshLeads from './FreshLeads';
import { toast, ToastContainer } from 'react-toastify';
import DashboardHeader from './DashboardHeader';

const handleAddLead = () => {
  toast.success("lead added successfully!")
}

const HomeDashboard = () => {
  return (
    <div className="w-full">
      {/* Header with buttons */}
      <DashboardHeader/>

      {/* Pie Chart & Attendance Table */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
        <div className="bg-white mt-4 p-3 md:p-5 rounded-3xl">
          <PieChartSection />
        </div>
        <div className="bg-white md:mt-4 p-3 md:p-5 rounded-3xl">
          <MembersAttendanceTable />
        </div>
      </section>

      {/* Additional Sections */}
      <TeamLeadsAssigned className="mt-4 md:mt-4" />
      <FreshLeads />


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default HomeDashboard
