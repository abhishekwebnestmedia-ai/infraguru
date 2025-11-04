import React from 'react'

import { Bell, UserRound, Menu, X, Settings } from "lucide-react";
const Notificationbell = () => {
  return (
    <div>
        <div className="relative">
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-[var(--blue700)]" />
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-[10px] text-white">
              2
            </span>
          </div>

    </div>
  )
}

export default Notificationbell
