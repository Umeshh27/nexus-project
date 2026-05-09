import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, logout } from '../features/auth/authSlice';
import ProfileSettings from '../features/settings/components/ProfileSettings';
import PasswordChange from '../features/settings/components/PasswordChange';
import OrgDetails from '../features/organization/components/OrgDetails';
import InviteCodeManager from '../features/admin/components/InviteCodeManager';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export default function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try { await axios.delete(`${API_BASE_URL}/api/users/account`, { withCredentials: true }); dispatch(logout()); toast.success('Account deleted'); navigate('/'); }
    catch { toast.error('Failed to delete account'); }
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your profile and account preferences.</p>
      </div>
      <ProfileSettings />
      <PasswordChange />
      <OrgDetails />
      <InviteCodeManager />
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
        <p className="text-sm text-gray-600 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
        <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors mt-3">
          <Trash2 size={14} /> Delete Account
        </button>
      </div>
      <ConfirmModal isOpen={showDeleteModal} title="Delete Account" message="This will permanently delete your account, all your data, and remove you from your organization. This action cannot be undone." confirmText="Delete My Account" danger onConfirm={handleDeleteAccount} onCancel={() => setShowDeleteModal(false)} />
    </div>
  );
}
