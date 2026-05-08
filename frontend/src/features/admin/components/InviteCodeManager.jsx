import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ShieldCheck, Clipboard, Mail, Send, Copy, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { selectAccessToken, selectCurrentUser } from '../../auth/authSlice';
import { useCreateInviteTokenMutation, useSendInviteEmailMutation } from '../adminApi';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'guest', label: 'Guest' },
];

export default function InviteCodeManager() {
  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(selectAccessToken);
  const [role, setRole] = useState('member');
  const [level, setLevel] = useState(1);
  const [inviteCode, setInviteCode] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isCreated, setIsCreated] = useState(false);

  const [createInviteToken, { isLoading: isCreating }] = useCreateInviteTokenMutation();
  const [sendInviteEmail, { isLoading: isSending }] = useSendInviteEmailMutation();

  const handleGenerateCode = async () => {
    if (!accessToken) {
      toast.error('Please sign in again before generating invite codes.');
      return;
    }

    try {
      const data = await createInviteToken({ role, level }).unwrap();
      setInviteCode(data.code);
      setIsCreated(true);
      try {
        if (data.code && navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(data.code);
          toast.success('Invite code generated and copied to clipboard.');
          return;
        }
      } catch {
        toast('Invite code generated. Copy it below.');
      }
      toast.success('Invite code generated successfully.');
    } catch (error) {
      console.error('Invite generation error:', error);
      toast.error(error?.data?.message || error?.error || 'Failed to generate invite code.');
    }
  };

  const handleSendEmail = async () => {
    if (!inviteCode) return toast.error('Generate a code first.');
    if (!recipientEmail) return toast.error('Enter user email.');

    try {
      await sendInviteEmail({ code: inviteCode, email: recipientEmail }).unwrap();
      toast.success(`Invitation sent to ${recipientEmail}`);
      setRecipientEmail('');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to send invite email.');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-navy-50 rounded-xl p-3"><ShieldCheck size={24} className="text-navy-500" /></div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">Invite Staff</h3>
          <p className="text-sm text-gray-400">Create one-time invitation codes for users in your organization.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500">
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Hierarchy Level</label>
          <input
            type="number"
            min="1"
            max="10"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
          />
        </div>
      </div>

      {!accessToken && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-start gap-2">
          <AlertTriangle size={18} className="mt-0.5" />
          <div>
            Your session needs to be refreshed. Reload the page or log in again before generating invite codes.
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleGenerateCode}
        disabled={isCreating}
        className="mt-5 inline-flex items-center gap-2 bg-navy-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-navy-600 transition-colors disabled:opacity-50"
      >
        <Clipboard size={16} />
        {isCreating ? 'Generating...' : 'Generate Invite Code'}
      </button>

      {inviteCode && (
        <div className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-gray-700">Invite Code</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-gray-50 px-4 py-3 rounded-xl text-sm font-mono text-gray-700 break-all">{inviteCode}</code>
            <button
              type="button"
              onClick={() => { navigator.clipboard.writeText(inviteCode); toast.success('Code copied'); }}
              className="p-2 text-gray-400 hover:text-navy-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400">One-time use only. After acceptance, this code will expire.</p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Recipient Email</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="new.user@example.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
              />
            </div>
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isSending}
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              <Mail size={16} />
              {isSending ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
