import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Leaf, User, Mail, Lock, Users, ArrowRight, Sparkles, CheckCircle, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';

const API_BASE_URL = 'http://localhost:3001';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'farmer'
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { connectWallet, isConnected, account, isMetaMaskInstalled } = useWeb3();
  const router = useRouter();

  const handleWalletConnect = async () => {
    try {
      if (!isMetaMaskInstalled) {
        alert('Please install MetaMask browser extension to connect your wallet');
        window.open('https://metamask.io/', '_blank');
        return;
      }
      
      const result = await connectWallet();
      alert(`Wallet connected successfully!\nAddress: ${result.account}\nChain ID: ${result.chainId}`);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      let errorMessage = 'Failed to connect wallet.';
      
      if (error.message.includes('User rejected')) {
        errorMessage = 'Connection cancelled by user.';
      } else if (error.message.includes('MetaMask')) {
        errorMessage = 'MetaMask error. Please try again.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network connection issue. Please check your settings.';
      }
      
      alert(errorMessage);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        login(result.user);
        alert('Account created successfully!');
        
        // Redirect based on user type
        const dashboardUrl = result.user.userType === 'farmer' ? '/farmer-dashboard' 
          : result.user.userType === 'manufacturer' ? '/manufacturer-dashboard' 
          : '/consumer-portal';
        router.push(dashboardUrl);
      } else {
        alert(result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-400/10 via-emerald-300/5 to-teal-400/10"></div>
        
        {/* Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-300/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          {/* Signup Card */}
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-4 shadow-lg"
              >
                <Sparkles className="text-white" size={32} />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                Join HerbsTrace
              </h1>
              <p className="text-green-100">Create your account and start your journey</p>
              
              <div className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full mt-4">
                <CheckCircle className="text-green-300 mr-2" size={16} />
                <span className="text-green-200 text-sm">Free Registration</span>
              </div>
            </div>
            
            <form onSubmit={handleSignup} className="space-y-6">
              {/* User Type Selection */}
              <div>
                <label className="block text-green-100 text-sm font-medium mb-2">
                  <Users className="inline mr-2" size={16} />
                  I am a...
                </label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                  value={formData.userType}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                >
                  <option value="farmer" className="text-gray-800">🌱 Farmer/Collector</option>
                  <option value="manufacturer" className="text-gray-800">🏭 Manufacturer</option>
                  <option value="consumer" className="text-gray-800">👤 Consumer/User</option>
                </select>
              </div>
              
              {/* Name Input */}
              <div>
                <label className="block text-green-100 text-sm font-medium mb-2">
                  <User className="inline mr-2" size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              {/* Email Input */}
              <div>
                <label className="block text-green-100 text-sm font-medium mb-2">
                  <Mail className="inline mr-2" size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              {/* Password Input */}
              <div>
                <label className="block text-green-100 text-sm font-medium mb-2">
                  <Lock className="inline mr-2" size={16} />
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              
              {/* Signup Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center justify-center"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2" size={20} />
                  </>
                )}
              </motion.button>
              
              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-green-200 text-sm">or</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>
              
              {/* Wallet Connect Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full border border-white/30 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center backdrop-blur-sm ${
                  isConnected 
                    ? 'bg-green-500/20 text-green-200 border-green-400/30' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                onClick={handleWalletConnect}
                disabled={isConnected}
              >
                <Wallet className="mr-2" size={20} />
                {isConnected ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
              </motion.button>
            </form>
            
            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-green-100">
                Already have an account?{' '}
                <a href="/login" className="text-green-300 hover:text-green-200 font-semibold transition-colors">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}