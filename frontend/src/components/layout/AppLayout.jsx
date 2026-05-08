import { Outlet, useLocation } from 'react-router-dom';
// import Sidebar from './Sidebar';
import TopBar from './TopBar';

/**
 * AppLayout — Main application shell with sidebar + top bar + content area.
 * Used as the layout wrapper for all authenticated routes.
 */
export default function AppLayout() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/dashboard';

  return (
    <div className="flex h-screen bg-base-200">
      {/* {!hideSidebar && <Sidebar />} */}

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-6 py-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
