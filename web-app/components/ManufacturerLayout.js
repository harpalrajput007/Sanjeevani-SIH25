import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Factory, BarChart3, Package, LogOut, User, Menu, X } from 'lucide-react';

export default function ManufacturerLayout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log('Logout button clicked');
    try {
      logout();
      console.log('Logout function called');
      router.push('/login');
      console.log('Redirecting to login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Manufacturer Navbar */}
      <nav className="bg-white shadow-lg border-b-2 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Factory className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-blue-900">ManuTrace</span>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                <button
                  onClick={() => router.push('/manufacturer-dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname === '/manufacturer-dashboard' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <Package className="inline-block w-4 h-4 mr-1" />
                  Dashboard
                </button>
                
                <button
                  onClick={() => router.push('/manufacturer-analytics')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname === '/manufacturer-analytics' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <BarChart3 className="inline-block w-4 h-4 mr-1" />
                  Analytics
                </button>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-sm text-gray-700">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">{user?.name}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Manufacturer
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
              
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
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  router.push('/manufacturer-analytics');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <BarChart3 className="inline-block w-4 h-4 mr-2" />
                Analytics
              </button>
              
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
              >
                <LogOut className="inline-block w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}