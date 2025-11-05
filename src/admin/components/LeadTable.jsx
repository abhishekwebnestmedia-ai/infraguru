import React from 'react'
import EmployeeDetail from './EmployeeDetail'
import { FilePlus, FilePlus2, Plus, PlusCircle, Table, Upload } from 'lucide-react'
import TableView from './TableView'
import DashboardHeader from './DashboardHeader'
import { ToastContainer } from 'react-toastify';

const LeadTable = () => {
    return (
        <div className='flex flex-col gap-4'>
            {/* Header with buttons */}
            <DashboardHeader />

            <TableView />

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

export default LeadTable
