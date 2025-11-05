import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../../../shared/components/TopBar';
import AgentDetailSidebar from './AgentDetailSidebar';

const AgentDetailLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* TopBar - Full width across the top */}
      <div className="bg-[var(--blue100)] p-2 md:p-4">
        <TopBar toggleSidebar={toggleSidebar} />
      </div>
      
      {/* Main Layout*/}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div 
          className={`hidden md:block w-70 transition-transform duration-300 ease-in-out overflow-hidden ${
            isSidebarOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
          }`}
        >
          <AgentDetailSidebar isOpen={isSidebarOpen} />
        </div>
        
        {/* Main Content Area - Responsive */}
        <main 
          className={`flex-1 overflow-y-auto bg-[var(--blue100)] px-2 md:px-4 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'md:ml-0' : 'md:-ml-70'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgentDetailLayout;
