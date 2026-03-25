import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-serif font-bold text-deep-leaf mb-6">Access Denied</h1>
        <p className="text-ink/70 mb-8">You do not have permission to view this page.</p>
        <Link to="/" className="px-8 py-4 bg-deep-leaf text-clean-white font-medium uppercase tracking-widest hover:bg-ink transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Admin Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-soft-rose/10 p-6 border border-soft-rose/30 sticky top-28">
            <h2 className="text-xl font-serif font-bold text-deep-leaf mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              <Link 
                to="/admin" 
                className={`block px-4 py-3 text-sm uppercase tracking-widest font-medium transition-colors ${location.pathname === '/admin' ? 'bg-deep-leaf text-clean-white' : 'text-ink/70 hover:bg-soft-rose/20'}`}
              >
                Orders
              </Link>
              <Link 
                to="/admin/products" 
                className={`block px-4 py-3 text-sm uppercase tracking-widest font-medium transition-colors ${location.pathname === '/admin/products' ? 'bg-deep-leaf text-clean-white' : 'text-ink/70 hover:bg-soft-rose/20'}`}
              >
                Products
              </Link>
            </nav>
          </div>
        </div>

        {/* Admin Content */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<AdminOrders />} />
            <Route path="/products" element={<AdminProducts />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
