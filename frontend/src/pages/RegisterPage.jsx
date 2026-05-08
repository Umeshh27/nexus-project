import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import RegisterForm from '../features/auth/components/RegisterForm';
import { Brain } from 'lucide-react';

export default function RegisterPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-navy-500 rounded-2xl p-3">
              <Brain size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">NEXUS</h1>
          <p className="text-sm text-gray-400 mt-1">Create your account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
