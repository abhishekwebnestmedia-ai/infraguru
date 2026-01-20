import React from "react";
import { Link, useLocation } from "react-router-dom";
import { usePermissions } from "../hooks/usePermissions";
import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import PermissionsModal from '../../admin/components/PermissionsModal';
import api from '../services/apiService';

const SidebarMenu = ({ isOpen, closeSidebar, isTablet }) => {
  const location = useLocation();
  const { hasFeature } = usePermissions();

  // Unified routes (no role prefixes)
  const baseItems = [
    { icon: "icon1.svg", text: "Dashboard", path: `/dashboard`, feature: 'dashboard' },
    { icon: "icon3.svg", text: "Lead", path: `/leads`, feature: 'leads' },
    { icon: "icon7.svg", text: "Inventory", path: `/inventory`, feature: 'inventory' },
    { icon: "icon2.svg", text: "Team Dashboard", path: `/team-dashboard`, feature: 'teamDashboard' },
    { icon: "icon5.svg", text: "Projects & Dev", path: `/projects`, feature: 'projects' },
    { icon: "icon4.svg", text: "Broadcast", path: `/broadcast`, feature: 'broadcast' }
  ];

  const menuItems = baseItems.filter(item => !item.feature || hasFeature(item.feature));

  // Handle menu item click - close sidebar only for tablets
  const handleMenuItemClick = () => {
    if (isTablet && closeSidebar) {
      closeSidebar();
    }
  };

  return (
    < >
      {/* Desktop Sidebar - Hidden on mobile */}
      <nav 
        className="relative mr-2 flex-col h-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] hidden md:flex" 
        style={{ backgroundColor: 'var(--blue100)' }}
      >
        {/* Menu Items */}
        <div className="">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={index}
                to={item.path}
                onClick={handleMenuItemClick}
                className={`flex items-center py-3 px-2 mb-2 transition-colors duration-300 rounded-lg group ${
                  isActive 
                    ? 'text-[var(--text)]' 
                    : 'text-[var(--gray)] hover:text-[var(--text)]'
                }`}
                style={{ 
                  overflow: "hidden",
                  backgroundColor: isActive ? 'var(--active)' : 'white'
                }}
              >
                <span 
                  className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg"
                  style={{
                    backgroundColor: 'var(--blue700)'
                  }}
                >
                  <img 
                    src={`/icons/${item.icon}`} 
                    alt={item.text} 
                    className="w-5 h-5 filter brightness-0 invert" 
                  />
                </span>
                
                <span
                  className="ml-3 overflow-hidden text-sm font-medium transition-all duration-300 whitespace-nowrap text-[#002A80]"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    maxWidth: isOpen ? "200px" : "0px",
                    transitionProperty: "opacity, max-width, margin-left"
                  }}
                >
                  {item.text}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Permissions quick action (next to Team Dashboard) */}
        <div className="mx-2 mt-4">
          {(hasFeature('teamManagement') && hasFeature('teamDashboard')) && (
            <PermissionsQuickAction isOpen={isOpen} />
          )}
        </div>

        {/* Bottom text */}
        <div
          className="flex justify-items-start absolute bottom-4 overflow-hidden text-xs"
          style={{
            transition: "width 0.3s ease, opacity 0.3s ease",
            width: isOpen ? "11rem" : "0",
            marginLeft: isOpen ? "16px" : "10px",
            opacity: isOpen ? 1 : 0,
            color: 'var(--blue700)'
          }}
        >
          <span className="font-medium whitespace-nowrap fixed text-[#00000060]">
            Powered By WebnestMedia
          </span>
        </div>
      </nav>
    </>
  );
};

export default SidebarMenu;

// Small component rendered inside the sidebar to open permissions modal for a selected user
function PermissionsQuickAction({ isOpen }) {
  const [open, setOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Detect selected user id from URL: /employee/:id or /agent/:id
  const maybeMatch = (typeof window !== 'undefined' && window.location && window.location.pathname) ?
    window.location.pathname.match(/\/(?:employee|agent)\/([^/]+)/) : null;
  const selectedId = maybeMatch ? maybeMatch[1] : null;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!selectedId) {
        if (mounted) setSelectedProfile(null);
        return;
      }
      try {
        setLoading(true);
        // Fetch teams and find the user by id (supports current backend shape)
        const res = await api.get('/auth/teams');
        const list = res.data?.users || res.data?.teams || res.data || [];
        const found = (list || []).find(u => String(u._id || u.id) === String(selectedId));
        if (mounted) setSelectedProfile(found || null);
      } catch {
        if (mounted) setSelectedProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [selectedId]);

  // Only show when a specific user is selected and profile loaded
  if (!selectedId || loading || !selectedProfile) return null;

  return (
    <>
      <div className={`flex items-center py-3 px-2 mb-2 transition-colors duration-300 rounded-lg group text-[var(--gray)] hover:text-[var(--text)]`}>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center w-full"
          title="Manage Permissions"
        >
          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg" style={{ backgroundColor: 'var(--blue700)' }}>
            <Shield className="w-5 h-5 filter brightness-0 invert" />
          </span>

          <span
            className="ml-3 overflow-hidden text-sm font-medium transition-all duration-300 whitespace-nowrap text-[#002A80]"
            style={{
              opacity: isOpen ? 1 : 0,
              maxWidth: isOpen ? "200px" : "0px",
              transitionProperty: "opacity, max-width, margin-left"
            }}
          >
            Permissions
          </span>
        </button>
      </div>

      <PermissionsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        profile={selectedProfile}
        onSuccess={null}
        readOnly={false}
        title={`Permissions — ${selectedProfile?.name || ''}`}
      />
    </>
  );
}
