import React from "react";
import { Link, useLocation } from "react-router-dom";
import { usePermissions } from "../hooks/usePermissions";

const SidebarMenu = ({ isOpen, closeSidebar, isTablet }) => {
  const location = useLocation();
  const { hasFeature } = usePermissions();
  
  const menuItems = [
    { icon: "icon1.svg", text: "Dashboard", path: "/admin/dashboard", feature: "dashboard" },
    { icon: "icon2.svg", text: "Team Dashboard", path: "/admin/team-dashboard", feature: "teamDashboard" },
    { icon: "icon3.svg", text: "Lead", path: "/admin/leads", feature: "leads" },
    { icon: "icon4.svg", text: "Broadcast", path: "/admin/broadcast", feature: "broadcast" },
    { icon: "icon5.svg", text: "Projects & Dev", path: "/admin/projects", feature: "projects" },
    { icon: "icon6.svg", text: "Agents", path: "/admin/agents", feature: "agents" }
  ].filter(item => hasFeature(item.feature));

  // Handle menu item click - close sidebar only for tablets
  const handleMenuItemClick = () => {
    if (isTablet && closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <nav 
        className="relative flex-col h-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] hidden md:flex" 
        style={{ backgroundColor: 'var(--blue100)' }}
      >
        {/* Menu Items */}
        <div className="mx-2">
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

        {/* Bottom text */}
        <div
          className="flex justify-items-start absolute bottom-4 overflow-hidden text-xs"
          style={{
            transition: "width 0.3s ease, opacity 0.3s ease",
            width: isOpen ? "11rem" : "0",
            marginLeft: isOpen ? "20px" : "10px",
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
