import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, SquareCheck, Plus, SquareCheckBig, Pencil, Trash, Square } from 'lucide-react';
import TableView from './TableView';

const EmployeeDetail = () => {
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock leads data - exactly matching the image
    const totalEntries = 32; // Total entries from the image
    const totalPages = Math.ceil(totalEntries / itemsPerPage);
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

    // Table columns configuration
    const columns = [
        { key: 'checkbox', label: '', width: '50px' },
        { key: 'sNo', label: 'S.NO', width: '60px' },
        { key: 'source', label: 'SOURCE', width: '100px' },
        { key: 'executiveName', label: 'EXECUTIVE NAME', width: '150px' },
        { key: 'assignedTo', label: 'ASSIGNED TO', width: '120px' },
        { key: 'transferTo', label: 'TRANSFER TO', width: '120px' },
        { key: 'capturedBy', label: 'CAPTURED BY', width: '120px' },
        { key: 'date', label: 'DATE', width: '120px' },
        { key: 'clientName', label: 'CLIENT NAME', width: '150px' },
        { key: 'contactNo', label: 'CONTACT NUMBER', width: '150px' },
        { key: 'emailId', label: 'E-MAIL ID', width: '200px' },
        { key: 'budget', label: 'BUDGET', width: '100px' },
        { key: 'location', label: 'LOCATION', width: '250px' },
        { key: 'projects', label: 'PROJECTS', width: '150px' },
        { key: 'remark', label: 'REMARK', width: '200px' },
        { key: 'action', label: 'Action', width: '100px' }
    ];

    const renderPaginationButtons = () => {
        const pages = [];
        const maxVisible = 4;

        for (let i = 1; i <= Math.min(totalPages, maxVisible); i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex flex-col gap-5 ">
            {/* Header */}
            <div className="flex items-center justify-between  ">
                <h1 className="text-2xl font-medium text-[#020619]">
                    Rajat Choudhary
                </h1>
                <button
                    className="px-4 py-2 bg-white text-[var(--blue600)] rounded-lg hover:bg-[var(--blue600)] hover:text-white transition-colors flex items-center gap-2 border border-[var(--blue600)]"
                >
                    <Plus size={16} />
                    <span>Add Bulk Leads</span>
                </button>
            </div>

            <TableView/>

        </div>
    );
};

export default EmployeeDetail;
