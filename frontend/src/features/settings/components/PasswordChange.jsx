import { useState } from 'react';
import { Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function PasswordChange() {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (formData.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.put('/api/users/password', { currentPassword: formData.currentPassword, newPassword: formData.newPassword }, { withCredentials: true });
      toast.success('Password updated successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update password'); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900"><Lock size={20} />Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <input type="password" className={inputCls} value={formData.currentPassword} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <input type="password" placeholder="Min 6 characters" className={inputCls} value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
          <input type="password" className={inputCls} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
        </div>
        <button type="submit" className="flex items-center gap-2 bg-navy-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-navy-600 transition-colors disabled:opacity-50" disabled={loading}>
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={16} />}
          Update Password
        </button>
      </form>
    </div>
  );
}
