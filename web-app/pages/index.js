import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, Shield, Zap, Users, ArrowRight, CheckCircle, Globe, Microscope } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 via-emerald-300/10 to-teal-400/20 animate-pulse"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-300/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Large Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-teal-400/10 to-green-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/5 to-green-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10"></div>

      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative py-10 sm:py-16 lg:py-20 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
                  <Leaf className="text-green-300 mr-2" size={20} />
                  <span className="text-white font-medium">Powered by Blockchain Technology</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                  <span className="bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
                    HerbsTrace
                  </span>
                  <br />
                  <span className="text-white">Herb Traceability</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-green-100 mb-6 sm:mb-8 leading-relaxed">
                  Revolutionary blockchain-based platform ensuring complete transparency 
                  and authenticity of Ayurvedic herbs from farm to consumer.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/consumer-portal" className="group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 font-semibold flex items-center justify-center shadow-lg"
                    >
                      <Microscope className="mr-2" size={20} />
                      Trace Your Product
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </motion.div>
                  </Link>
                  
                  <Link href="/login" className="group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-600 hover:text-white font-semibold flex items-center justify-center transition-all"
                    >
                      <Users className="mr-2" size={20} />
                      Join Platform
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-green-100 to-amber-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="text-3xl mb-3">🌱</div>
                      <div className="text-2xl font-bold text-green-600">100%</div>
                      <div className="text-sm text-gray-600">Traceable</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="text-3xl mb-3">🔒</div>
                      <div className="text-2xl font-bold text-blue-600">Secure</div>
                      <div className="text-sm text-gray-600">Blockchain</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="text-3xl mb-3">⚡</div>
                      <div className="text-2xl font-bold text-amber-600">Instant</div>
                      <div className="text-sm text-gray-600">Verification</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="text-3xl mb-3">🌿</div>
                      <div className="text-2xl font-bold text-emerald-600">Pure</div>
                      <div className="text-sm text-gray-600">Ayurvedic</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Complete Supply Chain Transparency
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                From seed to shelf, every step is recorded on blockchain for ultimate trust and authenticity
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: Leaf,
                  title: "Farm to Consumer",
                  description: "Complete journey tracking from organic farms to your doorstep with GPS coordinates and timestamps",
                  color: "green"
                },
                {
                  icon: Shield,
                  title: "Blockchain Security",
                  description: "Immutable records on distributed ledger ensuring data integrity and preventing counterfeiting",
                  color: "blue"
                },
                {
                  icon: Zap,
                  title: "Instant Verification",
                  description: "QR code scanning for immediate product authentication and detailed supply chain information",
                  color: "amber"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-${feature.color}-200`}
                >
                  <div className={`bg-${feature.color}-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                    <feature.icon className="text-white" size={32} />
                  </div>
                  <h3 className={`text-2xl font-bold text-${feature.color}-900 mb-4`}>{feature.title}</h3>
                  <p className={`text-${feature.color}-700 leading-relaxed`}>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-700">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center text-white">
              {[
                { number: "10,000+", label: "Herbs Traced" },
                { number: "500+", label: "Farmers Connected" },
                { number: "50+", label: "Manufacturers" },
                { number: "99.9%", label: "Accuracy Rate" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-green-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-orange-100">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-amber-100 px-4 py-2 rounded-full mb-6">
                <Globe className="text-amber-600 mr-2" size={20} />
                <span className="text-amber-800 font-medium">Join the Revolution</span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to Transform Ayurvedic Supply Chain?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Be part of the transparent, trustworthy, and sustainable herb ecosystem
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 font-semibold flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle className="mr-2" size={20} />
                    Start Your Journey
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}