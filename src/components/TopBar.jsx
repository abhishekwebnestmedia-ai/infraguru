import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, UserRound, Menu, X, Settings, LogOut, User, Power } from "lucide-react";
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify';
import api from '../services/apiService';
import Notificationbell from '../shared/components/bell/Notificationbell';

const TopBar = ({ toggleSidebar, toggleButtonRef }) => {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Refs for click outside detection
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const mobileButtonRef = useRef(null);

  // Handle logout click - show confirmation
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setOpen(false);
    setMobileMenuOpen(false);
  };

  // Handle confirmed logout
  const handleConfirmLogout = async () => {
    try {
      setLoggingOut(true);
      // Call logout API
      await api.post('/auth/logout');
      
      // Clear local state
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, still logout locally
      logout();
      toast.info('Logged out locally');
      navigate('/login');
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  // All menu items for mobile navigation
  const allMenuItems = [
    { icon: "icon1.svg", text: "Dashboard", path: "/" },
    { icon: "icon2.svg", text: "Team Dashboard", path: "/team-dashboard" },
    { icon: "icon3.svg", text: "Lead", path: "/lead" },
    { icon: "icon4.svg", text: "Broadcast", path: "/broadcast/admin" },
    { icon: "icon5.svg", text: "Projects & Dev", path: "/projects-dev" },
    { icon: "icon6.svg", text: "Agents", path: "/agents" }
  ];

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user dropdown if clicked outside
      if (
        userDropdownRef.current && 
        !userDropdownRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target) &&
        open
      ) {
        setOpen(false);
      }

      // Close mobile menu if clicked outside
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target) &&
        mobileMenuOpen
      ) {
        setMobileMenuOpen(false);
      }
    };

    // Add event listener when either dropdown is open
    if (open || mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, mobileMenuOpen]);

  return (
    <>
      <header className="flex items-center justify-between px-4 bg-white border rounded-lg h-14" style={{borderColor: "var(--blue300)"}}>
        {/* ─── LEFT ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 md:gap-10">
          {/* hamburger - desktop */}
          <button 
            ref={toggleButtonRef} 
            onClick={toggleSidebar} 
            className="hidden p-1 cursor-pointer md:block"
          >
            <img src="/icons/topbarIcon.svg" alt="menu" className="w-6 h-6" />
          </button>

          {/* hamburger - mobile */}
          <button 
            ref={mobileButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-1 cursor-pointer md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[var(--blue700)]" />
            ) : (
              <img src="/icons/topbarIcon.svg" className="w-6 h-6 text-[var(--blue700)]" />
            )}
          </button>

          {/* logo */}
          <img src="/logo/webnestmediaLogo.svg" alt="logo" className="w-auto h-8 md:h-10" />

          {/* divider - hidden on mobile */}
          <div className="h-12 w-px bg-[var(--blue300)] mx-4 hidden md:block" />

          {/* welcome text - hidden on mobile */}
          <p className="hidden text-sm font-medium whitespace-nowrap md:block">
            Welcome {user?.name || 'User'}
          </p>
        </div>

        {/* ─── RIGHT ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* help - hidden on mobile */}
          <Link to="/help" className="relative hidden md:block">
            <img src="/icons/help.svg" alt="help" className="w-6 h-6" />
          </Link>

          {/* notification with badge */}
          
          {/* <div className="relative">
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-[var(--blue700)]" />
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-[10px] text-white">
              2
            </span>
          </div> */}
          <Notificationbell />

          {/* user avatar dropdown */}
          <div className="relative">
            <button
              ref={userButtonRef}
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--blue100)] hover:bg-[var(--blue200)] transition-colors"
            >
              <UserRound className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {open && (
              <div
                ref={userDropdownRef}
                className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full"
              >
                <button
                  onClick={() => {
                    navigate('/profile');
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <User size={16} />
                  <span className="text-sm">Profile</span>
                </button>
                <button
                  onClick={() => {
                    handleLogoutClick();
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Power size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Confirm Logout</h3>
                <p className="text-sm text-gray-600">Are you sure you want to logout?</p>
              </div>
            </div>
            
            <p className="mb-6 text-gray-600">
              You will need to login again to access your account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 px-4 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={loggingOut}
                className="flex items-center justify-center flex-1 gap-2 px-4 py-2 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loggingOut ? (
                  <>
                    <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                    Logging out...
                  </>
                ) : (
                  'Logout'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Slider */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 md:hidden bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Slider Menu */}
          <div 
            ref={mobileMenuRef}
            className="md:hidden fixed top-0 left-0 h-full w-[80%] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
            style={{borderColor: "var(--blue300)"}}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{borderColor: "var(--blue300)"}}>
                <img src="/logo/webnestmediaLogo.svg" alt="webnestmedia" className="w-auto h-8" />
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-[var(--blue700)]" />
                </button>
              </div>
              
              {/* Navigation Items - All menu items */}
              <div className="flex-1 p-2 overflow-y-auto">
                <div className="space-y-2">
                  <p className="mb-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Navigation</p>
                  {allMenuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={index}
                        to={item.path}
                        className={`flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors ${
                          isActive ? 'bg-blue-50 text-blue-700 ' : ''
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span 
                          className="flex items-center justify-center w-10 h-10 rounded-lg"
                          style={{
                            backgroundColor: isActive ? 'var(--blue700)' : 'var(--blue700)'
                          }}
                        >
                          <img 
                            src={`/icons/${item.icon}`} 
                            alt={item.text} 
                            className="w-5 h-5 filter brightness-0 invert" 
                          />
                        </span>
                        <span className="text-base font-medium">{item.text}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bottom section */}
              <div className="p-2 border-t " style={{borderColor: "var(--blue300)"}}>
                {/* Settings */}
                <button className="flex items-center w-full gap-4 p-3 text-left rounded-lg hover:bg-gray-50">
                  <Settings className="w-5 h-5 text-[var(--blue700)]" />
                  <span className="text-base font-medium">Settings</span>
                </button>
                
                {/* Help link */}
                <Link 
                  to="/help" 
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img src="/icons/help.svg" alt="help" className="w-5 h-5" />
                  <span className="text-base font-medium">Help</span>
                </Link>

                {/* Logout */}
                <button 
                  onClick={handleLogoutClick}
                  className="flex items-center w-full gap-4 p-3 text-left text-red-600 rounded-lg hover:bg-gray-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-base font-medium">Logout</span>
                </button>

                {/* Powered by text */}
                <div className="pt-4 text-center">
                  <span className="text-xs text-gray-400">Powered By WebnestMedia</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TopBar;
