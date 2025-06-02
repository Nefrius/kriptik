"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { 
  Shield, 
  Key, 
  BookOpen, 
  Zap, 
  Target, 
  Globe, 
  Crown, 
  Wrench, 
  History, 
  ArrowRight, 
  Lock, 
  Code2, 
  Brain, 
  Sparkles,
  Play,
  ChevronDown,
  MousePointer2,
  Rocket,
  Trophy,
  Star,
  Users,
  TrendingUp,
  CheckCircle,
  Bot,
  User,
  Send
} from "lucide-react";

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredAlgorithm, setHoveredAlgorithm] = useState<number | null>(null);
  
  // Hydration safe floating particles data
  const [particleData, setParticleData] = useState<Array<{
    x: number[];
    y: number[];
    duration: number;
    delay: number;
    left: string;
    top: string;
  }>>([]);

  // Initialize particle data after component mounts to avoid hydration mismatch
  useEffect(() => {
    const particles = Array.from({ length: 5 }, () => ({
      x: [0, Math.random() * 100 - 50],
      y: [0, Math.random() * 100 - 50],
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
      left: `${20 + Math.random() * 60}%`,
      top: `${20 + Math.random() * 60}%`
    }));
    setParticleData(particles);
  }, []);

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
        <Header currentPath="/" />

        {/* Enhanced Hero Section */}
        <section className="bg-gradient-to-br from-[#38B6FF] via-[#0EA5E9] to-[#0284C7] py-20 px-4 md:px-8 relative overflow-hidden">
          {/* Dynamic Background Effects */}
          <div className="absolute inset-0 z-0">
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
            />
            <motion.div 
              animate={{ 
                rotate: -360,
                scale: [1.2, 1, 1.2]
              }}
              transition={{ 
                duration: 25, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute top-40 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"
            />
            <motion.div 
              animate={{ 
                y: [-20, 20, -20],
                x: [-10, 10, -10]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute bottom-20 left-1/3 w-24 h-24 bg-white/15 rounded-full blur-lg"
            />
            
            {/* Floating Icons */}
            <motion.div
              animate={{ 
                y: [-15, 15, -15],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-20 right-1/4 text-white/20"
            >
              <Lock className="w-8 h-8" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [20, -20, 20],
                rotate: [360, 180, 0]
              }}
              transition={{ 
                duration: 7, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute bottom-32 right-1/4 text-white/20"
            >
              <Key className="w-6 h-6" />
            </motion.div>
          </div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div 
                className="md:w-1/2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-green-400 mr-3" />
                  </motion.div>
                  <span className="text-white text-sm font-medium">Tamamen Ücretsiz & Açık Kaynak</span>
                </motion.div>
                
                <motion.h1 
                  variants={itemVariants}
                  className="text-5xl md:text-6xl font-bold mb-6 text-white"
                >
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="block"
                  >
                    Kriptografiyi
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
                  >
                    Keşfet
                  </motion.span>
                </motion.h1>

                <motion.p 
                  variants={itemVariants}
                  className="text-xl md:text-2xl mb-8 text-white/95 leading-relaxed"
                >
                  Klasik şifreleme algoritmalarını <strong>interaktif</strong> olarak öğrenin. 
                  Tarihte kullanılan şifreleme yöntemlerini adım adım keşfedin ve 
                  <strong> modern kriptografinin temellerini</strong> anlayın.
                </motion.p>
                
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link href="/algoritmalar" className="group relative">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative bg-white text-[#38B6FF] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 inline-flex items-center group-hover:shadow-xl"
                    >
                      <Play className="w-5 h-5 mr-2" />
                        Hemen Başla
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </motion.div>
                    </motion.div>
                    </Link>
                    
                  <Link href="/hakkinda" className="group">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 inline-flex items-center backdrop-blur-sm"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                        Proje Hakkında
                    </motion.div>
                    </Link>
                </motion.div>
              </motion.div>
              
                <motion.div 
                className="md:w-1/2 flex justify-center"
                initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ 
                  duration: 1, 
                  delay: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
              >
                <div className="relative">
                  <motion.div 
                    className="w-80 h-80 bg-white/10 backdrop-blur-sm p-8 rounded-3xl flex items-center justify-center shadow-2xl relative border border-white/20"
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: 5
                    }}
                    transition={{ duration: 0.3 }}
                >
                  {/* Decorative elements */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                    >
                      <Shield className="w-4 h-4 text-white" />
                    </motion.div>
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center"
                    >
                      <Key className="w-3 h-3 text-white" />
                    </motion.div>
                  
                  <div className="text-center">
                    <motion.div 
                      animate={{ 
                        opacity: [1, 0.7, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                      }}
                        className="text-xl mb-6 font-mono tracking-wider text-white/90 bg-white/10 p-3 rounded-lg"
                    >
                        XBHIBCBOQIBO
                    </motion.div>
                      
                    <motion.div 
                      animate={{ 
                          y: [0, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                      }}
                        className="flex justify-center items-center mb-6"
                      >
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                          <ChevronDown className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                      
                    <motion.div 
                      animate={{ 
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        delay: 1
                      }}
                        className="text-xl font-mono tracking-wider text-white/90 bg-white/10 p-3 rounded-lg"
                    >
                        MERHABA DÜNYA
                    </motion.div>
                  </div>
                </motion.div>
                  
                  {/* Floating particles - now using state values */}
                  {particleData.map((particle, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white/40 rounded-full"
                      animate={{
                        x: particle.x,
                        y: particle.y,
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay
                      }}
                      style={{
                        left: particle.left,
                        top: particle.top
                      }}
                    />
                  ))}
              </div>
              </motion.div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
          >
            <MousePointer2 className="w-6 h-6" />
          </motion.div>
        </section>

        {/* Enhanced Statistics Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Platform Özellikleri</h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className="h-1 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] mx-auto rounded-full"
              />
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "12+", label: "Şifreleme Algoritması", icon: Shield, delay: 0, color: "from-blue-500 to-blue-600" },
                { number: "5", label: "Farklı Kategori", icon: Target, delay: 0.1, color: "from-green-500 to-green-600" },
                { number: "∞", label: "Interaktif Demo", icon: Zap, delay: 0.2, color: "from-purple-500 to-purple-600" },
                { number: "100%", label: "Türkçe İçerik", icon: Globe, delay: 0.3, color: "from-red-500 to-red-600" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: stat.delay }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                  className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color}`}
                  />
                  
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-4`}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.div 
                      initial={{ scale: 1 }}
                      whileInView={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, delay: stat.delay + 0.2 }}
                      viewport={{ once: true }}
                      className="text-4xl font-bold text-gray-800 mb-2"
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16 text-center"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Neler Öğreneceksiniz?</h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className="h-1 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] mx-auto rounded-full"
              />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Klasik Şifreleme",
                  description: "Caesar, Vigenère, Substitution gibi klasik şifreleme algoritmalarının çalışma prensiplerini interaktif olarak öğrenin.",
                  icon: Crown,
                  color: "from-yellow-400 to-orange-500"
                },
                {
                  title: "Şifre Kırma Teknikleri",
                  description: "Klasik şifrelerin zayıf noktalarını keşfedin ve bu şifrelerin nasıl kırılabileceğini pratik örneklerle öğrenin.",
                  icon: Wrench,
                  color: "from-red-400 to-pink-500"
                },
                {
                  title: "Tarihsel Perspektif",
                  description: "Şifreleme algoritmalarının tarih boyunca nasıl kullanıldığını ve gelişimini kronolojik olarak keşfedin.",
                  icon: History,
                  color: "from-blue-400 to-indigo-500"
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className="group relative border border-gray-200 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:border-[#38B6FF]/30 overflow-hidden bg-white"
                >
                  {/* Background effect */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: hoveredFeature === index ? 0.1 : 0,
                      scale: hoveredFeature === index ? 1 : 0
                    }}
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color}`}
                  />
                  
                  <div className="relative z-10 p-8">
                    <motion.div 
                      animate={{ 
                        scale: hoveredFeature === index ? 1.1 : 1,
                        rotate: hoveredFeature === index ? 360 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-[#38B6FF] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Shine effect */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: hoveredFeature === index ? "100%" : "-100%" }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Kriptik AI Chatbot Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 opacity-10">
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-xl"
            />
            <motion.div 
              animate={{ 
                rotate: -360,
                scale: [1.2, 1, 1.2]
              }}
              transition={{ 
                duration: 25, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500 rounded-full blur-2xl"
            />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-gradient-to-br from-purple-500 to-blue-500 p-4 rounded-2xl mr-4"
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold text-gray-800">Kriptik AI</h2>
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-4"
                >
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-6"
              />
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Kişisel kriptografi asistanınız ile şifreleme dünyasını keşfedin. 
                Sorularınızı sorun, algoritmaları öğrenin ve kriptografi bilginizi derinleştirin.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Sol taraf - Özellikler */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  {[
                    {
                      icon: Brain,
                      title: "Akıllı Kriptografi Asistanı",
                      description: "Tüm şifreleme algoritmaları hakkında detaylı bilgi alın",
                      color: "from-purple-500 to-purple-600"
                    },
                    {
                      icon: Shield,
                      title: "Güvenlik Uzmanı",
                      description: "Modern güvenlik kavramlarını ve best practice'leri öğrenin",
                      color: "from-blue-500 to-blue-600"
                    },
                    {
                      icon: History,
                      title: "Tarihsel Perspektif",
                      description: "Kriptografinin tarihçesini ve gelişimini keşfedin",
                      color: "from-indigo-500 to-indigo-600"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="flex items-start space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Sağ taraf - Chat preview ve CTA */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Chat window mockup */}
                <motion.div 
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4 flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    </div>
                    <div className="flex items-center space-x-2 text-white">
                      <Bot className="w-5 h-5" />
                      <span className="font-semibold">Kriptik AI</span>
                    </div>
                  </div>
                  
                  {/* Chat content */}
                  <div className="p-6 space-y-4 bg-gray-50 min-h-[300px]">
                    {/* AI message */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 max-w-sm">
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 2, delay: 1 }}
                        >
                          Merhaba! Ben Kriptik AI. Caesar şifresi hakkında ne öğrenmek istersiniz?
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* User message */}
                    <div className="flex items-start space-x-3 justify-end">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-2xl shadow-sm max-w-sm">
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 2, delay: 1.5 }}
                        >
                          Caesar şifresi nasıl çalışır?
                        </motion.div>
                      </div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                    
                    {/* AI response */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 max-w-sm">
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 2, delay: 2 }}
                        >
                          Caesar şifresi alfabedeki her harfi belirli bir sayıda kaydırır. Örneğin 3 kaydırma ile A→D, B→E olur...
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Input area */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="flex-grow bg-gray-100 rounded-xl px-4 py-3">
                        <span className="text-gray-500">Kriptografi hakkında bir soru sorun...</span>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Send className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="mt-8 text-center"
                >
                  <Link href="/ai-chat" className="group relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      Kriptik AI ile Sohbet Et
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </motion.div>
                    </motion.div>
                  </Link>
                  
                  <p className="text-sm text-gray-500 mt-3">
                    Giriş yaparak kişisel AI asistanınızla sohbet edebilirsiniz
                  </p>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  animate={{ 
                    y: [-10, 10, -10],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center"
                >
                  <Key className="w-4 h-4 text-purple-500" />
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [15, -15, 15],
                    rotate: [360, 180, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center"
                >
                  <Lock className="w-3 h-3 text-blue-500" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced Learning Path Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <Lock className="absolute top-10 left-10 w-16 h-16 text-[#38B6FF]" />
            <Key className="absolute top-20 right-20 w-12 h-12 text-[#38B6FF]" />
            <Shield className="absolute bottom-20 left-20 w-14 h-14 text-[#38B6FF]" />
            <Code2 className="absolute bottom-10 right-10 w-18 h-18 text-[#38B6FF]" />
          </div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Öğrenme Yolculuğunuz</h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className="h-1 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] mx-auto rounded-full"
              />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { 
                  step: "1", 
                  title: "Temel Şifreler", 
                  description: "Caesar ve Atbaş ile şifreleme dünyasına adım atın", 
                  icon: CheckCircle,
                  color: "from-green-400 to-green-600",
                  bgColor: "bg-green-500"
                },
                { 
                  step: "2", 
                  title: "Polialfabetik", 
                  description: "Vigenère ve Beaufort ile karmaşık şifreleri öğrenin", 
                  icon: TrendingUp,
                  color: "from-blue-400 to-blue-600",
                  bgColor: "bg-blue-500"
                },
                { 
                  step: "3", 
                  title: "Transpozisyon", 
                  description: "Rail Fence ve Columnar ile harfleri yeniden düzenleyin", 
                  icon: Star,
                  color: "from-yellow-400 to-yellow-600",
                  bgColor: "bg-yellow-500"
                },
                { 
                  step: "4", 
                  title: "Modern Şifreler", 
                  description: "AES ve RSA ile günümüz kriptografisini keşfedin", 
                  icon: Trophy,
                  color: "from-purple-400 to-purple-600",
                  bgColor: "bg-purple-500"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="relative group"
                >
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50 text-center hover:bg-white/90 transition-all duration-300 h-full">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 ${item.bgColor} text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto relative overflow-hidden`}
                    >
                      <span className="relative z-10">{item.step}</span>
                      <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        className="absolute inset-0 bg-white/20"
                      />
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} mb-4`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#38B6FF] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                  
                  {/* Connection line */}
                  {index < 3 && (
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] origin-left"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Algorithms Preview */}
        <section className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16 text-center"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Popüler Algoritmalar</h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className="h-1 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] mx-auto rounded-full"
              />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Caesar Şifresi",
                  description: "Alfabedeki harflerin belirli bir sayıda kaydırılmasına dayanan en temel şifreleme yöntemi.",
                  link: "/algoritmalar/caesar",
                  icon: Crown,
                  difficulty: "Kolay",
                  color: "from-green-400 to-green-600"
                },
                {
                  title: "Vigenère Şifresi", 
                  description: "Bir anahtar kelime kullanarak harflerin farklı miktarlarda kaydırılmasına dayanan polialfabetik şifreleme.",
                  link: "/algoritmalar/vigenere",
                  icon: Key,
                  difficulty: "Orta",
                  color: "from-blue-400 to-blue-600"
                },
                {
                  title: "Playfair Şifresi",
                  description: "Harfleri ikişerli gruplar halinde şifreleyen, matris üzerine kurulu bir şifreleme sistemi.",
                  link: "/algoritmalar/playfair",
                  icon: Brain,
                  difficulty: "Zor",
                  color: "from-purple-400 to-purple-600"
                }
              ].map((algorithm, index) => (
                <Link key={index} href={algorithm.link} className="group">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    onHoverStart={() => setHoveredAlgorithm(index)}
                    onHoverEnd={() => setHoveredAlgorithm(null)}
                    className="relative border border-gray-200 h-full rounded-2xl transition-all duration-300 group-hover:shadow-2xl group-hover:border-[#38B6FF]/30 overflow-hidden bg-white"
                  >
                    {/* Gradient top border */}
                    <div className={`h-2 bg-gradient-to-r ${algorithm.color} rounded-t-2xl`}></div>
                    
                    {/* Background effect */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: hoveredAlgorithm === index ? 0.1 : 0,
                        scale: hoveredAlgorithm === index ? 1 : 0
                      }}
                      className={`absolute inset-0 bg-gradient-to-br ${algorithm.color}`}
                    />
                    
                    <div className="relative z-10 p-8 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${algorithm.color}`}
                        >
                          <algorithm.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          algorithm.difficulty === "Kolay" 
                            ? "bg-green-100 text-green-800"
                            : algorithm.difficulty === "Orta"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {algorithm.difficulty}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-[#38B6FF] transition-colors">
                        {algorithm.title}
                      </h3>
                      <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                        {algorithm.description}
                      </p>
                      
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="inline-flex items-center text-sm font-semibold text-[#38B6FF] mt-auto"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Keşfetmeye Başla
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.div>
                    </div>
                    
                    {/* Shine effect */}
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: hoveredAlgorithm === index ? "100%" : "-100%" }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </motion.div>
                </Link>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link href="/algoritmalar" className="group relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Tüm Algoritmaları Keşfet
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
