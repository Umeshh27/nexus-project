import { useState, lazy, Suspense } from 'react';

// Lazy load admin components
const StatsCards = lazy(() => import('../features/admin/components/StatsCards'));
const UserTable = lazy(() => import('../features/admin/components/UserTable'));
const InviteTokenTable = lazy(() => import('../features/admin/components/InviteTokenTable'));
const AdminDocTable = lazy(() => import('../features/admin/components/AdminDocTable'));
const AuditLogViewer = lazy(() => import('../features/admin/components/AuditLogViewer'));

// Loading component for admin components
const AdminLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-6 h-6 border-2 border-gray-200 border-t-navy-500 rounded-full animate-spin"></div>
  </div>
);

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'invites', label: 'Invites' },
  { id: 'documents', label: 'Documents' },
  { id: 'audit', label: 'Audit Logs' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Central command center for your organization.</p>
      </div>

      <div className="flex border-b border-gray-200 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id ? 'border-navy-500 text-navy-500' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'overview' && (
          <Suspense fallback={<AdminLoader />}>
            <StatsCards />
          </Suspense>
        )}
        {activeTab === 'users' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Members</h2>
            <Suspense fallback={<AdminLoader />}>
              <UserTable />
            </Suspense>
          </div>
        )}
        {activeTab === 'invites' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Invite Codes</h2>
            <Suspense fallback={<AdminLoader />}>
              <InviteTokenTable />
            </Suspense>
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Organization Documents</h2>
            <Suspense fallback={<AdminLoader />}>
              <AdminDocTable />
            </Suspense>
          </div>
        )}
        {activeTab === 'audit' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Logs</h2>
            <Suspense fallback={<AdminLoader />}>
              <AuditLogViewer />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
