import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, Leaf } from 'lucide-react';

export default function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-lg sm:text-xl lg:text-2xl font-bold text-green-700 hover:text-green-800 transition-colors">
              <Leaf className="mr-1 sm:mr-2" size={20} />
              HerbsTrace
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50">
              About Us
            </Link>
            <Link href="/consumer-portal" className="text-gray-700 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50">
              Track Product
            </Link>
            
            {/* Desktop User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center text-gray-700 hover:text-green-600 font-medium p-2 rounded-md hover:bg-green-50 transition-colors"
              >
                <User size={20} />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-200">
                  <Link href="/login" className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/signup" className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-green-600 p-2 rounded-md hover:bg-green-50 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-2">
              <Link 
                href="/" 
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/consumer-portal" 
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Track Product
              </Link>
              
              {/* Mobile Auth Links */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link 
                  href="/login" 
                  className="block px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="block px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md font-medium transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}