import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectUserRole } from '../../features/auth/authSlice';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Shield,
  Settings,
  Brain,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'member', 'guest'] },
  { to: '/chat', label: 'Chat', icon: MessageSquare, roles: ['admin', 'member', 'guest'] },
  { to: '/documents', label: 'Documents', icon: FileText, roles: ['admin', 'member'] },
  { to: '/admin', label: 'Admin Panel', icon: Shield, roles: ['admin'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['admin', 'member', 'guest'] },
];

export default function Sidebar() {
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectUserRole);

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-navy-500 rounded-lg p-1.5">
            <Brain size={22} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-wide text-navy-500">NEXUS</span>
            <p className="text-[10px] text-gray-400 -mt-0.5">AI Knowledge Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {filteredItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-navy-50 text-navy-500'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-500 flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-gray-800">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
