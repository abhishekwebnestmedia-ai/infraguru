import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, UserRound } from "lucide-react";

const TopBar = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between bg-white h-14 px-4 border rounded-lg" style={{borderColor: "var(--blue300)"}}>
      {/* ─── LEFT ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-10">
        {/* hamburger */}
        <button onClick={toggleSidebar} className="p-1">
          <img src="/icons/topbarIcon.svg" alt="menu" className="w-6 h-6" />
        </button>

        {/* logo */}
        <img src="/logo/infraguruLogo.svg" alt="InfraGuru" className="h-10 w-auto" />

        {/* divider */}
        <div className="h-12 w-px bg-[var(--blue300)] mx-4" />

        {/* welcome text */}
        <p className="text-sm font-medium whitespace-nowrap">Welcome User</p>
      </div>

      {/* ─── RIGHT ────────────────────────────────────────────── */}
      <div className="flex items-center gap-6">
        {/* help */}
        <Link to="/help" className="relative">
          <img src="/icons/help.svg" alt="help" className="w-6 h-6" />
        </Link>

        {/* notification with badge */}
        <div className="relative">
          <Bell className="w-6 h-6 text-[var(--blue700)]" />
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-[10px] text-white">
            2
          </span>
        </div>

        {/* user avatar container */}
        <button onClick={() => setOpen(!open)} className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[var(--blue100)]">
          <UserRound/>
        </button>

        {/* dropdown */}
        {open && (
          <div className="absolute right-4 top-16 w-40 bg-white border rounded shadow-lg z-50">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
