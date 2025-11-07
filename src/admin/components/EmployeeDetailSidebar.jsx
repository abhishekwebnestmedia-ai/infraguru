import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Fingerprint, IdCardLanyard, Smartphone, BookUser, HeartHandshake, Shield } from 'lucide-react';
import { usePermissions } from '../../shared/hooks/usePermissions';
import PermissionsModal from './PermissionsModal';
import api from '../../shared/services/apiService';

const EmployeeDetailSidebar = ({ isOpen }) => {
  const { id } = useParams();
  const { hasFeature } = usePermissions();
  const canEditPermissions = hasFeature('teamManagement') && hasFeature('teamDashboard');
  const [isPermsOpen, setIsPermsOpen] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Fetch teams and pick the selected employee by :id
  useEffect(() => {
    let isMounted = true;
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setErr(null);
        const resp = await api.get('/auth/teams');
        const list = resp?.data?.users || [];
        const found = list.find(u => String(u._id) === String(id));
        if (!found) {
          if (isMounted) setEmployee(null);
          return;
        }
        // Normalize fields for the sidebar usage
        const normalized = {
          name: found.name || 'N/A',
          designation: found.designation || 'N/A',
          empId: found.empid || found.empId || 'N/A',
          email: found.email || 'N/A',
          phone: found.phoneNumber || found.phone || 'N/A',
          leadsAssigned: 0,
          successfulLeads: 0,
        };
        if (isMounted) setEmployee(normalized);
      } catch (e) {
        console.error('EmployeeDetailSidebar: failed to load team member', e);
        if (isMounted) setErr(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchEmployee();
    return () => { isMounted = false; };
  }, [id]);

  return (
    <div className="relative h-full bg-[var(--blue100)] px-5 overflow-y-auto scrollbar-hide">
      {/* Profile Cards */}
      <div className="space-y-2">
        {loading && (
          <div className="bg-white rounded-lg p-3 text-sm text-gray-600">Loading user...</div>
        )}
        {!loading && err && (
          <div className="bg-white rounded-lg p-3 text-sm text-red-600">Failed to load user</div>
        )}
        {!loading && !err && !employee && (
          <div className="bg-white rounded-lg p-3 text-sm text-gray-600">User not found</div>
        )}
  {employee && (
  <>
  {/* Name Card */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            {isOpen && (
              <div>
                <p className="text-[16px] font-medium text-[#002A80]">{employee.name}</p>
                <p className="text-sm text-[#002A8060]">Name</p>
              </div>
            )}
          </div>
        </div>

        {/* Designation Card */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
              <IdCardLanyard size={20} className="text-white"/>
            </div>
            {isOpen && (
              <div>
                <p className="text-[16px] font-medium text-[#002A80]">{employee.designation}</p>
                <p className="text-sm text-[#002A8060]">Designation</p>
              </div>
            )}
          </div>
        </div>

        {/* Employee ID Card */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
              <Fingerprint size={20} className="text-white" />
            </div>
            {isOpen && (
              <div>
                <p className="text-[16px] font-medium text-[#002A80]">{employee.empId}</p>
                <p className="text-sm text-[#002A8060]">Employee ID</p>
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
                <p className="text-[16px] font-medium text-[#002A80] truncate">{employee.email}</p>
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
                <p className="text-[16px] font-medium text-[#002A80]">{employee.phone}</p>
                <p className="text-sm text-[#002A8060]">Phone No.</p>
              </div>
            )}
          </div>
        </div>

        {/* Leads Assigned Card */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
              <BookUser size={20} className="text-white" />
            </div>
            {isOpen && (
              <div>
                <p className="text-[16px] font-medium text-[#002A80]">{Number(employee.leadsAssigned || 0).toLocaleString()}</p>
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
                <p className="text-[16px] font-medium text-[#002A80]">{Number(employee.successfulLeads || 0).toLocaleString()}</p>
                <p className="text-sm text-[#002A8060]">Successful Leads</p>
              </div>
            )}
          </div>
  </div>
  </>
  )}
      </div>

      {/* Permissions button (bottom-most) */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        {canEditPermissions && (
          <button
            onClick={() => setIsPermsOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm ${
              isOpen ? '' : 'p-2'
            }`}
            title="Manage Permissions"
          >
            <Shield size={18} className="text-white" />
            {isOpen && <span className="text-sm font-medium">Permissions</span>}
          </button>
        )}
      </div>

      {/* Bottom Branding Text */}
      {isOpen && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <span className="font-medium text-xs fixed text-[#00000060]">
            Powered By WebnestMedia
          </span>
        </div>
      )}

      {/* Permissions Modal */}
      <PermissionsModal
        isOpen={Boolean(isPermsOpen)}
        onClose={() => setIsPermsOpen(false)}
        profile={{ id }}
        onSuccess={null}
      />
    </div>
  );
};

export default EmployeeDetailSidebar;
