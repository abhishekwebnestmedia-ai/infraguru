import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  SquareCheckBig,
  Pencil,
  Trash,
  Square,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Status badge component with responsive width
const StatusBadge = ({ status }) => {
  const statusClassMap = {
    "Not Interested": "status-not-interested",
    "Prospect": "status-prospect",
    "Follow Ups": "status-follow-ups",
    "Closer": "status-closer",
  };

  const className = statusClassMap[status] || "";

  return (
    <span className={`${className} w-full sm:w-full md:w-full text-xs md:text-sm`}>
      {status}
    </span>
  );
};


const TableView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerms, setSearchTerms] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Date filter state
  const [dateFilterOption, setDateFilterOption] = useState("");
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [startDate, endDate] = customDateRange;

  // Columns with date sorting flags
  const columns = [
    { key: "checkbox", label: "", width: "50px", mobileWidth: "40px" },
    { key: "sNo", label: "S.NO", width: "60px", mobileWidth: "50px", sortable: true },
    { key: "source", label: "SOURCE", width: "100px", mobileWidth: "80px", sortable: true },
    { key: "executiveName", label: "EXECUTIVE", width: "150px", mobileWidth: "100px", sortable: true },
    { key: "assignedTo", label: "ASSIGNED", width: "120px", mobileWidth: "90px", sortable: true },
    { key: "transferTo", label: "TRANSFER", width: "120px", mobileWidth: "90px" },
    { key: "capturedBy", label: "CAPTURED", width: "120px", mobileWidth: "90px" },
    { key: "date", label: "DATE", width: "120px", mobileWidth: "90px", sortable: true, dateSorting: false },
    { key: "followUpDate", label: "FOLLOW UP", width: "120px", mobileWidth: "100px", sortable: true, dateSorting: true },
    { key: "status", label: "STATUS", width: "120px", mobileWidth: "100px", sortable: true },
    { key: "clientName", label: "CLIENT", width: "150px", mobileWidth: "120px", sortable: true },
    { key: "contactNo", label: "CONTACT", width: "150px", mobileWidth: "120px" },
    { key: "emailId", label: "EMAIL", width: "200px", mobileWidth: "150px" },
    { key: "budget", label: "BUDGET", width: "100px", mobileWidth: "80px" },
    { key: "location", label: "LOCATION", width: "250px", mobileWidth: "150px" },
    { key: "projects", label: "PROJECTS", width: "150px", mobileWidth: "100px" },
    { key: "remark", label: "REMARK", width: "200px", mobileWidth: "120px" },
    { key: "action", label: "ACTION", width: "100px", mobileWidth: "80px" },
  ];

  const statusOptions = ["Not Interested", "Prospect", "Follow Ups", "Closer"];

  // Sample data (keeping your existing data)
  const allLeads = [
    { id: 1, sNo: "01", source: "Meta", executiveName: "Tushar", assignedTo: "Rajat", transferTo: "Tarun", capturedBy: "Mohit", date: "01 Jan 25", followUpDate: "15 Feb 25", clientName: "Shashank P", contactNo: "+91 8171839991", emailId: "shashank1@gmail.com", budget: "10cr", location: "Orchid Business Park", projects: "Project A", remark: "Follow up needed", status: "Prospect", isSelected: false },
    { id: 2, sNo: "02", source: "LinkedIn", executiveName: "Ankit", assignedTo: "Rohit", transferTo: "Tarun", capturedBy: "Mohit", date: "02 Jan 25", followUpDate: "10 Mar 25", clientName: "Rohit K", contactNo: "+91 8171839992", emailId: "rohit.k@gmail.com", budget: "15cr", location: "Blue Plaza", projects: "Project B", remark: "Not interested", status: "Not Interested", isSelected: false },
    { id: 3, sNo: "03", source: "Google", executiveName: "Rahul", assignedTo: "Tushar", transferTo: "Rajat", capturedBy: "Mohit", date: "03 Jan 25", followUpDate: "20 Jan 25", clientName: "Priya S", contactNo: "+91 8171839993", emailId: "priya.s@gmail.com", budget: "20cr", location: "Green Complex", projects: "Project C", remark: "Interested", status: "Follow Ups", isSelected: false },
    { id: 4, sNo: "04", source: "Referral", executiveName: "Tushar", assignedTo: "Rajat", transferTo: "Tarun", capturedBy: "Mohit", date: "04 Jan 25", followUpDate: "18 Apr 25", clientName: "Ankit M", contactNo: "+91 8171839994", emailId: "ankit.m@gmail.com", budget: "5cr", location: "Silver Tower", projects: "Project D", remark: "Follow up needed", status: "Closer", isSelected: false },
    { id: 5, sNo: "05", source: "Meta", executiveName: "Rajat", assignedTo: "Tarun", transferTo: "Mohit", capturedBy: "Tushar", date: "05 Jan 25", followUpDate: "07 May 25", clientName: "Sonal P", contactNo: "+91 8171839995", emailId: "sonal.p@gmail.com", budget: "25cr", location: "Orchid Business Park", projects: "Project E", remark: "Interested", status: "Prospect", isSelected: false },
    { id: 6, sNo: "06", source: "LinkedIn", executiveName: "Tarun", assignedTo: "Rahul", transferTo: "Rajat", capturedBy: "Mohit", date: "06 Jan 25", followUpDate: "22 Jun 25", clientName: "Rohini K", contactNo: "+91 8171839996", emailId: "rohini.k@gmail.com", budget: "12cr", location: "Blue Plaza", projects: "Project F", remark: "Not interested", status: "Not Interested", isSelected: false },
    { id: 7, sNo: "07", source: "Google", executiveName: "Mohit", assignedTo: "Tushar", transferTo: "Tarun", capturedBy: "Rajat", date: "07 Jan 25", followUpDate: "05 Aug 25", clientName: "Vikram S", contactNo: "+91 8171839997", emailId: "vikram.s@gmail.com", budget: "18cr", location: "Green Complex", projects: "Project G", remark: "Follow up needed", status: "Follow Ups", isSelected: false },
    { id: 8, sNo: "08", source: "Referral", executiveName: "Tushar", assignedTo: "Rajat", transferTo: "Tarun", capturedBy: "Mohit", date: "08 Jan 25", followUpDate: "12 Sep 25", clientName: "Priya M", contactNo: "+91 8171839998", emailId: "priya.m@gmail.com", budget: "22cr", location: "Silver Tower", projects: "Project H", remark: "Interested", status: "Closer", isSelected: false },
    { id: 9, sNo: "09", source: "Meta", executiveName: "Ankit", assignedTo: "Tarun", transferTo: "Rohit", capturedBy: "Mohit", date: "09 Jan 25", followUpDate: "10 Oct 25", clientName: "Rahul P", contactNo: "+91 8171839999", emailId: "rahul.p@gmail.com", budget: "30cr", location: "Orchid Business Park", projects: "Project I", remark: "Follow up needed", status: "Prospect", isSelected: false },
    { id: 10, sNo: "10", source: "LinkedIn", executiveName: "Rohit", assignedTo: "Tushar", transferTo: "Tarun", capturedBy: "Rajat", date: "10 Jan 25", followUpDate: "15 Mar 25", clientName: "Neha S", contactNo: "+91 8171839981", emailId: "neha.s@gmail.com", budget: "8cr", location: "Blue Plaza", projects: "Project J", remark: "Not interested", status: "Not Interested", isSelected: false },
    { id: 11, sNo: "11", source: "Google", executiveName: "Rahul", assignedTo: "Rajat", transferTo: "Mohit", capturedBy: "Tushar", date: "11 Jan 25", followUpDate: "25 Feb 25", clientName: "Ankita P", contactNo: "+91 8171839982", emailId: "ankita.p@gmail.com", budget: "20cr", location: "Green Complex", projects: "Project K", remark: "Interested", status: "Follow Ups", isSelected: false },
    { id: 12, sNo: "12", source: "Referral", executiveName: "Tarun", assignedTo: "Rohit", transferTo: "Tushar", capturedBy: "Mohit", date: "12 Jan 25", followUpDate: "30 Jun 25", clientName: "Vikash M", contactNo: "+91 8171839983", emailId: "vikash.m@gmail.com", budget: "15cr", location: "Silver Tower", projects: "Project L", remark: "Follow up needed", status: "Closer", isSelected: false },
    { id: 13, sNo: "13", source: "Meta", executiveName: "Tushar", assignedTo: "Rajat", transferTo: "Tarun", capturedBy: "Mohit", date: "13 Jan 25", followUpDate: "12 Oct 25", clientName: "Rohit K", contactNo: "+91 8171839984", emailId: "rohit.k@gmail.com", budget: "18cr", location: "Orchid Business Park", projects: "Project M", remark: "Not interested", status: "Not Interested", isSelected: false },
    { id: 14, sNo: "14", source: "LinkedIn", executiveName: "Ankit", assignedTo: "Tushar", transferTo: "Rahul", capturedBy: "Mohit", date: "14 Jan 25", followUpDate: "20 Sep 25", clientName: "Priya S", contactNo: "+91 8171839985", emailId: "priya.s@gmail.com", budget: "12cr", location: "Blue Plaza", projects: "Project N", remark: "Interested", status: "Prospect", isSelected: false },
    { id: 15, sNo: "15", source: "Google", executiveName: "Rahul", assignedTo: "Rajat", transferTo: "Tarun", capturedBy: "Mohit", date: "15 Jan 25", followUpDate: "05 Aug 25", clientName: "Sonal P", contactNo: "+91 8171839986", emailId: "sonal.p@gmail.com", budget: "10cr", location: "Green Complex", projects: "Project O", remark: "Follow up needed", status: "Follow Ups", isSelected: false },
    { id: 16, sNo: "16", source: "Referral", executiveName: "Mohit", assignedTo: "Rohit", transferTo: "Tushar", capturedBy: "Tarun", date: "16 Jan 25", followUpDate: "18 Jul 25", clientName: "Neha K", contactNo: "+91 8171839987", emailId: "neha.k@gmail.com", budget: "25cr", location: "Silver Tower", projects: "Project P", remark: "Interested", status: "Closer", isSelected: false },
    { id: 17, sNo: "17", source: "Meta", executiveName: "Tushar", assignedTo: "Rajat", transferTo: "Tarun", capturedBy: "Mohit", date: "17 Jan 25", followUpDate: "12 Sep 25", clientName: "Vikram S", contactNo: "+91 8171839988", emailId: "vikram.s@gmail.com", budget: "8cr", location: "Orchid Business Park", projects: "Project Q", remark: "Not interested", status: "Not Interested", isSelected: false },
    { id: 18, sNo: "18", source: "LinkedIn", executiveName: "Ankit", assignedTo: "Tushar", transferTo: "Rahul", capturedBy: "Mohit", date: "18 Jan 25", followUpDate: "25 Aug 25", clientName: "Rohini M", contactNo: "+91 8171839989", emailId: "rohini.m@gmail.com", budget: "15cr", location: "Blue Plaza", projects: "Project R", remark: "Interested", status: "Prospect", isSelected: false },
    { id: 19, sNo: "19", source: "Google", executiveName: "Rahul", assignedTo: "Rajat", transferTo: "Tarun", capturedBy: "Mohit", date: "19 Jan 25", followUpDate: "02 Oct 25", clientName: "Ankita S", contactNo: "+91 8171839990", emailId: "ankita.s@gmail.com", budget: "20cr", location: "Green Complex", projects: "Project S", remark: "Follow up needed", status: "Follow Ups", isSelected: false },
    { id: 20, sNo: "20", source: "Referral", executiveName: "Mohit", assignedTo: "Rohit", transferTo: "Tushar", capturedBy: "Tarun", date: "20 Jan 25", followUpDate: "08 Sep 25", clientName: "Priya M", contactNo: "+91 8171839991", emailId: "priya.m@gmail.com", budget: "12cr", location: "Silver Tower", projects: "Project T", remark: "Interested", status: "Closer", isSelected: false },
  ];

  // Helper function to get date filter range (keeping your existing logic)
  const getDateRangeFromOption = (option) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    switch (option) {
      case "Today": {
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        return [start, end];
      }
      case "Yesterday": {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        const end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
        return [start, end];
      }
      case "Last 7 Days": {
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        return [startDate, endDate];
      }
      case "Last 30 Days": {
        const start = new Date(today);
        start.setDate(today.getDate() - 29);
        const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        return [startDate, endDate];
      }
      default:
        return [null, null];
    }
  };

  // Filter + Search + Sort logic (keeping your existing logic)
  const filteredItems = useMemo(() => {
    let items = allLeads;

    if (searchTerms.length > 0) {
      items = items.filter((item) =>
        searchTerms.every((term) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(term.toLowerCase())
          )
        )
      );
    }

    let dateColumn = columns.find((c) => c.dateSorting === true)?.key || "date";
    let rangeStart = startDate;
    let rangeEnd = endDate;

    if (dateFilterOption && dateFilterOption !== "Custom Range") {
      [rangeStart, rangeEnd] = getDateRangeFromOption(dateFilterOption);
    }

    if (rangeStart && rangeEnd) {
      items = items.filter((item) => {
        const itemDate = new Date(item[dateColumn]);
        return itemDate >= rangeStart && itemDate <= rangeEnd;
      });
    }

    if (sortConfig.key) {
      items = [...items].sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return items;
  }, [allLeads, searchTerms, sortConfig, startDate, endDate, dateFilterOption]);

  const totalEntries = filteredItems.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const startEntry = indexOfFirstItem + 1;
  const endEntry = Math.min(indexOfLastItem, totalEntries);

  // Search handlers (keeping your existing logic)
  const handleSort = (key, sortable) => {
    if (!sortable) return;
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchInput.trim();
    if (term && !searchTerms.includes(term)) {
      setSearchTerms([...searchTerms, term]);
    }
    setSearchInput("");
    setCurrentPage(1);
  };

  const handleRemoveSearch = (term) => {
    setSearchTerms(searchTerms.filter((t) => t !== term));
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const maxVisible = 4;
    for (let i = 1; i <= Math.min(totalPages, maxVisible); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="scrollbar-hide space-y-4">
      {/* Date Filter Dropdown - More compact on mobile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 my-4">
        <select
          value={dateFilterOption}
          onChange={(e) => {
            setDateFilterOption(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Date Filter</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="Custom Range">Custom Range</option>
        </select>

        {dateFilterOption === "Custom Range" && (
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setCustomDateRange(update);
              setCurrentPage(1);
            }}
            isClearable
            placeholderText="Select a date range"
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* Search Section - Mobile friendly */}
      <form onSubmit={handleSearchSubmit} className="flex sm:flex-row items-start sm:items-center gap-3">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Filter
        </button>
      </form>

      {/* Search Bubbles */}
      <div className="flex flex-wrap gap-2">
        {searchTerms.map((term, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            <span>{term}</span>
            <button
              onClick={() => handleRemoveSearch(term)}
              className="hover:text-red-500"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Responsive Table View - Always visible with horizontal scroll on mobile */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full border-collapse min-w-[1400px]">
            <thead style={{ backgroundColor: "#FAFBFC" }}>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left py-3 md:py-4 px-2 md:px-4 font-normal border-b border-gray-200 text-[#656972] whitespace-nowrap text-xs md:text-sm ${
                      col.sortable ? "cursor-pointer hover:text-blue-600" : ""
                    }`}
                    style={{ 
                      width: window.innerWidth < 768 ? col.mobileWidth : col.width, 
                      minWidth: window.innerWidth < 768 ? col.mobileWidth : col.width 
                    }}
                    onClick={() => handleSort(col.key, col.sortable)}
                  >
                    <div className="flex items-center gap-1">
                      {col.key === "checkbox" ? (
                        <Square
                          size={16}
                          className="text-gray-400 cursor-pointer hover:text-gray-600 md:w-5 md:h-5"
                        />
                      ) : (
                        <>
                          {col.label}
                          {sortConfig.key === col.key && (
                            <>
                              {sortConfig.direction === "asc" ? (
                                <ChevronUp size={12} className="md:w-[14px] md:h-[14px]" />
                              ) : (
                                <ChevronDown size={12} className="md:w-[14px] md:h-[14px]" />
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentItems.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  {columns.map((col) => (
                    <td
                      key={`${lead.id}-${col.key}`}
                      className="py-3 md:py-4 px-2 md:px-4 text-[#051226] text-xs md:text-sm"
                      style={{ 
                        width: window.innerWidth < 768 ? col.mobileWidth : col.width, 
                        minWidth: window.innerWidth < 768 ? col.mobileWidth : col.width 
                      }}
                    >
                      {col.key === "checkbox" ? (
                        <SquareCheckBig
                          size={16}
                          className="text-gray-400 cursor-pointer hover:text-gray-600 md:w-5 md:h-5"
                        />
                      ) : col.key === "budget" ? (
                        <span className="px-1 md:px-2 py-1 border border-blue-400 bg-blue-100 text-blue-800 rounded-2xl text-xs font-medium w-12 md:w-20 inline-block text-center">
                          {lead[col.key]}
                        </span>
                      ) : col.key === "status" ? (
                        <StatusBadge status={lead.status} />
                      ) : col.key === "action" ? (
                        <div className="flex items-center gap-1 md:gap-2">
                          <button className="text-green-600 hover:text-green-800">
                            <Pencil size={16} className="md:w-5 md:h-5" />
                          </button>
                          <div className="border-l border-[#EEF2F6] h-4 md:h-5"></div>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash size={16} className="md:w-5 md:h-5" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className="truncate block"
                          style={{ 
                            maxWidth: window.innerWidth < 768 ? col.mobileWidth : col.width 
                          }}
                        >
                          {lead[col.key]}
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

      {/* Pagination - Responsive */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-2 md:px-6 py-1 sm:py-4 gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none"
          >
            {[5, 10, 15].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="hidden sm:inline">entries per page</span>
        </div>

        <div className="text-sm text-gray-600">
          Showing {startEntry}-{endEntry} of {totalEntries}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-2 rounded-lg hover:bg-blue-50 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {renderPaginationButtons().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-2 rounded-lg hover:bg-blue-50 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableView;
