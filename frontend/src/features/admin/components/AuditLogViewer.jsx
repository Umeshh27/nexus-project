import { useState } from 'react';
import { useGetAuditLogsQuery } from '../adminApi';
import { Shield } from 'lucide-react';

const ACTION_COLORS = {
  LOGIN: 'bg-blue-50 text-blue-600', LOGOUT: 'bg-gray-100 text-gray-500',
  FILE_UPLOAD: 'bg-green-50 text-green-600', FILE_DELETE: 'bg-red-50 text-red-500',
  QUERY_SENT: 'bg-navy-50 text-navy-500', ROLE_CHANGE: 'bg-yellow-50 text-yellow-600',
  USER_DEACTIVATED: 'bg-red-50 text-red-500', ACCOUNT_DELETED: 'bg-red-50 text-red-500',
};

export default function AuditLogViewer() {
  const [filters, setFilters] = useState({ userId: '', startDate: '', endDate: '' });
  const { data: logs = [], isLoading } = useGetAuditLogsQuery(filters);

  const inputCls = "px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">User ID</label>
          <input type="text" placeholder="Filter by user..." className={inputCls} value={filters.userId} onChange={(e) => setFilters({ ...filters, userId: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
          <input type="date" className={inputCls} value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
          <input type="date" className={inputCls} value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-gray-200 border-t-navy-500 rounded-full animate-spin"></div></div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-gray-300"><Shield size={48} className="mx-auto mb-3 opacity-30" /><p className="font-medium text-gray-400">No audit logs found</p></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Action</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">IP</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Result</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-2 text-sm">{log.userName || log.userId}</td>
                  <td className="px-3 py-2"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-500'}`}>{log.action}</span></td>
                  <td className="px-3 py-2 text-xs font-mono text-gray-400">{log.ipAddress}</td>
                  <td className="px-3 py-2"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${log.result === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{log.result}</span></td>
                  <td className="px-3 py-2 text-xs text-gray-400 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
