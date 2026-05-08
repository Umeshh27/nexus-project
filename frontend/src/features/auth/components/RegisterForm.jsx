import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../authSlice';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function RegisterForm() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialInviteCode = urlParams.get('inviteCode') || '';

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    orgAction: 'join', inviteCode: initialInviteCode, orgName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const payload = {
        name: formData.name, email: formData.email, password: formData.password, orgAction: formData.orgAction,
        ...(formData.orgAction === 'join' ? { inviteCode: formData.inviteCode } : { orgName: formData.orgName }),
      };
      const { data } = await axios.post('/api/auth/register', payload, { withCredentials: true });
      dispatch(setCredentials(data));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-colors";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-400 mt-1 text-sm">Join your organization on Nexus</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="register-name">Full Name</label>
          <input id="register-name" type="text" name="name" placeholder="John Doe" className={inputCls} value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="register-email">Email</label>
          <input id="register-email" type="email" name="email" placeholder="you@company.com" className={inputCls} value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="register-password">Password</label>
          <div className="relative">
            <input id="register-password" type={showPassword ? 'text' : 'password'} name="password" placeholder="Min 6 characters" className={`${inputCls} pr-10`} value={formData.password} onChange={handleChange} required />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="register-confirm-password">Confirm Password</label>
          <input id="register-confirm-password" type="password" name="confirmPassword" placeholder="••••••••" className={inputCls} value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        {/* Organization Join/Create Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization</label>
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button type="button" className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${formData.orgAction === 'join' ? 'bg-white text-navy-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setFormData({ ...formData, orgAction: 'join' })}>
              Join Existing
            </button>
            <button type="button" className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${formData.orgAction === 'create' ? 'bg-white text-navy-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setFormData({ ...formData, orgAction: 'create' })}>
              Create New
            </button>
          </div>
        </div>

        {formData.orgAction === 'join' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="register-invite-code">Invite Code</label>
            <input id="register-invite-code" type="text" name="inviteCode" placeholder="e.g., NXS-XXXX-XXXX" className={`${inputCls} font-mono`} value={formData.inviteCode} onChange={handleChange} required />
            {formData.inviteCode && (
              <p className="text-xs text-gray-400 mt-1">Your invitation code is preloaded from the invitation link.</p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="register-org-name">Organization Name</label>
            <input id="register-org-name" type="text" name="orgName" placeholder="Acme Corp" className={inputCls} value={formData.orgName} onChange={handleChange} required />
          </div>
        )}

        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-navy-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-600 transition-colors disabled:opacity-50" disabled={loading}>
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <UserPlus size={18} />}
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-gray-400">Already registered?</span></div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-navy-500 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
