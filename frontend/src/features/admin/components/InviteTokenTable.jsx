import { useGetInviteTokensQuery } from '../adminApi';

export default function InviteTokenTable() {
  const { data: invites = [], isLoading } = useGetInviteTokensQuery();

  if (isLoading) return <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-gray-200 border-t-navy-500 rounded-full animate-spin"></div></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expires</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {invites.map((invite) => {
            const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
            const status = invite.isUsed ? 'Used' : isExpired ? 'Expired' : 'Active';
            return (
              <tr key={invite._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-sm">{invite.code}</td>
                <td className="px-4 py-3 text-sm text-gray-500 capitalize">{invite.role}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{invite.level}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{invite.recipientEmail || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${invite.isUsed ? 'bg-gray-100 text-gray-700' : isExpired ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                    {status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(invite.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{invite.expiresAt ? new Date(invite.expiresAt).toLocaleDateString() : 'Never'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
