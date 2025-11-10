import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Fingerprint, IdCardLanyard, Smartphone, BookUser, HeartHandshake, Shield } from 'lucide-react';
import { usePermissions } from '../../../shared/hooks/usePermissions';
import PermissionsModal from '../PermissionsModal';
import api from '../../../shared/services/apiService';

const AgentDetailSidebar = ({ isOpen }) => {
  const { id } = useParams();
  const { hasFeature } = usePermissions();
  const canEditPermissions = hasFeature('teamManagement') && hasFeature('teamDashboard');
  const [isPermsOpen, setIsPermsOpen] = useState(false);
  
  const [employee, setEmployee] = useState(null);
  // store raw agent/profile (includes permissions) to hand off to PermissionsModal
  const [rawProfile, setRawProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

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
          if (isMounted) {
            setEmployee(null);
            setRawProfile(null);
          }
          return;
        }
        // Normalize fields for the sidebar usage (match EmployeeDetailSidebar)
        const normalized = {
          _id: found._id,
          name: found.name || 'N/A',
          designation: found.designation || 'N/A',
          empId: found.empid || found.empId || 'N/A',
          email: found.email || 'N/A',
          phone: found.phoneNumber || found.phone || 'N/A',
          leadsAssigned: found?.stats?.transferredLeads ?? 0,
          successfulLeads: found?.stats?.closedLeads ?? 0,
          username: found.name || ''
        };
        if (isMounted) {
          setEmployee(normalized);
          setRawProfile(found);
        }
      } catch (e) {
        console.error('AgentDetailSidebar: failed to load agent', e);
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
          <div className="bg-white rounded-lg p-3 text-sm text-gray-600">Loading agent...</div>
        )}
        {!loading && err && (
          <div className="bg-white rounded-lg p-3 text-sm text-red-600">Failed to load agent</div>
        )}
        {!loading && !err && !employee && (
          <div className="bg-white rounded-lg p-3 text-sm text-gray-600">Agent not found</div>
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
        {/* Permissions Card (inline, similar to other detail cards) */}
        </>
        )}
        {/* inline permissions card (entire card clickable when allowed) */}
        <button
          type="button"
          onClick={() => canEditPermissions && setIsPermsOpen(true)}
          className={`w-full text-left rounded-lg p-2 ${canEditPermissions ? 'bg-[var(--blue700)] text-white hover:shadow-md cursor-pointer' : 'bg-white text-[#002A80]'}`}
          aria-disabled={!canEditPermissions}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${canEditPermissions ? 'bg-white' : 'bg-[var(--blue700)]'}`}>
              <Shield size={20} className={canEditPermissions ? 'text-[var(--blue700)]' : 'text-white'} />
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className={`text-[16px] font-medium ${canEditPermissions ? 'text-white' : 'text-[#002A80]'}`}>Permissions</p>
                <p className={`text-sm ${canEditPermissions ? 'text-white/80' : 'text-[#002A8060]'}`}>{rawProfile?.permissions ? 'Configured' : 'Not configured'}</p>
              </div>
            )}
          </div>
        </button>
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
        profile={rawProfile}
        onSuccess={null}
      />
    </div>
  );
};

export default AgentDetailSidebar;
