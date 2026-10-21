import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useInventory from '../../shared/hooks/useInventory';
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
  Plus,
  Filter
} from "lucide-react";
import InventoryInfoModal from '../../shared/components/InventoryInfoModal';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusClassMap = {
    "available": "bg-green-100 text-green-800 border-green-200",
    "sold": "bg-red-100 text-red-800 border-red-200",
    "reserved": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "under-construction": "bg-blue-100 text-blue-800 border-blue-200",
  };

  const className = statusClassMap[status] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span className={`${className} border px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap`}>
      {status}
    </span>
  );
};

const InventoryTableView = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerms, setSearchTerms] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const modalRef = useRef(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Columns configuration
  const columns = useMemo(() => [
    { key: "checkbox", label: "", width: "50px", mobileWidth: "40px" },
    { key: "ownerName", label: "OWNER", width: "150px", mobileWidth: "120px", sortable: true },
    { key: "propertyCode", label: "CODE", width: "120px", mobileWidth: "100px", sortable: true },
    { key: "title", label: "TITLE", width: "200px", mobileWidth: "150px", sortable: true },
    { key: "type", label: "TYPE", width: "100px", mobileWidth: "80px", sortable: true },
    { key: "bhk", label: "BHK", width: "80px", mobileWidth: "60px", sortable: true },
    { key: "city", label: "CITY", width: "120px", mobileWidth: "100px", sortable: true },
    { key: "price", label: "PRICE", width: "120px", mobileWidth: "100px", sortable: true },
    { key: "status", label: "STATUS", width: "120px", mobileWidth: "100px", sortable: true },
    { key: "ownerPhone", label: "CONTACT", width: "130px", mobileWidth: "110px" },
    { key: "action", label: "ACTION", width: "100px", mobileWidth: "80px" },
  ], []);

  const { data: inventoryResp, isLoading, error } = useInventory();

  // Delete inventory function
  const handleDeleteInventory = async (inventoryId) => {
    const confirmed = window.confirm('Are you sure you want to delete this inventory? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await api.delete(`/inventory/${inventoryId}`);
      queryClient.invalidateQueries(['inventory']);
      if (window?.toast) {
        window.toast.success('Inventory deleted successfully');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to delete inventory';
      if (window?.toast) {
        window.toast.error(`Delete failed: ${msg}`);
      }
    }
  };

  // Filter + Search + Sort logic
  const filteredItems = useMemo(() => {
    const raw = Array.isArray(inventoryResp?.data) ? inventoryResp.data : [];
    
    // Normalize backend fields
    let items = raw.map((item, index) => ({
      ...item,
      id: item._id || item.id,
      sNo: index + 1,
      bhk: item.unitDetails?.bhk || '-',
      city: item.location?.city || '-',
      price: item.pricing?.price || 0,
      status: item.status || 'available'
    }));

    // Apply search filter
    if (searchTerms.length > 0) {
      items = items.filter((item) =>
        searchTerms.every((term) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(term.toLowerCase())
          )
        )
      );
    }

    // Apply sorting
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
  }, [inventoryResp, searchTerms, sortConfig]);

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
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading inventory:</p>
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

  const formatPrice = (price) => {
    if (!price) return '-';
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  return (
    <div className="scrollbar-hide space-y-4 p-2">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <button
          onClick={() => navigate('/inventory/add')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Inventory
        </button>
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="text-sm text-gray-600">
          Total Entries: <span className="font-semibold">{totalEntries}</span>
        </div>

        {/* Search Section */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search inventory..."
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
      {searchTerms.length > 0 && (
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
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full border-collapse min-w-[1200px]">
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
              {currentItems.map((inventory) => (
                <tr
                  key={inventory.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => { setSelectedInventory(inventory); setShowInfoModal(true); }}
                >
                  {columns.map((col, index) => (
                    <td
                      key={`${inventory.id}-${col.key}`}
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
                          aria-label={`select row ${inventory.id}`}
                          checked={selectedIds.includes(inventory.id)}
                          onChange={(e) => toggleSelectRow(e, inventory.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      ) : col.key === "price" ? (
                        <span className="font-medium text-green-700">
                          {formatPrice(inventory.price)}
                        </span>
                      ) : col.key === "status" ? (
                        <StatusBadge status={inventory.status} />
                      ) : col.key === "action" ? (
                        <div className="flex items-center gap-1 md:gap-2">
                          <button 
                            className="text-green-600 hover:text-green-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/inventory/edit/${inventory.id}`);
                            }}
                            title="Edit Inventory"
                          >
                            <Pencil size={16} className="md:w-5 md:h-5" />
                          </button>
                          <div className="border-l border-[#EEF2F6] h-4 md:h-5"></div>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteInventory(inventory.id);
                            }}
                            title="Delete Inventory"
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
                          {inventory[col.key] || '-'}
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

      {/* Inventory Info Modal */}
      <div ref={modalRef}>
        <InventoryInfoModal open={showInfoModal} inventory={selectedInventory} onClose={() => setShowInfoModal(false)} />
      </div>

      {/* Pagination */}
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
            {[5, 10, 15, 20].map((num) => (
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

export default InventoryTableView;
