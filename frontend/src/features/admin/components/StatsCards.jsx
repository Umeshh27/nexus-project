import { useGetAdminStatsQuery } from '../adminApi';
import { Users, FileText, MessageSquare, TrendingUp } from 'lucide-react';

const statConfig = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'text-navy-500', bg: 'bg-navy-50' },
  { key: 'totalDocuments', label: 'Total Documents', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { key: 'queriesToday', label: 'Queries Today', icon: MessageSquare, color: 'text-sky-500', bg: 'bg-sky-50' },
  { key: 'activeUsers', label: 'Active Users', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
];

export default function StatsCards() {
  const { data: stats = {}, isLoading } = useGetAdminStatsQuery();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map(({ key, label, icon: Icon, color, bg }) => (
        <div key={key} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-200 border-t-navy-500 rounded-full animate-spin mt-2"></div>
              ) : (
                <p className="text-2xl font-bold mt-1 text-gray-900">{stats[key] || 0}</p>
              )}
            </div>
            <div className={`p-3 rounded-xl ${bg} ${color}`}><Icon size={22} /></div>
          </div>
        </div>
      ))}
    </div>
  );
}
