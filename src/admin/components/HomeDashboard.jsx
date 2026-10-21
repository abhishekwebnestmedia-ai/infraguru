import React from 'react'
import { FileIcon, FilePlus, FilePlus2 } from "lucide-react";
import PieChartSection from './PieChartSection';
import MembersAttendanceTable from './MembersAttendanceTable';
import TeamLeadsAssigned from './TeamLeadsAssigned';
import FreshLeads from './FreshLeads';
import { ToastContainer } from 'react-toastify';
import DashboardHeader from './DashboardHeader';

const _handleAddLead = () => {
  // placeholder for future add-lead action
}

const HomeDashboard = () => {
  return (
    <div className="w-full space-y-6">
      {/* Header with buttons */}
      <div className="animate-fade-in-down">
        <DashboardHeader/>
      </div>

      {/* Bar Chart & Attendance Table */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-6">
        <div className="bg-white  p-3 md:p-5 rounded-xl col-span-2 animate-fade-in-left animate-delay-100 card-hover">
          <PieChartSection />
        </div>
        <div className="bg-white  p-3 md:p-5 rounded-xl col-span-3 flex flex-col animate-fade-in-right animate-delay-200 card-hover">
          <MembersAttendanceTable />
        </div>
      </section>

      {/* Additional Sections */}
      <div className="animate-fade-in-up animate-delay-300">
        <TeamLeadsAssigned className="" />
      </div>
      <div className="animate-fade-in-up animate-delay-400">
        <FreshLeads />
      </div>


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
