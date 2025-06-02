"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Github, Linkedin, ExternalLink, Code, Heart, Users, Zap } from "lucide-react";

export default function AboutPage() {
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/hakkinda" />

        {/* Hero Section with Personal Info */}
        <div className="bg-gradient-to-br from-[#38B6FF] via-[#0EA5E9] to-[#0284C7] text-white py-20 px-4 md:px-8 relative overflow-hidden">
          {/* Enhanced Background effects */}
          <div className="absolute inset-0 z-0">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
            ></motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"
            ></motion.div>
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/15 rounded-full blur-lg"
            ></motion.div>
            
            {/* Code symbols floating */}
            <motion.div
              animate={{ y: [-20, 20], rotate: [0, 180] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-16 left-16 text-white/20 text-2xl"
            >
              {'{}'}
            </motion.div>
            <motion.div
              animate={{ y: [20, -20], x: [-10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-32 right-32 text-white/20 text-xl"
            >
              {'</>'}
            </motion.div>
          </div>
          
          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
              >
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-400 rounded-full mr-3"
                ></motion.span>
                <span className="text-white text-sm font-medium">Full Stack Developer & Educator</span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-6xl font-bold mb-6"
              >
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="block"
                >
                  Merhaba! 👋
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
                >
                  Ben Enes Baş
                </motion.span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl max-w-4xl text-white/95 leading-relaxed mb-8"
              >
                <strong>Kriptik</strong> projesinin geliştiricisiyim. Modern web teknolojileri ile eğitim odaklı çözümler geliştiriyorum. 
                Kriptografi dünyasını herkese ulaştırmak için bu platformu oluşturdum.
              </motion.p>

              {/* Social Links */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-4"
              >
                {[
                  { 
                    name: "GitHub", 
                    icon: Github, 
                    url: "https://github.com/Nefrius/kriptik",
                    color: "hover:bg-gray-800",
                    description: "Kriptik Repository"
                  },
                  { 
                    name: "LinkedIn", 
                    icon: Linkedin, 
                    url: "https://www.linkedin.com/in/enes-ba%C5%9F-8430b81b1/",
                    color: "hover:bg-blue-600",
                    description: "Profesyonel Profil"
                  },
                  { 
                    name: "Portfolio", 
                    icon: ExternalLink, 
                    url: "https://enesbas.vercel.app/",
                    color: "hover:bg-purple-600",
                    description: "Kişisel Website"
                  }
                ].map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setHoveredSocial(social.name)}
                    onHoverEnd={() => setHoveredSocial(null)}
                    className={`group relative inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{social.name}</span>
                    
                    {/* Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: hoveredSocial === social.name ? 1 : 0,
                        y: hoveredSocial === social.name ? -10 : 10
                      }}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-lg"
                    >
                      {social.description}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
                    </motion.div>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Animated Stats */}
        <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { icon: Zap, title: "Modern", desc: "Web Teknolojileri", color: "text-yellow-500" },
                { icon: Heart, title: "Passion", desc: "Eğitim Odaklı", color: "text-red-500" },
                { icon: Code, title: "Open Source", desc: "Açık Kaynak", color: "text-green-500" },
                { icon: Users, title: "Community", desc: "Topluluk Dostu", color: "text-blue-500" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors mb-4`}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </motion.div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">{stat.title}</div>
                  <div className="text-gray-600 text-sm">{stat.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Main Content with Enhanced Animations */}
        <section className="py-16 px-4 md:px-8 bg-white flex-grow">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left Column - About Kriptik */}
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-3xl font-bold mb-6 text-gray-800 relative inline-block"
                  >
                    <span className="bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] bg-clip-text text-transparent">
                      Kriptik Projesi
                    </span>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-1 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] absolute bottom-0 left-0 rounded-full"
                    ></motion.div>
                  </motion.h2>
                  
                  <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <strong className="text-[#38B6FF]">Kriptik</strong>, klasik şifreleme algoritmalarını modern web teknolojileri 
                      ile buluşturan interaktif bir eğitim platformudur. Bu projeyi geliştirme amacım, kriptografi dünyasını 
                      daha erişilebilir hale getirmektir.
                    </motion.p>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      Öğrenciler ve meraklılar için tasarlanan bu platform, teorik bilgiyi pratik deneyimle birleştirerek 
                      daha etkili bir öğrenme deneyimi sunmayı hedeflemektedir.
                    </motion.p>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      Her algoritmanın adım adım gösterilmesi, interaktif demolar ve görsel açıklamalar ile 
                      karmaşık kavramları anlaşılır hale getirmeye çalıştım.
                    </motion.p>
                  </div>
                </motion.div>

                {/* Enhanced Features */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: 24 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="w-1.5 bg-gradient-to-b from-[#38B6FF] to-[#0EA5E9] rounded-full mr-3"
                    ></motion.div>
                    Platform Özellikleri
                  </h3>
                  
                  <div className="grid gap-4">
                    {[
                      { icon: "🎮", text: "İnteraktif şifreleme demoları", delay: 0.1 },
                      { icon: "📊", text: "Adım adım görselleştirme", delay: 0.2 },
                      { icon: "🔍", text: "Şifre kırma teknikleri", delay: 0.3 },
                      { icon: "🏆", text: "Puzzle çözme yarışmaları", delay: 0.4 },
                      { icon: "🇹🇷", text: "Tamamen Türkçe içerik", delay: 0.5 },
                      { icon: "🚀", text: "Modern web teknolojileri", delay: 0.6 }
                    ].map((feature, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: feature.delay }}
                        whileHover={{ x: 10, backgroundColor: "#F9FAFB" }}
                        className="flex items-center p-4 rounded-lg transition-all duration-300 cursor-pointer group"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className="text-2xl mr-4"
                        >
                          {feature.icon}
                        </motion.div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Technical Details */}
              <div className="space-y-8">
                
                {/* Development Philosophy */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: 24 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="w-1.5 bg-gradient-to-b from-[#38B6FF] to-[#0EA5E9] rounded-full mr-3"
                    ></motion.div>
                    Geliştirme Felsefem
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      { 
                        principle: "Kullanıcı Odaklı", 
                        desc: "Her özellik kullanıcı deneyimini iyileştirmek için tasarlandı",
                        icon: "👥",
                        color: "blue"
                      },
                      { 
                        principle: "Açık Kaynak", 
                        desc: "Şeffaflık ve topluluk katkısı için açık kaynak geliştirme",
                        icon: "🌍",
                        color: "green"
                      },
                      { 
                        principle: "Sürekli İyileştirme", 
                        desc: "Geri bildirimler doğrultusunda sürekli geliştirme",
                        icon: "🔄",
                        color: "purple"
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="text-2xl mr-4 mt-1"
                        >
                          {item.icon}
                        </motion.div>
                        <div className="flex-grow">
                          <div className="font-semibold text-gray-800 mb-1">{item.principle}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Enhanced Tech Stack */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: 24 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="w-1.5 bg-gradient-to-b from-[#38B6FF] to-[#0EA5E9] rounded-full mr-3"
                    ></motion.div>
                    Teknoloji Yığını
                  </h3>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-gray-600 mb-6"
                  >
                    Modern ve performanslı web teknolojileri:
                  </motion.p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Next.js", desc: "React framework", icon: "⚛️", color: "from-blue-400 to-blue-600" },
                      { name: "TypeScript", desc: "Tip güvenliği", icon: "📘", color: "from-blue-500 to-blue-700" },
                      { name: "Tailwind CSS", desc: "Stil framework", icon: "🎨", color: "from-cyan-400 to-cyan-600" },
                      { name: "Supabase", desc: "Backend as Service", icon: "🗃️", color: "from-green-400 to-green-600" },
                      { name: "Framer Motion", desc: "Animasyon kütüphanesi", icon: "🎭", color: "from-purple-400 to-purple-600" },
                      { name: "Vercel", desc: "Deployment platform", icon: "▲", color: "from-gray-700 to-gray-900" }
                    ].map((tech, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        onHoverStart={() => setHoveredTech(index)}
                        onHoverEnd={() => setHoveredTech(null)}
                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                          hoveredTech === index 
                            ? "border-[#38B6FF] bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg" 
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        {/* Background gradient on hover */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredTech === index ? 0.1 : 0 }}
                          className={`absolute inset-0 bg-gradient-to-br ${tech.color}`}
                        />
                        
                        <div className="relative z-10">
                          <div className="flex items-center mb-3">
                            <motion.span 
                              animate={{ 
                                scale: hoveredTech === index ? 1.2 : 1,
                                rotate: hoveredTech === index ? 360 : 0
                              }}
                              transition={{ duration: 0.3 }}
                              className="text-2xl mr-3"
                            >
                              {tech.icon}
                            </motion.span>
                          <div className="font-semibold text-gray-800">{tech.name}</div>
                        </div>
                        <div className="text-sm text-gray-600">{tech.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Enhanced Educational Approach */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-16 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 rounded-2xl p-10 border border-blue-100 relative overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 text-6xl">🔐</div>
                <div className="absolute top-4 right-4 text-6xl">🔑</div>
                <div className="absolute bottom-4 left-4 text-6xl">🛡️</div>
                <div className="absolute bottom-4 right-4 text-6xl">⚡</div>
              </div>
              
              <div className="relative z-10">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-10"
                >
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Eğitim Yaklaşımım</h3>
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: 96 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-1 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] mx-auto rounded-full"
                  ></motion.div>
                </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "🎯",
                      title: "Pratik Odaklı",
                      description: "Teorik bilgiyi pratik uygulamalarla destekleyerek öğrenme deneyimini zenginleştiriyorum.",
                      color: "from-red-400 to-pink-500"
                  },
                  {
                    icon: "🤝",
                      title: "Etkileşimli",
                      description: "Kullanıcıların algoritmaları deneyimleyerek öğrenmelerini sağlayan interaktif araçlar.",
                      color: "from-blue-400 to-indigo-500"
                  },
                  {
                    icon: "📈",
                      title: "Kademeli",
                      description: "Basit konseptlerden karmaşık sistemlere doğru yapılandırılmış öğrenme yolu.",
                      color: "from-green-400 to-emerald-500"
                  }
                ].map((approach, index) => (
                  <motion.div
                    key={index}
                      initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-6 hover:bg-white/90 transition-all duration-300"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1, type: "spring" }}
                        whileHover={{ rotate: 360 }}
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${approach.color} mb-4 text-2xl`}
                      >
                        {approach.icon}
                      </motion.div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-3">{approach.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{approach.description}</p>
                  </motion.div>
                ))}
                </div>
              </div>
            </motion.div>

            {/* Enhanced Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-16 bg-gradient-to-r from-[#38B6FF] via-[#0EA5E9] to-[#38B6FF] p-10 rounded-2xl text-white text-center relative overflow-hidden"
            >
              {/* Background effects */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-4 right-4 w-20 h-20 border-2 border-white/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white/20 rounded-full"
              />
              
              <div className="relative z-10">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl font-bold mb-4"
                >
                  İletişim & İş Birliği
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-8 opacity-95 text-lg max-w-2xl mx-auto"
                >
                  Proje hakkında sorularınız, önerileriniz veya iş birliği teklifleriniz için benimle iletişime geçebilirsiniz:
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  {[
                    { 
                      icon: Github, 
                      text: "GitHub Repository", 
                      url: "https://github.com/Nefrius/kriptik",
                      color: "hover:bg-gray-800"
                    },
                    { 
                      icon: Linkedin, 
                      text: "LinkedIn Profili", 
                      url: "https://www.linkedin.com/in/enes-ba%C5%9F-8430b81b1/",
                      color: "hover:bg-blue-600"
                    },
                    { 
                      icon: ExternalLink, 
                      text: "Portfolio Website", 
                      url: "https://enesbas.vercel.app/",
                      color: "hover:bg-purple-600"
                    }
                  ].map((contact, index) => (
                    <motion.a
                      key={index}
                      href={contact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 ${contact.color} group`}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <contact.icon className="w-5 h-5 mr-3" />
                      </motion.div>
                      <span className="font-medium">{contact.text}</span>
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
} 