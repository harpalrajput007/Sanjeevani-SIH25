import { motion } from 'framer-motion';
import { Leaf, Users, Target, Award, Github, Linkedin, Mail, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const teamMembers = [
  {
    name: "Atharva Gaikwad",
    avatar: "AG",
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Harpal Rajput",
    avatar: "HR",
    color: "from-green-500 to-green-600"
  },
  {
    name: "Divya Kanojiya",
    avatar: "DK",
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "Niranjan Naik",
    avatar: "NN",
    color: "from-amber-500 to-amber-600"
  },
  {
    name: "Tanishka Uttarkar",
    avatar: "TU",
    color: "from-pink-500 to-pink-600"
  },
  {
    name: "Tanmay Borhade",
    avatar: "TB",
    color: "from-teal-500 to-teal-600"
  }
];

const values = [
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Promoting eco-friendly practices in herb cultivation and supply chain"
  },
  {
    icon: Users,
    title: "Transparency",
    description: "Building trust through complete visibility in every transaction"
  },
  {
    icon: Target,
    title: "Innovation",
    description: "Leveraging cutting-edge blockchain technology for authenticity"
  },
  {
    icon: Award,
    title: "Quality",
    description: "Ensuring highest standards in Ayurvedic herb traceability"
  }
];

export default function About() {
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
              y: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
                <Heart className="text-green-300 mr-2" size={20} />
                <span className="text-white font-medium">About HerbsTrace</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
                  Revolutionizing
                </span>
                <br />
                <span className="text-white">Ayurvedic Supply Chain</span>
              </h1>
              
              <p className="text-xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                We're a passionate team of developers and innovators committed to bringing transparency, 
                authenticity, and trust to the Ayurvedic herb industry through blockchain technology.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 bg-white/10 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-green-100 max-w-4xl mx-auto">
                To create a transparent, secure, and sustainable ecosystem for Ayurvedic herbs, 
                connecting farmers, manufacturers, and consumers through innovative blockchain technology.
              </p>
            </motion.div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                    <value.icon className="text-green-300" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-green-100">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Meet Our Team</h2>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                Talented individuals working together to transform the Ayurvedic industry
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
                    {/* Avatar */}
                    <div className="flex justify-center mb-6">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {member.avatar}
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                      <p className="text-green-300 font-medium mb-3">{member.role}</p>
                      <p className="text-green-100 text-sm mb-6">{member.description}</p>
                      
                      {/* Social Links */}
                      <div className="flex justify-center space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          <Github className="text-white" size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          <Linkedin className="text-white" size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          <Mail className="text-white" size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-white/10 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: "6", label: "Team Members" },
                { number: "1", label: "Mission" },
                { number: "100%", label: "Dedication" },
                { number: "∞", label: "Innovation" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                >
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-green-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}