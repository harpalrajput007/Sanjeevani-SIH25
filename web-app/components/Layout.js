import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout: authLogout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log('=== LOGOUT BUTTON CLICKED ===');
    console.log('User before logout:', user);
    console.log('isAuthenticated before:', isAuthenticated());
    
    try {
      console.log('Calling authLogout...');
      authLogout();
      console.log('AuthLogout completed');
      
      console.log('Pushing to home page...');
      router.push('/login');
      console.log('Router push completed');
    } catch (error) {
      console.error('=== LOGOUT ERROR ===', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render layout for public pages
  if (router.pathname === '/' || router.pathname === '/login' || router.pathname === '/signup' || router.pathname === '/about' || router.pathname === '/trace') {
    return children;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    router.push('/login');
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-xl">Redirecting...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated() && router.pathname !== '/' && router.pathname !== '/trace' && (
        <nav className="bg-white shadow-sm border-b relative z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">HerbsTrace</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {user?.userType === 'farmer' ? 'Farmer' : user?.userType === 'manufacturer' ? 'Manufacturer' : 'Consumer'}
                  </span>
                  {user?.name && (
                    <span className="text-sm text-gray-600">
                      Welcome, {user.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => {
                    const dashboardUrl = user?.userType === 'farmer' ? '/farmer-dashboard' 
                      : user?.userType === 'manufacturer' ? '/manufacturer-dashboard' 
                      : '/consumer-portal';
                    router.push(dashboardUrl);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    (router.pathname === '/dashboard' || router.pathname === '/farmer-dashboard' || router.pathname === '/manufacturer-dashboard' || router.pathname === '/consumer-portal')
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                {user?.userType === 'farmer' && (
                  <button
                    onClick={() => router.push('/analytics')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname === '/analytics' 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Analytics
                  </button>
                )}
                {user?.userType === 'manufacturer' && (
                  <button
                    onClick={() => router.push('/manufacturer-analytics')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname === '/manufacturer-analytics' 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Analytics
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="relative z-50 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer pointer-events-auto text-sm"
                  style={{ pointerEvents: 'auto' }}
                >
                  Logout
                </button>
              </div>
              
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-600 hover:text-gray-900 p-2"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-3 space-y-2">
                {user?.userType === 'farmer' && (
                  <button
                    onClick={() => {
                      router.push('/analytics');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Analytics
                  </button>
                )}
                {user?.userType === 'manufacturer' && (
                  <button
                    onClick={() => {
                      router.push('/manufacturer-analytics');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Analytics
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </nav>
      )}
      <main>{children}</main>
    </div>
  );
}