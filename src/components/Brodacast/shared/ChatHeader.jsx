import React from 'react';
import { Info, ArrowLeft } from 'lucide-react';
import { MessageSquare } from 'lucide-react';

const ChatHeader = ({
  teamName,
  showActiveCount = false,
  activeCount = 0,
  onMenuClick,
  showBackButton = false
}) => {
  return (
    <>
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">

            {/* Mobile Back Button - Only show in mobile single chat view */}
            {showBackButton && (
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}



            <div className="flex flex-col justify-center items-start gap-0.5">
              <h1 className="text-lg font-semibold text-gray-900">{teamName}</h1>
              {showActiveCount && teamName !== 'All' && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{activeCount} active</span>
                </div>
              )}
            </div>
          </div>
          <Info size={20} className="text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>
      <hr style={{ borderColor: '#C6CFFF', borderWidth: '1px' }} className="flex-shrink-0" />
    </>
  );
};

export default ChatHeader;
