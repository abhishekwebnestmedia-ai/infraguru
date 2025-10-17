import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, SquareCheck, Plus, SquareCheckBig, Pencil, Trash, Square, ChevronDown, ChevronUp, User, Mail, Smartphone, IdCardLanyard, Fingerprint, BookUser, HeartHandshake } from 'lucide-react';
import TableView from './TableView';

const EmployeeDetail = () => {
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileDetails, setShowMobileDetails] = useState(false);
    const itemsPerPage = 10;

    // Get employee data (same logic as sidebar)
    const getEmployeeById = (empId) => {
        const employees = {
            1: { name: "Arjun Sharma", designation: "Senior Developer", empId: "007", email: "arjun@infraguru.com", phone: "+91 8171 839 997", leadsAssigned: 12333, successfulLeads: 42333 },
            2: { name: "Priya Patel", designation: "UI/UX Designer", empId: "008", email: "priya@infraguru.com", phone: "+91 8171 839 998", leadsAssigned: 10500, successfulLeads: 38200 },
            3: { name: "Rajesh Kumar", designation: "Project Manager", empId: "009", email: "rajesh@infraguru.com", phone: "+91 8171 839 999", leadsAssigned: 15600, successfulLeads: 51000 },
        };
        return employees[empId] || { name: "Shashank", designation: "Employee", empId: "007", email: "Rajat@infraguru.com", phone: "+91 8171 839 997", leadsAssigned: 12333, successfulLeads: 42333 };
    };

    const employee = getEmployeeById(id);

    // Mock leads data - exactly matching the image
    const totalEntries = 32;
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
        <div className="flex flex-col gap-2 md:gap-5">
            {/* Mobile Employee Details Dropdown - Only visible on mobile */}
            <div className="md:hidden mb-4">
                <button
                    onClick={() => setShowMobileDetails(!showMobileDetails)}
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                            <User size={16} className="text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-[#002A80]">Employee Details</p>
                            <p className="text-xs text-[#002A8060]">{employee.name}</p>
                        </div>
                    </div>
                    {showMobileDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {/* Mobile Dropdown Content */}
                {showMobileDetails && (
                    <div className="mt-2 bg-white rounded-lg border border-gray-200 p-3 space-y-3">
                        {/* Name */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{employee.name}</p>
                                <p className="text-xs text-[#002A8060]">Name</p>
                            </div>
                        </div>

                        {/* Designation */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <IdCardLanyard size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{employee.designation}</p>
                                <p className="text-xs text-[#002A8060]">Designation</p>
                            </div>
                        </div>

                        {/* Employee ID */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <Fingerprint size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{employee.empId}</p>
                                <p className="text-xs text-[#002A8060]">Employee ID</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <Mail size={16} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#002A80] truncate">{employee.email}</p>
                                <p className="text-xs text-[#002A8060]">Email</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <Smartphone size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{employee.phone}</p>
                                <p className="text-xs text-[#002A8060]">Phone No.</p>
                            </div>
                        </div>

                        {/* Leads Assigned */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <BookUser size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{employee.leadsAssigned.toLocaleString()}</p>
                                <p className="text-xs text-[#002A8060]">Leads Assigned</p>
                            </div>
                        </div>

                        {/* Successful Leads */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <HeartHandshake size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{employee.successfulLeads.toLocaleString()}</p>
                                <p className="text-xs text-[#002A8060]">Successful Leads</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-xl md:section-heading font-medium text-[#020619]">
                    {employee.name}
                </h1>
                <button
                    className="w-full sm:w-auto px-4 py-2 bg-white text-[var(--blue600)] rounded-lg hover:bg-[var(--blue600)] hover:text-white transition-colors flex items-center justify-center gap-2 border border-[var(--blue600)] text-sm"
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
