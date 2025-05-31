"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/" />

        {/* Hero Section */}
        <section className="bg-primary-500 py-20 px-4 md:px-8 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[#38B6FF] z-0"></div>
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-40 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
          </div>
          
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                  >
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-white text-sm font-medium">Tamamen Ücretsiz</span>
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                    <span className="block">Şifrelemeyi</span>
                    <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Keşfet
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
                    Kriptik ile klasik şifreleme algoritmalarını interaktif olarak öğrenin. 
                    Tarihte kullanılan şifreleme yöntemlerini, nasıl çalıştıklarını ve 
                    neden kırılabildiklerini adım adım keşfedin.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/algoritmalar" className="relative inline-flex group">
                      <div className="absolute transition-all duration-300 inset-0 bg-white/20 blur-lg rounded-lg group-hover:blur-md"></div>
                      <div className="relative bg-white text-[#38B6FF] px-6 py-3 rounded-lg font-medium text-lg hover:bg-gray-50 transition-colors inline-block">
                        Hemen Başla
                      </div>
                    </Link>
                    
                    <Link href="/hakkinda" className="relative inline-flex group">
                      <div className="relative border-2 border-white/50 text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-white/10 transition-colors inline-block">
                        Proje Hakkında
                      </div>
                    </Link>
                  </div>
                </motion.div>
              </div>
              
              <div className="md:w-1/2 flex justify-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="w-72 h-72 bg-white/10 backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center shadow-xl relative"
                >
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/30 rounded-full"></div>
                  <div className="absolute top-2 left-2 w-4 h-4 bg-white/25 rounded-full"></div>
                  
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
                      className="text-xl mb-4 font-mono tracking-wider text-white"
                    >
                      XBHIBCBOQIBO...
                    </motion.div>
                    <motion.div 
                      animate={{ 
                        y: [0, -8, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                      }}
                      className="flex justify-center items-center mb-4"
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                        </svg>
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
                      className="text-xl font-mono tracking-wider text-white"
                    >
                      MERHABA DÜNYA...
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Platform İstatistikleri</h2>
              <div className="h-1 w-24 bg-[#38B6FF] mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "30+", label: "Şifreleme Algoritması", icon: "🔐", delay: 0 },
                { number: "8", label: "Farklı Kategori", icon: "📚", delay: 0.1 },
                { number: "10+", label: "Interaktif Demo", icon: "🎮", delay: 0.2 },
                { number: "100%", label: "Türkçe İçerik", icon: "🇹🇷", delay: 0.3 }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: stat.delay }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-[#38B6FF] mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 md:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Neler Öğreneceksiniz?</h2>
              <div className="h-1 w-24 bg-[#38B6FF] mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Klasik Şifreleme",
                  description: "Caesar, Vigenère, Substitution gibi klasik şifreleme algoritmalarının çalışma prensiplerini öğrenin.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#38B6FF]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.308 48.308 0 0 1-8.135-2.687c-1.717-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  )
                },
                {
                  title: "Şifre Kırma",
                  description: "Klasik şifrelerin zayıf noktalarını keşfedin ve bu şifrelerin nasıl kırılabileceğini öğrenin.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#38B6FF]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                    </svg>
                  )
                },
                {
                  title: "Tarihsel Bağlam",
                  description: "Şifreleme algoritmalarının tarih boyunca nasıl kullanıldığını ve gelişimini keşfedin.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#38B6FF]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className="border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-[0_8px_30px_0_rgba(56,182,255,0.15)] hover:border-[#38B6FF]/30 overflow-hidden"
                >
                  <div className="p-6">
                    <motion.div 
                      animate={{ 
                        scale: hoveredFeature === index ? 1.1 : 1,
                        rotate: hoveredFeature === index ? 5 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#E8F7FF] w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Path Section */}
        <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Öğrenme Yolunuz</h2>
              <div className="h-1 w-24 bg-[#38B6FF] mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Klasik Şifreler", description: "Caesar ve Atbaş ile başlayın", color: "bg-green-500" },
                { step: "2", title: "Polialfabetik", description: "Vigenère ve Beaufort öğrenin", color: "bg-blue-500" },
                { step: "3", title: "Transpozisyon", description: "Rail Fence ve Columnar deneyin", color: "bg-yellow-500" },
                { step: "4", title: "Modern Şifreler", description: "AES ve RSA ile tamamlayın", color: "bg-red-500" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className={`w-12 h-12 ${item.color} text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto`}>
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Algorithms Preview */}
        <section className="py-16 px-4 md:px-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Popüler Algoritmalar</h2>
              <div className="h-1 w-24 bg-[#38B6FF] mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Caesar Şifresi",
                  description: "Alfabedeki harflerin belirli bir sayıda kaydırılmasına dayanan en temel şifreleme yöntemi.",
                  link: "/algoritmalar/caesar",
                  icon: "🏛️",
                  difficulty: "Kolay"
                },
                {
                  title: "Vigenère Şifresi", 
                  description: "Bir anahtar kelime kullanarak harflerin farklı miktarlarda kaydırılmasına dayanan polialfabetik şifreleme.",
                  link: "/algoritmalar/vigenere",
                  icon: "🗝️",
                  difficulty: "Orta"
                },
                {
                  title: "Playfair Şifresi",
                  description: "Harfleri ikişerli gruplar halinde şifreleyen, matris üzerine kurulu bir şifreleme sistemi.",
                  link: "/algoritmalar/playfair",
                  icon: "📋",
                  difficulty: "Zor"
                }
              ].map((algorithm, index) => (
                <Link key={index} href={algorithm.link} className="group">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-200 h-full rounded-xl transition-all duration-300 group-hover:shadow-[0_8px_30px_0_rgba(56,182,255,0.15)] group-hover:border-[#38B6FF]/30 overflow-hidden bg-white"
                  >
                    <div className="h-2 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] rounded-t-xl"></div>
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">{algorithm.icon}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          algorithm.difficulty === "Kolay" 
                            ? "bg-green-100 text-green-800"
                            : algorithm.difficulty === "Orta"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {algorithm.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-[#38B6FF] transition-colors">
                        {algorithm.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-grow">
                        {algorithm.description}
                      </p>
                      <span className="inline-flex items-center text-sm font-medium text-[#38B6FF]">
                        Keşfet
                        <motion.svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                          className="w-5 h-5 ml-1"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            repeatType: "loop",
                            ease: "easeInOut",
                            repeatDelay: 2
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </motion.svg>
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/algoritmalar" 
                className="relative inline-flex group"
              >
                <div className="absolute inset-0 bg-[#38B6FF]/20 blur-lg rounded-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-[#38B6FF] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#0098F7] transition-colors inline-flex items-center">
                  Tüm Algoritmaları Gör
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
