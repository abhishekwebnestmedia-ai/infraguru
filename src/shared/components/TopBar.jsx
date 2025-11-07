import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, UserRound, Menu, X, Settings, LogOut } from "lucide-react";
import { useAuth } from '../hooks/useAuth'
import { usePermissions } from '../hooks/usePermissions'
import Notificationbell from "./bell/Notificationbell";
import { toast } from 'react-toastify';
import api from '../services/apiService';

const TopBar = ({ toggleSidebar, toggleButtonRef }) => {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { hasFeature } = usePermissions();

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

  // Build menu with unified, prefixless routes
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;
  const baseItems = isAdmin
    ? [
        { icon: "icon1.svg", text: "Dashboard", path: `/dashboard`, feature: 'dashboard' },
        { icon: "icon2.svg", text: "Team Dashboard", path: `/team-dashboard`, feature: 'teamDashboard' },
        { icon: "icon3.svg", text: "Lead", path: `/leads`, feature: 'leads' },
        { icon: "icon4.svg", text: "Broadcast", path: `/broadcast`, feature: 'broadcast' },
        { icon: "icon5.svg", text: "Projects & Dev", path: `/projects`, feature: 'projects' },
        { icon: "icon6.svg", text: "Agents", path: `/agents`, feature: 'agents' }
      ]
    : [
        { icon: "icon1.svg", text: "Dashboard", path: `/dashboard`, feature: 'dashboard' },
        { icon: "icon3.svg", text: "My Leads", path: `/leads`, feature: 'leads' },
        { icon: "icon4.svg", text: "Broadcast", path: `/broadcast`, feature: 'broadcast' },
        { icon: "icon7.svg", text: "Profile", path: `/profile`, feature: null }
      ];
  const allMenuItems = baseItems.filter(item => !item.feature || hasFeature(item.feature));

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

  const hasSidebar = typeof toggleSidebar === 'function';

  return (
    <>
      <header className="flex items-center justify-between bg-white h-14 px-4 border rounded-lg" style={{borderColor: "var(--blue300)"}}>
        {/* ─── LEFT ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 md:gap-10">
          {/* hamburger - desktop */}
          {hasSidebar && (
            <button 
              ref={toggleButtonRef} 
              onClick={toggleSidebar} 
              className="p-1 cursor-pointer hidden md:block"
            >
              <img src="/icons/topbarIcon.svg" alt="menu" className="w-6 h-6" />
            </button>
          )}

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
          <img src="/logo/infraguruLogo.svg" alt="logo" className="h-8 w-auto md:h-10" />

          {/* divider - hidden on mobile */}
          <div className="h-12 w-px bg-[var(--blue300)] mx-4 hidden md:block" />

          {/* welcome text - hidden on mobile */}
          <p className="text-sm font-medium whitespace-nowrap hidden md:block">
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

          {/* user avatar container */}
          <button 
            ref={userButtonRef}
            onClick={() => setOpen(!open)} 
            className="relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--blue100)]"
          >
            <UserRound className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* dropdown */}
          {open && (
            <div 
              ref={userDropdownRef}
              className="absolute right-4 top-16 w-40 bg-white border rounded shadow-lg z-50"
            >
              <button 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  navigate(`/profile`);
                  setOpen(false);
                }}
              >
                Profile
              </button>
              <button 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Confirm Logout</h3>
                <p className="text-sm text-gray-600">Are you sure you want to logout?</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              You will need to login again to access your account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={loggingOut}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
            className="md:hidden fixed inset-0 bg-black/50 z-40"
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
                <img src="/logo/infraguruLogo.svg" alt="InfraGuru" className="h-8 w-auto" />
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <X className="w-5 h-5 text-[var(--blue700)]" />
                </button>
              </div>
              
              {/* Navigation Items - All menu items */}
              <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">Navigation</p>
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
              <div className="border-t p-2 " style={{borderColor: "var(--blue300)"}}>
                {/* Settings */}
                <button className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg text-left w-full">
                  <Settings className="w-5 h-5 text-[var(--blue700)]" />
                  <span className="text-base font-medium">Settings</span>
                </button>
                
                {/* Help link */}
                <Link 
                  to="/help" 
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img src="/icons/help.svg" alt="help" className="w-5 h-5" />
                  <span className="text-base font-medium">Help</span>
                </Link>

                {/* Logout */}
                <button 
                  onClick={handleLogoutClick}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg text-left w-full text-red-600"
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
