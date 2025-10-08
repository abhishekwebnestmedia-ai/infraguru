import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, SquareCheckBig, Pencil, Trash, Square } from 'lucide-react';

const TableView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock leads data - I'll add more entries to demonstrate pagination
    const allLeads = [
        {
            id: 1,
            sNo: "01",
            source: "Meta",
            executiveName: "Tushar",
            assignedTo: "Rajat",
            transferTo: "Tarun",
            capturedBy: "Mohit",
            date: "31 July 25",
            clientName: "Shashank Panchpal",
            contactNo: "+91 8171839997",
            emailId: "tusharmegi.11.in@gmail.com",
            budget: "20cr",
            location: "1st Floor Orchid Business Park, Near Sub...",
            projects: "Shashank Panchpal",
            remark: "Lorem ipsum dolor sit amet conse...",
            isSelected: false
        },
        {
            id: 2,
            sNo: "01",
            source: "Meta",
            executiveName: "Tushar",
            assignedTo: "Rajat",
            transferTo: "Tarun",
            capturedBy: "Mohit",
            date: "31 July 25",
            clientName: "Shashank Panchpal",
            contactNo: "+91 8171839997",
            emailId: "tusharmegi.11.in@gmail.com",
            budget: "20cr",
            location: "1st Floor Orchid Business Park, Near Sub...",
            projects: "Shashank Panchpal",
            remark: "Lorem ipsum dolor sit amet conse...",
            isSelected: false
        },
        {
            id: 3,
            sNo: "01",
            source: "Meta",
            executiveName: "Tushar",
            assignedTo: "Rajat",
            transferTo: "Tarun",
            capturedBy: "Mohit",
            date: "31 July 25",
            clientName: "Shashank Panchpal",
            contactNo: "+91 8171839997",
            emailId: "tusharmegi.11.in@gmail.com",
            budget: "20cr",
            location: "1st Floor Orchid Business Park, Near Sub...",
            projects: "Shashank Panchpal",
            remark: "Lorem ipsum dolor sit amet conse...",
            isSelected: false
        },
        {
            id: 4,
            sNo: "01",
            source: "Meta",
            executiveName: "Tushar",
            assignedTo: "Rajat",
            transferTo: "Tarun",
            capturedBy: "Mohit",
            date: "31 July 25",
            clientName: "Shashank Panchpal",
            contactNo: "+91 8171839997",
            emailId: "tusharmegi.11.in@gmail.com",
            budget: "20cr",
            location: "1st Floor Orchid Business Park, Near Sub...",
            projects: "Shashank Panchpal",
            remark: "Lorem ipsum dolor sit amet conse...",
            isSelected: false
        },
        {
            id: 5,
            sNo: "01",
            source: "Meta",
            executiveName: "Tushar",
            assignedTo: "Rajat",
            transferTo: "Tarun",
            capturedBy: "Mohit",
            date: "31 July 25",
            clientName: "Shashank Panchpal",
            contactNo: "+91 8171839997",
            emailId: "tusharmegi.11.in@gmail.com",
            budget: "20cr",
            location: "1st Floor Orchid Business Park, Near Sub...",
            projects: "Shashank Panchpal",
            remark: "Lorem ipsum dolor sit amet conse...",
            isSelected: false
        },
        {
            id: 6,
            sNo: "01",
            source: "Meta",
            executiveName: "Tushar",
            assignedTo: "Rajat",
            transferTo: "Tarun",
            capturedBy: "Mohit",
            date: "31 July 25",
            clientName: "Shashank Panchpal",
            contactNo: "+91 8171839997",
            emailId: "tusharmegi.11.in@gmail.com",
            budget: "20cr",
            location: "1st Floor Orchid Business Park, Near Sub...",
            projects: "Shashank Panchpal",
            remark: "Lorem ipsum dolor sit amet conse...",
            isSelected: false
        },
        {
            id: 7,
            sNo: "01",
            source: "Meta",
            executiveName: "Tushar",
            assignedTo: "Rajat",
            transferTo: "Tarun",
            capturedBy: "Mohit",
            date: "31 July 25",
            clientName: "Shashank Panchpal",
            contactNo: "+91 8171839997",
            emailId: "tusharmegi.11.in@gmail.com",
            budget: "20cr",
            location: "1st Floor Orchid Business Park, Near Sub...",
            projects: "Shashank Panchpal",
            remark: "Lorem ipsum dolor sit amet conse...",
            isSelected: false
        },
        {
            id: 8,
            sNo: "01",
            source: "Meta",
            executiveName: "Tushar",
            assignedTo: "Rajat",
            transferTo: "Tarun",
            capturedBy: "Mohit",
            date: "31 July 25",
            clientName: "Shashank Panchpal",
            contactNo: "+91 8171839997",
            emailId: "tusharmegi.11.in@gmail.com",
            budget: "20cr",
            location: "1st Floor Orchid Business Park, Near Sub...",
            projects: "Shashank Panchpal",
            remark: "Lorem ipsum dolor sit amet conse...",
            isSelected: false
        },
        {
            id: 9,
            sNo: "01",
            source: "Meta",
            executiveName: "Tushar",
            assignedTo: "Rajat",
            transferTo: "Tarun",
            capturedBy: "Mohit",
            date: "31 July 25",
            clientName: "Shashank Panchpal",
            contactNo: "+91 8171839997",
            emailId: "tusharmegi.11.in@gmail.com",
            budget: "20cr",
            location: "1st Floor Orchid Business Park, Near Sub...",
            projects: "Shashank Panchpal",
            remark: "Lorem ipsum dolor sit amet conse...",
            isSelected: false
        },
        {
            id: 10,
            sNo: "01",
            source: "Meta",
            executiveName: "Tushar",
            assignedTo: "Rajat",
            transferTo: "Tarun",
            capturedBy: "Mohit",
            date: "31 July 25",
            clientName: "Shashank Panchpal",
            contactNo: "+91 8171839997",
            emailId: "tusharmegi.11.in@gmail.com",
            budget: "20cr",
            location: "1st Floor Orchid Business Park, Near Sub...",
            projects: "Shashank Panchpal",
            remark: "Lorem ipsum dolor sit amet conse...",
            isSelected: false
        },
        {
            id: 11,
            sNo: "01",
            source: "Meta",
            executiveName: "Tushar",
            assignedTo: "Rajat",
            transferTo: "Tarun",
            capturedBy: "Mohit",
            date: "31 July 25",
            clientName: "Shashank Panchpal",
            contactNo: "+91 8171839997",
            emailId: "tusharmegi.11.in@gmail.com",
            budget: "20cr",
            location: "1st Floor Orchid Business Park, Near Sub...",
            projects: "Shashank Panchpal",
            remark: "Lorem ipsum dolor sit amet conse...",
            isSelected: false
        },
    ];

    // Calculate pagination values based on actual array length
    const totalEntries = allLeads.length;
    const totalPages = Math.ceil(totalEntries / itemsPerPage);

    // Calculate which entries to show for current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allLeads.slice(indexOfFirstItem, indexOfLastItem);

    const startEntry = indexOfFirstItem + 1;
    const endEntry = Math.min(indexOfLastItem, totalEntries);

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
        <div className="scrollbar-hide">
            {/* Table Container */}
            <div className="bg-white rounded-2xl overflow-hidden">
                {/* Table */}
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full border-collapse">
                        {/* Header */}
                        <thead style={{ backgroundColor: '#FAFBFC' }}>
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="text-left py-4 px-4 font-normal border-b border-gray-200 whitespace-nowrap"
                                        style={{
                                            color: '#656972',
                                            width: column.width,
                                            minWidth: column.width
                                        }}
                                    >
                                        {column.key === 'checkbox' ? (
                                            <Square
                                                size={20}
                                                className="text-gray-400 cursor-pointer hover:text-gray-600"
                                            />
                                        ) : (
                                            column.label
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Body  */}
                        <tbody className="bg-white">
                            {currentItems.map((lead, index) => (
                                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    {columns.map((column) => (
                                        <td
                                            key={`${lead.id}-${column.key}`}
                                            className="py-4 px-4"
                                            style={{
                                                color: '#051226',
                                                width: column.width,
                                                minWidth: column.width
                                            }}
                                        >
                                            {column.key === 'checkbox' ? (
                                                <SquareCheckBig
                                                    size={20}
                                                    className="text-gray-400 cursor-pointer hover:text-gray-600"
                                                />
                                            ) : column.key === 'budget' ? (
                                                <span className="px-2 py-1 border border-[var(--blue400)] bg-[var(--blue200)] text-blue-800 rounded-2xl text-xs font-medium w-20 inline-block text-center ">
                                                    {lead[column.key]}
                                                </span>
                                            ) : column.key === 'action' ? (
                                                <div className="flex items-center gap-2">
                                                    <button className="text-green-600 hover:text-green-800">
                                                        <Pencil size={20} />
                                                    </button>

                                                    {/* Vertical Divider */}
                                                    <div className="border-l border-[#EEF2F6] h-5"></div>

                                                    <button className="text-red-600 hover:text-red-800">
                                                        <Trash size={20} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="truncate block" style={{ maxWidth: column.width }}>
                                                    {lead[column.key]}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left side - Entry count */}
                <div className="text-sm text-gray-600">
                    Showing {startEntry}-{endEntry} out of {totalEntries} Entries
                </div>

                {/* Right side - Pagination controls */}
                <div className="flex items-center gap-2">
                    {/* Previous button */}
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="p-2 rounded-lg hover:scale-110 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <ChevronLeft size={16} className="text-gray-600 hover:text-blue-600" />
                    </button>


                    {/* Page numbers */}
                    {renderPaginationButtons().map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Next button */}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        // disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:scale-110 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <ChevronRight size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableView;
