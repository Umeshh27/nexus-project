import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectCurrentUser, logout } from '../../features/auth/authSlice';
import { LogOut, Bell, ChevronDown, User, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const notifications = [
  { id: 1, title: 'New document uploaded', description: 'Your latest PDF is ready in File Manager.' },
  { id: 2, title: 'New chat reply', description: 'Nexus has answered your latest question.' },
  { id: 3, title: 'Organization update', description: 'A new policy was shared with your team.' },
];

export default function TopBar() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationsAnimated, setNotificationsAnimated] = useState(false);
  const [profileMenuAnimated, setProfileMenuAnimated] = useState(false);
  const menuRef = useRef(null);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((segment) => segment[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ME';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showNotifications) {
      setNotificationsAnimated(false);
      const timer = setTimeout(() => setNotificationsAnimated(true), 10);
      return () => clearTimeout(timer);
    } else {
      setNotificationsAnimated(false);
    }
  }, [showNotifications]);

  useEffect(() => {
    if (showProfileMenu) {
      setProfileMenuAnimated(false);
      const timer = setTimeout(() => setProfileMenuAnimated(true), 10);
      return () => clearTimeout(timer);
    } else {
      setProfileMenuAnimated(false);
    }
  }, [showProfileMenu]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch {
      // Continue with client-side logout even if server call fails
    }
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-[#223959] border-b border-[#1fab78]/20 px-6 py-3 relative z-10 shadow-md">
      <div className="flex items-center justify-between">
        
        {/* Left Side: NEXUS Branding */}
        <div className="flex items-center">
          <Link 
            to="/dashboard" 
            className="font-nexus text-3xl font-bold tracking-widest text-white drop-shadow-md transition-opacity hover:opacity-90"
          >
            NEXUS
          </Link>
        </div>

        {/* Right Side: Role, Notifications, Profile */}
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#9acee2]/70 hidden sm:inline-block uppercase tracking-wider font-semibold">Role</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm uppercase tracking-[0.1em] text-[#9acee2] shadow-sm font-semibold">
              {user?.role || 'Member'}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications((current) => !current);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-2xl bg-white/10 text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-white/20 hover:scale-105 hover:shadow-md active:scale-95"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            {showNotifications && (
              <div className={`absolute right-0 mt-3 w-80 rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl text-white overflow-hidden transition-all duration-300 ease-out ${
                notificationsAnimated ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'
              }`}>
                <div className="px-4 py-4 border-b border-white/10">
                  <p className="text-sm font-semibold">Notifications</p>
                  <p className="text-xs text-slate-300">Latest updates for your member account</p>
                </div>
                <div className="divide-y divide-white/10">
                  {notifications.map((item) => (
                    <div key={item.id} className="px-4 py-4 hover:bg-white/5 transition-colors duration-150">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-300">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 text-right">
                  <Link to="/dashboard" className="text-sm font-medium text-[#9acee2] hover:text-white transition-colors duration-150">
                    View all
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu((current) => !current);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-white/20 hover:scale-105 hover:shadow-md active:scale-95"
              aria-label="Profile menu"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#223959] text-sm font-semibold transition-transform duration-200 hover:scale-110">
                {initials}
              </span>
              <ChevronDown size={16} className="transition-transform duration-200" />
            </button>

            {showProfileMenu && (
              <div className={`absolute right-0 mt-3 w-56 rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl overflow-hidden text-white transition-all duration-300 ease-out ${
                profileMenuAnimated ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'
              }`}>
                <Link
                  to="/personalization"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors duration-150"
                >
                  <User size={16} />
                  <span>Personalization</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors duration-150"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#ff7b7b] hover:bg-red-50/10 transition-colors duration-150"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}