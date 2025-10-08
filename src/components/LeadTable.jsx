import React from 'react'
import EmployeeDetail from './EmployeeDetail'
import { FilePlus, FilePlus2, Plus, PlusCircle, Table, Upload } from 'lucide-react'
import TableView from './TableView'

const LeadTable = () => {
    return (
        <div className=' flex flex-col gap-4'>
            {/* Header with buttons */}
            <div className="flex justify-between items-center ">
                <h2 className="font-semibold text-2xl">Dashboard</h2>
                <div className="flex gap-5">
                    <button className="w-40 px-4 py-2 text-[var(--blue700)] flex items-center justify-center gap-2 border border-[var(--blue700)] rounded hover:bg-[var(--blue700)] hover:text-white">
                        Assign Lead
                        <FilePlus size={14} />
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

            <TableView/>
        </div>
    )
}

export default LeadTable