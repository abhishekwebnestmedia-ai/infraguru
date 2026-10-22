// import React, { useState } from 'react';
// import { X, Upload, Trash2, CloudUpload } from 'lucide-react';


// const BulkLeadUploadModal = ({ isOpen, onClose, onConfirm }) => {
//   // State to store list of uploaded files
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   // State to track if user is currently dragging files over the drop zone
//   const [dragActive, setDragActive] = useState(false);


//   // CONDITIONAL RENDERING: If modal is not open, don't render anything
//   // This prevents the modal from existing in DOM when not needed
//   if (!isOpen) return null;


//   // Helper function to extract and format file extension for display
//   const getFileExtension = (fileName) => {
//     return fileName.split('.').pop().toUpperCase().slice(0, 3);
//   };


//   // Handle drag events over the drop zone
//   const handleDrag = (e) => {
//     e.preventDefault(); // Prevent default browser drag behavior
//     e.stopPropagation(); // Stop event bubbling
    
//     // Set dragActive state based on drag event type
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true); // User is dragging over drop zone
//     } else if (e.type === "dragleave") {
//       setDragActive(false); // User dragged away from drop zone
//     }
//   };


//   // Handle when files are dropped into the drop zone
//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false); // Reset drag state
    
//     // Convert FileList to Array and process
//     const files = [...e.dataTransfer.files];
//     handleFiles(files);
//   };


//   // Process files (from drag & drop or file input)
//   const handleFiles = (files) => {
//     files.forEach(file => {
//       // Create file data object for state management
//       const fileData = {
//         id: Date.now() + Math.random(), // Unique ID for each file
//         name: file.name,
//         size: file.size,
//         status: 'uploading' // Initial status
//       };
      
//       // Add file to uploaded files list
//       setUploadedFiles(prev => [...prev, fileData]);
      
//       // Simulate upload process with timeout
//       setTimeout(() => {
//         setUploadedFiles(prev => 
//           prev.map(f => f.id === fileData.id ? {...f, status: 'completed'} : f)
//         );
//       }, 1000); // 1 second simulation
//     });
//   };


//   // Handle file selection from file input
//   const handleFileInput = (e) => {
//     const files = [...e.target.files]; // Convert FileList to Array
//     handleFiles(files);
//   };


//   // Remove specific file from uploaded files list
//   const removeFile = (id) => {
//     setUploadedFiles(prev => prev.filter(f => f.id !== id));
//   };


//   // Clear all uploaded files
//   const clearAll = () => {
//     setUploadedFiles([]);
//   };


//   // Convert bytes to KB for display
//   const formatFileSize = (bytes) => {
//     return `${(bytes / 1024).toFixed(0)} KB`;
//   };


//   return (
//     // Modal overlay - covers entire screen with semi-transparent background
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       {/* Modal container */}
//       <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        
//         {/* Modal Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">Upload Bulk Lead</h2>
//           {/* Close button (X) */}
//           <button 
//             onClick={onClose} // Calls parent's onClose function
//             className="p-1 hover:bg-gray-100 rounded-full"
//           >
//             <X size={20} className="text-gray-500" />
//           </button>
//         </div>


//         {/* File Upload Drop Zone */}
//         <div
//           className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors ${
//             dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
//           }`}
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//         >
//           <CloudUpload className="mx-auto mb-4 text-gray-400" size={48} />
//           <h3 className="text-lg mb-2">Choose a file or drag & drop it here</h3>
//           <p className="text-gray-500 mb-4">Upload files</p>
          
//           {/* Hidden file input with custom styled button */}
//           <label className="inline-block">
//             <input 
//               type="file" 
//               className="hidden" // Hide default file input
//               multiple // Allow multiple file selection
//               onChange={handleFileInput}
//             />
//             <span className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 cursor-pointer">
//               Browse File
//             </span>
//           </label>
//         </div>


//         {/* Scrollable File List Section Only */}
//         {uploadedFiles.length > 0 && (
//           <div className="max-h-60 overflow-y-auto scrollbar-hide space-y-2 mb-4">
//             {uploadedFiles.map(file => (
//               <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
//                 <div className="flex items-center space-x-3">
//                   {/* File type indicator */}
//                   <div className="bg-purple-100 p-2 rounded">
//                     <span className="text-purple-600 text-xs font-semibold">
//                       {getFileExtension(file.name)}
//                     </span>
//                   </div>
                  
//                   {/* File details */}
//                   <div>
//                     <p className="font-medium text-sm">{file.name}</p>
//                     <div className="flex items-center space-x-2 text-xs text-gray-500">
//                       <span>{formatFileSize(file.size)}</span>
                      
//                       {/* Show uploading status */}
//                       {file.status === 'uploading' && (
//                         <>
//                           <span>•</span>
//                           <span>Uploading...</span>
//                         </>
//                       )}
                      
//                       {/* Show completed status */}
//                       {file.status === 'completed' && (
//                         <>
//                           <span>•</span>
//                           <div className="flex items-center space-x-1">
//                             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                             <span>Completed</span>
//                           </div>
//                         </>
//                       )}
//                     </div>
                    
