import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-navy-100">404</h1>
        <h2 className="text-2xl font-bold mt-4 text-gray-900">Page Not Found</h2>
        <p className="text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-navy-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-navy-600 transition-colors mt-6">
          <Home size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
