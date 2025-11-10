import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../../shared/components/TopBar';
import SidebarMenu from '../../shared/components/SidebarMenu';

const UserDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTablet, setIsTablet] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Detect tablet screen size and set initial sidebar state
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const isTabletScreen = width >= 768 && width < 1024;
      setIsTablet(isTabletScreen);
      if (isTabletScreen) {
        setIsSidebarOpen(false);
      } else if (width >= 1024) {
        setIsSidebarOpen(true);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar on outside click for tablet
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isTablet &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    if (isTablet && isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTablet, isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden p-2 md:p-4" style={{ backgroundColor: 'var(--blue100)' }}>
      <div className="mb-4">
        <TopBar toggleSidebar={toggleSidebar} toggleButtonRef={toggleButtonRef} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`hidden md:block flex-shrink-0 h-full rounded-l-lg overflow-hidden transition-[width] duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-0'
          }`}
          style={{ willChange: 'width' }}
        >
          <div className={`w-64 h-full transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <SidebarMenu isOpen={isSidebarOpen} closeSidebar={closeSidebar} isTablet={isTablet} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[var(--blue100)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
