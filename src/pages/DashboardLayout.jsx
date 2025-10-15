import React from "react";
import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../components/SidebarMenu";
import TopBar from "../components/TopBar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTablet, setIsTablet] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null); // Add ref for toggle button

  // Detect tablet screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      // Tablet range: 768px to 1023px (md to lg breakpoint)
      const isTabletScreen = width >= 768 && width < 1024;
      setIsTablet(isTabletScreen);
      
      // Set initial sidebar state based on screen size ONLY on first load
      if (isTabletScreen) {
        setIsSidebarOpen(false); // Closed by default for tablets
      } else if (width >= 1024) { // Desktop
        setIsSidebarOpen(true); // Open by default for desktop
      }
    };

    // Check on mount only
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []); // Empty dependency array to run only on mount

  // Click outside handler for tablets
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only apply to tablets and when sidebar is open
      // Exclude the toggle button from click-outside detection
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

    // Add event listener only for tablets when sidebar is open
    if (isTablet && isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTablet, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden p-2 md:p-4"
      style={{ backgroundColor: 'var(--blue100)' }}
    >
      {/* Fixed Top Bar with margin */}
      <div className="mb-4">
        <TopBar toggleSidebar={toggleSidebar} toggleButtonRef={toggleButtonRef} />
      </div>

      {/* Content Area with Sidebar - Desktop Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Only visible on desktop */}
        <aside
          ref={sidebarRef}
          className={`
            hidden md:block flex-shrink-0 h-full rounded-l-lg overflow-hidden
            transition-[width] duration-300 ease-in-out
            ${isSidebarOpen ? "w-64" : "w-0"}
          `}
          style={{ willChange: "width" }}
        >
          {/* Always render SidebarMenu for smooth animations */}
          <div
            className={`w-64 h-full transition-opacity duration-300 ease-in-out ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <SidebarMenu isOpen={isSidebarOpen} closeSidebar={closeSidebar} isTablet={isTablet} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[var(--blue100)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet /> {/* Dashboard pages will render here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
