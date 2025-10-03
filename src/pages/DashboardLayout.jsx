import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../components/SidebarMenu";
import TopBar from "../components/TopBar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden p-4"
      style={{ backgroundColor: 'var(--blue100)' }}
    >
      {/* Fixed Top Bar with margin */}
      <div className="mb-4">
        <TopBar toggleSidebar={toggleSidebar} />
      </div>

      {/* Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden rounded-lg">
        {/* Sidebar */}
        <aside
          className={`
            flex-shrink-0 h-full rounded-l-lg overflow-hidden
            transition-[width] duration-300 ease-in-out
            ${isSidebarOpen ? "w-64" : "w-0"}
          `}
          style={{ willChange: "width" }}
        >
          {/* Always render SidebarMenu for smooth animations */}
          <div
            className={`w-64 h-full transition-opacity duration-300 ease-in-out ${isSidebarOpen ? "opacity-100" : "opacity-0"
              }`}
          >
            <SidebarMenu isOpen={isSidebarOpen} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[var(--blue100)] rounded-r-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet /> {/* Dashboard pages will render here */}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
