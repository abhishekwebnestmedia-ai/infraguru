import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, FilePlus2, ArrowLeft } from "lucide-react";
import { toast } from 'react-toastify';
import BulkLeadUploadModal from './uploadBulkLeadPopup/BulkLeadUploadModal';
import BulkAssignModal from './BulkAssignModal';

const DashboardHeader = ({ title = "Dashboard", showBackButton = false, backPath = "/" }) => {
    const navigate = useNavigate();
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);

    const handleAddLead = () => {
        navigate('/leads/add');
    };

    const handleAssignLead = () => {
        setShowAssignModal(true);
    };

    const handleAddBulkLead = () => {
        setShowBulkModal(true);
    };
    
    const handleBackClick = () => {
        navigate(backPath);
    };

    // Just close modal - no toast
    const handleModalClose = () => {
        setShowBulkModal(false);
    };

    // Close modal with success toast (for confirm button)
    const handleBulkUploadConfirm = (fileCount) => {
        // const fileCount = uploadedFiles.length; 

        setShowBulkModal(false);
        toast.success(`You just uploaded ${fileCount} Leads`);
    };

    return (
        <>
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center md:gap-0">
                <div className="flex items-center gap-4">
                    {showBackButton && (
                        <button
                            onClick={handleBackClick}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h2 className="section-heading">{title}</h2>
                </div>
                <div className="flex gap-2 sm:gap-3 md:gap-5">
                    <button
                        onClick={handleAssignLead}
                        className="flex-1 md:w-40 md:px-4 py-2 text-[var(--blue700)] flex items-center justify-center gap-1 md:gap-2 border border-[var(--blue700)] rounded hover:bg-[var(--blue700)] hover:text-white text-xs md:text-sm cursor-pointer"
                    >
                        Assign Lead
                        <FilePlus size={14} />
                    </button>

                    <button
                        onClick={handleAddBulkLead}
                        className="flex-1 md:w-40 md:px-4 py-2 text-[var(--blue700)] flex items-center justify-center gap-1 md:gap-2 border border-[var(--blue700)] rounded hover:bg-[var(--blue700)] hover:text-white text-xs md:text-sm cursor-pointer"
                    >
                        Add Bulk Lead{" "}
                        <span>
                            <FilePlus2 size={14} />
                        </span>
                    </button>

                    <button
                        onClick={handleAddLead}
                        className="flex-1 md:w-40 md:px-4 py-2 text-[var(--blue700)] flex items-center justify-center gap-1 md:gap-2 border border-[var(--blue700)] rounded hover:bg-[var(--blue700)] hover:text-white text-xs md:text-sm cursor-pointer"
                    >
                        Add Lead{" "}
                        <span>
                            <FilePlus2 size={14} />
                        </span>
                    </button>
                </div>
            </div>

            <BulkLeadUploadModal
                isOpen={showBulkModal}
                onClose={handleModalClose} 
                onConfirm={handleBulkUploadConfirm} />
            
            <BulkAssignModal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                onSuccess={() => {
                    // Optionally trigger a refresh of lead data here
                    toast.success('Leads assigned successfully');
                }}
            />
        </>
    );
};

export default DashboardHeader;
