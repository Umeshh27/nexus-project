import { useGetOrgUsersQuery, useChangeUserRoleMutation, useDeactivateUserMutation } from '../adminApi';
import { UserX } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserTable() {
  const { data: users = [], isLoading } = useGetOrgUsersQuery();
  const [changeRole] = useChangeUserRoleMutation();
  const [deactivateUser] = useDeactivateUserMutation();

  const handleRoleChange = async (userId, newRole) => {
    try { await changeRole({ userId, role: newRole }).unwrap(); toast.success('Role updated'); }
    catch { toast.error('Failed to update role'); }
  };

  const handleDeactivate = async (userId, userName) => {
    if (!window.confirm(`Deactivate ${userName}?`)) return;
    try { await deactivateUser(userId).unwrap(); toast.success('User deactivated'); }
    catch { toast.error('Failed to deactivate user'); }
  };

  if (isLoading) return <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-gray-200 border-t-navy-500 rounded-full animate-spin"></div></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-sm">{user.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
              <td className="px-4 py-3">
                <select className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-navy-500/20" value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="guest">Guest</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                {user.isActive && (
                  <button onClick={() => handleDeactivate(user._id, user.name)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Deactivate user">
                    <UserX size={14} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
