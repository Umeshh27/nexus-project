import { useGetOrganizationQuery } from '../orgApi';
import { Building2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrgDetails() {
  const { data: org, isLoading } = useGetOrganizationQuery();

  const copyInviteCode = () => {
    if (org?.inviteCode) { navigator.clipboard.writeText(org.inviteCode); toast.success('Invite code copied!'); }
  };

  if (isLoading) return <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-gray-200 border-t-navy-500 rounded-full animate-spin"></div></div>;
  if (!org) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-navy-50 rounded-xl p-3"><Building2 size={24} className="text-navy-500" /></div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">{org.name}</h3>
          <p className="text-sm text-gray-400">Organization ID: {org._id}</p>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4 mt-2 space-y-2">
        <label className="text-sm font-medium text-gray-600">Invite Code</label>
        <div className="flex items-center gap-2">
          <code className="bg-gray-50 px-4 py-2 rounded-lg text-sm font-mono flex-1 text-gray-700">{org.inviteCode}</code>
          <button onClick={copyInviteCode} className="p-2 text-gray-400 hover:text-navy-500 hover:bg-gray-100 rounded-lg transition-colors" title="Copy invite code"><Copy size={16} /></button>
        </div>
        <p className="text-xs text-gray-400">Share this code with team members to let them join your organization.</p>
      </div>
    </div>
  );
}