//                     {/* Progress bar for uploading files */}
//                     {file.status === 'uploading' && (
//                       <div className="w-32 h-1 bg-gray-200 rounded mt-1">
//                         <div className="h-full bg-blue-500 rounded animate-pulse w-3/4"></div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Delete file button */}
//                 <button 
//                   onClick={() => removeFile(file.id)}
//                   className="p-1 hover:bg-gray-200 rounded"
//                 >
//                   <Trash2 size={16} className="text-gray-500" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}


//         {/* Modal Footer Buttons */}
//         <div className="flex justify-end space-x-3">
//           {/* Clear all files button */}
//           <button 
//             onClick={clearAll}
//             className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
//           >
//             Clear All
//           </button>
          
//           {/* Confirm upload button */}
//           <button 
//             onClick={() => onConfirm(uploadedFiles.length)} // Calls parent's onConfirm function
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default BulkLeadUploadModal;



import React, { useState } from "react";
import { X, Trash2, CloudUpload } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

import api from "../../../shared/services/apiService";
import { toast } from "react-toastify";

const BulkLeadUploadModal = ({ isOpen, onClose, onConfirm }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [parsedLeads, setParsedLeads] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const TEMPLATE_HEADERS = [
    "source",
    "executiveName",
    "assignedTo",
    "transferTo",
    "capturedBy",
    "clientName",
    "contactNumber",
    "email",
    "status",
    "budget",
    "location",
    "projects",
    "remark"
  ];

  // Detect empty rows
  const isEmptyRow = (row) => {
    return Object.values(row).every(
      (v) => v === "" || v === null || v === undefined
    );
  };

  // Normalize row keys
  const normalizeRow = (row) => {
    const out = {};
    TEMPLATE_HEADERS.forEach((key) => {
      out[key] = row[key] || row[key.toLowerCase()] || "";
    });
    return out;
  };

  const getFileExtension = (name) => name.split(".").pop().toUpperCase();
  const formatFileSize = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

  // Parse CSV or Excel
  const parseFile = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();

    return new Promise((resolve, reject) => {
      // CSV parser
      if (ext === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => resolve(res.data),
          error: reject
        });
      } else {
        // Excel parser
        const reader = new FileReader();
        reader.onload = (e) => {
          const wb = XLSX.read(e.target.result, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          resolve(XLSX.utils.sheet_to_json(ws));
        };
        reader.onerror = reject;
        reader.readAsBinaryString(file);
      }
    });
  };

  // Handle file drop or select
  const handleFiles = async (files) => {
    for (const file of files) {
      const fileId = Date.now() + Math.random();

      setUploadedFiles((prev) => [
        ...prev,
        { id: fileId, name: file.name, size: file.size, status: "uploading" }
      ]);

      try {
        const raw = await parseFile(file);

        const cleaned = raw
          .map(normalizeRow)
          .filter((row) => !isEmptyRow(row)); // REMOVE blank rows

        setParsedLeads((prev) => [...prev, ...cleaned]);

        // Mark complete
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "completed" } : f
          )
        );
      } catch (err) {
        toast.error("Failed to read: " + file.name);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles([...e.dataTransfer.files]);
  };

  const handleFileInput = (e) => handleFiles([...e.target.files]);

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setUploadedFiles([]);
    setParsedLeads([]);
  };

  // Upload parsed leads to server
  const uploadToServer = async () => {
    if (parsedLeads.length === 0) {
      toast.error("No valid rows found. Please check your file.");
      return;
    }

    const payload = { leads: parsedLeads };

    try {
      toast.info("Uploading leads...");
      await api.post("/lead/bulk-upload", payload);

      toast.success(`Uploaded ${parsedLeads.length} leads.`);
      onConfirm(parsedLeads.length);

      clearAll();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Upload Bulk Lead</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* DROP ZONE */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors ${
            dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={() => setDragActive(true)}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <CloudUpload className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg mb-2">Choose a file or drag & drop here</h3>
          <p className="text-gray-500 mb-4">Upload CSV or Excel</p>

          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls"
              multiple
              onChange={handleFileInput}
            />
            <span className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
              Browse File
            </span>
          </label>
        </div>

        {/* FILE LIST */}
        {uploadedFiles.length > 0 && (
          <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex justify-between p-3 bg-gray-50 rounded">
                <div className="flex space-x-3">
                  <div className="bg-purple-100 p-2 rounded text-purple-700 text-xs">
                    {getFileExtension(file.name)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-600">
                      {formatFileSize(file.size)} • {file.status}
                    </p>
                  </div>
                </div>
                <button onClick={() => removeFile(file.id)} className="p-1 hover:bg-gray-200 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end space-x-3">
          <button onClick={clearAll} className="px-4 py-2 border text-gray-600 rounded hover:bg-gray-50">
            Clear All
          </button>
          <button
            onClick={uploadToServer}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </div>

      </div>
    </div>
  );
};

export default BulkLeadUploadModal;
