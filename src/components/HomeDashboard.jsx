import React from 'react'
import { FileIcon, FilePlus, FilePlus2 } from "lucide-react";
import PieChartSection from './PieChartSection';
import MembersAttendanceTable from './MembersAttendanceTable';
import TeamLeadsAssigned from './TeamLeadsAssigned';
import FreshLeads from './FreshLeads';

const HomeDashboard = () => {
  return (
    <div className="w-full">
      {/* Header with buttons */}
      <div className="flex justify-between items-center ">
        <h2 className="font-semibold text-2xl">Dashboard</h2>
        <div className="flex gap-5">
          <button className="w-40 px-4 py-2 text-[var(--blue700)] flex items-center justify-center gap-2 border border-[var(--blue700)] rounded hover:bg-[var(--blue700)] hover:text-white">
            Assign Lead
            <FilePlus size={14}/>
          </button>

          <button className="w-40 px-4 py-2 text-[var(--blue700)] flex items-center justify-center gap-2 border border-[var(--blue700)] rounded hover:bg-[var(--blue700)] hover:text-white">
            Add Bulk Lead{" "}
            <span>
              <FilePlus2 size={14} />
            </span>
          </button>

          <button className="w-40 px-4 py-2 text-[var(--blue700)] flex items-center justify-center gap-2 border border-[var(--blue700)] rounded hover:bg-[var(--blue700)] hover:text-white">
            Add Lead{" "}
            <span>
              <FilePlus2 size={14} />
            </span>
          </button>
        </div>

      </div>

      {/* Pie Chart & Attendance Table */}
      <section className="flex justify-between gap-6">
        <div className="w-1/2  bg-white mt-4 p-5 rounded-3xl">
          <PieChartSection />
        </div>
        <div className="w-1/2 bg-white mt-4 p-5 rounded-3xl">
          <MembersAttendanceTable />
        </div>
        
      </section>


      {/* Additional Sections */}
      {/* <section>
        <OverallLeadsDetails />
      </section> */}
      <TeamLeadsAssigned />

      {/* <section className="mt-9">

        <TodaysTask isDashboard={true} />
      </section> */}
      <FreshLeads />
    </div>
  )
}

export default HomeDashboard