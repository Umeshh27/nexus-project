import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUser } from '../../auth/authSlice';
import { User, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../../../utils/constants';

export default function ProfileSettings() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`${API_BASE_URL}/api/users/profile`, formData, { withCredentials: true });
      dispatch(updateUser(data.user));
      toast.success('Profile updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update profile'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900"><User size={20} />Profile Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input type="email" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed" value={formData.email} disabled />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>
        <button type="submit" className="flex items-center gap-2 bg-navy-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-navy-600 transition-colors disabled:opacity-50" disabled={loading}>
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={16} />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
