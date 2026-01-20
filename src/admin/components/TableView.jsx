import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useLeads from '../../shared/hooks/useLeads';
import api from '../../shared/services/apiService';
 
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
  Filter,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LeadInfoModal from '../../shared/components/LeadInfoModal'

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


const TableView = ({ userFilter = null, username = null }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerms, setSearchTerms] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Date filter state
  const [dateFilterOption, setDateFilterOption] = useState("");
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [startDate, endDate] = customDateRange;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const modalRef = useRef(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Columns with date sorting flags
  const columns = useMemo(() => [
    { key: "checkbox", label: "", width: "50px", mobileWidth: "40px" },
    { key: "clientName", label: "CLIENT", width: "150px", mobileWidth: "120px", sortable: true },
    { key: "source", label: "SOURCE", width: "100px", mobileWidth: "80px", sortable: true },
    { key: "executiveName", label: "EXECUTIVE", width: "150px", mobileWidth: "100px", sortable: true },
    { key: "assignedTo", label: "ASSIGNED", width: "120px", mobileWidth: "90px", sortable: true },
    { key: "transferTo", label: "TRANSFER", width: "120px", mobileWidth: "90px" },
    { key: "capturedBy", label: "CAPTURED", width: "120px", mobileWidth: "90px" },
    { key: "date", label: "DATE", width: "120px", mobileWidth: "90px", sortable: true, dateSorting: false },
    { key: "followUpDate", label: "FOLLOW UP", width: "120px", mobileWidth: "100px", sortable: true, dateSorting: true },
    { key: "status", label: "STATUS", width: "120px", mobileWidth: "100px", sortable: true },
    { key: "contactNo", label: "CONTACT", width: "150px", mobileWidth: "120px" },
    { key: "emailId", label: "EMAIL", width: "200px", mobileWidth: "150px" },
    { key: "budget", label: "BUDGET", width: "100px", mobileWidth: "80px" },
    { key: "location", label: "LOCATION", width: "250px", mobileWidth: "150px" },
    { key: "projects", label: "PROJECTS", width: "150px", mobileWidth: "100px" },
    { key: "remark", label: "REMARK", width: "200px", mobileWidth: "120px" },
    { key: "action", label: "ACTION", width: "100px", mobileWidth: "80px" },
  ], []);

  const _statusOptions = ["Not Interested", "Prospect", "Follow Ups", "Closer"];

  const { data: leadsResp, isLoading, error } = useLeads({ username });

  // Delete lead function
  const handleDeleteLead = async (leadId) => {
    const confirmed = window.confirm('Are you sure you want to delete this lead? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await api.delete(`/lead/delete/${leadId}`);
      queryClient.invalidateQueries(['leads']);
      // Success toast
      if (window?.toast) {
        window.toast.success('Lead deleted successfully');
      }
    } catch (err) {
      // Error toast with details
      const msg = err?.response?.data?.message || err.message || 'Failed to delete lead';
      if (window?.toast) {
        window.toast.error(`Delete failed: ${msg}`);
      }
    }
  };

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
  const raw = Array.isArray(leadsResp?.data) ? leadsResp.data : Array.isArray(leadsResp) ? leadsResp : [];
    // normalize backend fields to match table keys used in the UI
    let items = raw.map((l) => ({
      ...l,
      id: l._id || l.id,
      contactNo: l.contactNumber || l.contactNo,
      followUpDate: l.followUp || l.followUpDate,
      emailId: l.email || l.emailId,
      clientName: l.clientName || l.client || l.name,
      budget: l.budget || l.price,
      // Handle object fields - extract name from objects
      assignedTo: l.assignedTo?.name || l.assignedTo || '',
      transferTo: l.transferTo?.name || l.transferTo || '',
      capturedBy: l.capturedBy?.name || l.capturedBy || ''
    }));

    // Apply user filter if provided (for user-specific lead pages)
  if (!username && userFilter && typeof userFilter === 'function') {
      items = userFilter(raw); // Apply filter to raw data to preserve original objects
      // Then normalize the filtered data
      items = items.map((l) => ({
        ...l,
        id: l._id || l.id,
        contactNo: l.contactNumber || l.contactNo,
        followUpDate: l.followUp || l.followUpDate,
        emailId: l.email || l.emailId,
        clientName: l.clientName || l.client || l.name,
        budget: l.budget || l.price,
        // Handle object fields - extract name from objects
        assignedTo: l.assignedTo?.name || l.assignedTo || '',
        transferTo: l.transferTo?.name || l.transferTo || '',
        capturedBy: l.capturedBy?.name || l.capturedBy || ''
      }));
    }

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
  }, [leadsResp, searchTerms, sortConfig, startDate, endDate, dateFilterOption, columns, userFilter, username]);

  const totalEntries = filteredItems.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const startEntry = indexOfFirstItem + 1;
  const endEntry = Math.min(indexOfLastItem, totalEntries);

  // Selection helpers for checkboxes
  const allSelected = currentItems.length > 0 && currentItems.every((it) => selectedIds.includes(it.id));
  const toggleSelectAll = (e) => {
    e.stopPropagation();
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(currentItems.map((it) => it.id));
  };
  const toggleSelectRow = (e, id) => {
    e.stopPropagation();
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Click-outside and Escape key handler for custom menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuRef.current) return;
      const toggleBtn = document.querySelector('button[aria-haspopup="menu"]');
      if (menuRef.current.contains(e.target) || (toggleBtn && toggleBtn.contains(e.target))) return;
      setMenuOpen(false);
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  // Modal click-outside + Escape handler
  useEffect(() => {
    const onDocClick = (e) => {
      if (!showInfoModal) return;
      if (!modalRef.current) return;
      if (!modalRef.current.contains(e.target)) setShowInfoModal(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setShowInfoModal(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [showInfoModal]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading leads:</p>
          <p className="text-gray-600 text-sm">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
      {/* Date Filter and Search in same row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 my-2">
        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((s) => !s)}
              className="flex items-center gap-2 w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span>{dateFilterOption || 'Select Date Filter'}</span>
              <ChevronDown size={14} />
            </button>

            {menuOpen && (
              <div
                ref={menuRef}
                role="menu"
                className="absolute z-20 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md py-1"
              >
                {['', 'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range'].map((opt) => (
                  <button
                    key={opt || 'none'}
                    role="menuitem"
                    onClick={() => {
                      setDateFilterOption(opt);
                      setCurrentPage(1);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50"
                  >
                    {opt === '' ? 'Select Date Filter' : opt}
                  </button>
                ))}
              </div>
            )}
          </div>

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
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 z-[999]"
            />
          )}
        </div>

        {/* Search Section */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 lg:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap flex items-center gap-2"
          >
            <Filter size={16} />
            Add Filter
          </button>
        </form>
      </div>

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
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={col.key}
                    className={`text-left py-3 md:py-4 px-2 md:px-4 font-medium border-b border-gray-400 text-gray-900 whitespace-nowrap text-xs md:text-sm ${
                      col.sortable ? "cursor-pointer hover:text-blue-600" : ""
                    } ${index < 2 ? `sticky left-0 z-20 bg-gray-50` : ""}`}
                    style={{
                      width: window.innerWidth < 768 ? col.mobileWidth : col.width,
                      minWidth: window.innerWidth < 768 ? col.mobileWidth : col.width,
                      left: index === 0 ? '0px' : index === 1 ? (window.innerWidth < 768 ? '40px' : '50px') : 'auto'
                    }}
                    onClick={() => handleSort(col.key, col.sortable)}
                  >
                    <div className="flex items-center gap-1">
                      {col.key === "checkbox" ? (
                        <input
                          type="checkbox"
                          aria-label="select all"
                          checked={allSelected}
                          onChange={toggleSelectAll}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
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
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => { setSelectedLead(lead); setShowInfoModal(true); }}
                >
                  {columns.map((col, index) => (
                    <td
                      key={`${lead.id}-${col.key}`}
                      className={`py-3 md:py-4 px-2 md:px-4 text-[#051226] text-xs md:text-sm ${
                        index < 2 ? `sticky left-0 z-10 bg-white` : ""
                      }`}
                      style={{
                        width: window.innerWidth < 768 ? col.mobileWidth : col.width,
                        minWidth: window.innerWidth < 768 ? col.mobileWidth : col.width,
                        left: index === 0 ? '0px' : index === 1 ? (window.innerWidth < 768 ? '40px' : '50px') : 'auto'
                      }}
                    >
                      {col.key === "checkbox" ? (
                        <input
                          type="checkbox"
                          aria-label={`select row ${lead.id}`}
                          checked={selectedIds.includes(lead.id)}
                          onChange={(e) => toggleSelectRow(e, lead.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      ) : col.key === "budget" ? (
                        <span className="px-1 md:px-2 py-1 border border-blue-400 bg-blue-100 text-blue-800 rounded-2xl text-xs font-medium w-12 md:w-20 inline-block text-center whitespace-nowrap">
                          {lead[col.key]}
                        </span>
                      ) : col.key === "status" ? (
                        <StatusBadge status={lead.status} />
                      ) : col.key === "action" ? (
                        <div className="flex items-center gap-1 md:gap-2">
                          <button 
                            className="text-green-600 hover:text-green-800"
                            onClick={() => navigate(`/leads/edit/${lead.id}`)}
                            title="Edit Lead"
                          >
                            <Pencil size={16} className="md:w-5 md:h-5" />
                          </button>
                          <div className="border-l border-[#EEF2F6] h-4 md:h-5"></div>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteLead(lead.id)}
                            title="Delete Lead"
                          >
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

      {/* Lead Info Modal */}
      <div ref={modalRef}>
        <LeadInfoModal open={showInfoModal} lead={selectedLead} onClose={() => setShowInfoModal(false)} />
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
