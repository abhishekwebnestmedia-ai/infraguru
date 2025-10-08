import React from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Phone, Fingerprint, FileText, Target, Heart, IdCardLanyard, Smartphone, BookUser, HeartHandshake } from 'lucide-react';

const AgentDetailSidebar = ({ isOpen }) => {
  const { id } = useParams();
  
  // Mock employee data based on ID
  const getEmployeeById = (empId) => {
    const employees = {
      1: { name: "Arjun Sharma", designation: "Senior Developer", empId: "007", email: "arjun@infraguru.com", phone: "+91 8171 839 997", leadsAssigned: 12333,leadsGenerated:32345, successfulLeads: 42333 },
      2: { name: "Priya Patel", designation: "UI/UX Designer", empId: "008", email: "priya@infraguru.com", phone: "+91 8171 839 998", leadsAssigned: 10500, leadsGenerated:32345, successfulLeads: 38200 },
      3: { name: "Rajesh Kumar", designation: "Project Manager", empId: "009", email: "rajesh@infraguru.com", phone: "+91 8171 839 999", leadsAssigned: 15600, leadsGenerated:32345, successfulLeads: 51000 },
    };
    return employees[empId] || { name: "Shashak", designation: "Employee", empId: "007", email: "Rajat@infraguru...", phone: "+91 8171 839 997", leadsAssigned: 12333, leadsGenerated:32345, successfulLeads: 42333 };
  };

  const employee = getEmployeeById(id);

  return (
    <div className="relative h-full bg-[var(--blue100)] px-5 overflow-y-auto scrollbar-hide">
      {/* Profile Cards */}
      <div className="space-y-2">
        
        {/* Name Card */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            {isOpen && (
              <div>
                <p className="text-lg font-medium text-[#002A80]">{employee.name}</p>
                <p className="text-sm text-[#002A8060]">Name</p>
              </div>
            )}
          </div>
        </div>

        {/* Designation Card */}
        {/* <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
              <IdCardLanyard size={20} className="text-white"/>
            </div>
            {isOpen && (
              <div>
                <p className="text-lg font-medium text-[#002A80]">{employee.designation}</p>
                <p className="text-sm text-[#002A8060]">Designation</p>
              </div>
            )}
          </div>
        </div> */}

        {/* Leads Assigned Card */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
              <BookUser size={20} className="text-white" />
            </div>
            {isOpen && (
              <div>
                <p className="text-lg font-medium text-[#002A80]">{employee.leadsAssigned.toLocaleString()}</p>
                <p className="text-sm text-[#002A8060]">Leads Assigned</p>
              </div>
            )}
          </div>
        </div>

        {/* Successful Leads Card */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
              <HeartHandshake size={20} className="text-white" />
            </div>
            {isOpen && (
              <div>
                <p className="text-lg font-medium text-[#002A80]">{employee.successfulLeads.toLocaleString()}</p>
                <p className="text-sm text-[#002A8060]">Successful Leads</p>
              </div>
            )}
          </div>
        </div>

        {/* leads generated */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
              <HeartHandshake size={20} className="text-white" />
            </div>
            {isOpen && (
              <div>
                <p className="text-lg font-medium text-[#002A80]">{employee.leadsGenerated.toLocaleString()}</p>
                <p className="text-sm text-[#002A8060]">Leads Generated</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Email Card */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
              <Mail size={20} className="text-white" />
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium text-[#002A80] truncate">{employee.email}</p>
                <p className="text-sm text-[#002A8060]">Email</p>
              </div>
            )}
          </div>
        </div>

        {/* Phone Card */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
              <Smartphone size={20} className="text-white" />
            </div>
            {isOpen && (
              <div>
                <p className="text-lg font-medium text-[#002A80]">{employee.phone}</p>
                <p className="text-sm text-[#002A8060]">Phone No.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Branding Text */}
      {isOpen && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <span className="font-medium text-xs fixed text-[#00000060]">
            Powered By WebnestMedia
          </span>
        </div>
      )}
    </div>
  );
};

export default AgentDetailSidebar;
