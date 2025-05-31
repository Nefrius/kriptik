"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function AboutPage() {
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/hakkinda" />

        {/* Page Header */}
        <div className="bg-gradient-to-br from-[#38B6FF] to-[#0EA5E9] text-white py-20 px-4 md:px-8 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
          </div>
          
          <div className="container mx-auto max-w-5xl relative z-10">
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
                <span className="text-white text-sm font-medium">Eğitim Projesi</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Kriptik</span>
                <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Hakkında
                </span>
              </h1>
              <p className="text-lg md:text-xl max-w-3xl text-white/90 leading-relaxed">
                Kriptik, temel kriptografi algoritmalarını interaktif bir şekilde öğreten eğitim amaçlı bir platformdur.
                Öğrenciler ve meraklılar için tasarlanmış modern bir öğrenme deneyimi.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Project Stats */}
        <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: "🎯", title: "Amaç", desc: "Eğitim Odaklı" },
                { icon: "⚡", title: "Teknoloji", desc: "Modern Web" },
                { icon: "🌍", title: "Dil", desc: "Türkçe" },
                { icon: "🎓", title: "Seviye", desc: "Herkes İçin" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">{stat.title}</div>
                  <div className="text-gray-600 text-sm">{stat.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4 md:px-8 bg-white flex-grow">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left Column - Vision & Mission */}
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
                >
                  <h2 className="text-3xl font-bold mb-6 text-gray-800 relative inline-block">
                    <span className="bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] bg-clip-text text-transparent">
                      Proje Vizyonu
                    </span>
                    <div className="h-1 w-full bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] absolute bottom-0 left-0 rounded-full"></div>
                  </h2>
                  
                  <div className="prose prose-lg max-w-none text-gray-700">
                    <p className="mb-4">
                      <strong className="text-[#38B6FF]">Kriptik</strong>, klasik şifreleme algoritmaları hakkında bilgi edinmek isteyen öğrenciler, meraklılar ve 
                      kriptografiye ilgi duyan herkes için tasarlanmış interaktif bir eğitim platformudur.
                    </p>
                    
                    <p className="mb-4">
                      Projemizin amacı, kullanıcıların şifreleme tekniklerini yalnızca teorik olarak değil, aynı zamanda uygulamalı olarak da 
                      öğrenmelerini sağlamaktır.
                    </p>
                    
                    <p className="mb-6">
                      Bu platform, her bir algoritmanın çalışma prensiplerini, tarihsel bağlamını, güçlü ve zayıf yönlerini 
                      detaylı bir şekilde inceleme fırsatı sunar.
                    </p>
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <div className="h-6 w-1.5 bg-gradient-to-b from-[#38B6FF] to-[#0EA5E9] rounded-full mr-3"></div>
                    Öne Çıkan Özellikler
                  </h3>
                  
                  <div className="grid gap-4">
                    {[
                      { icon: "🎮", text: "İnteraktif şifreleme demoları" },
                      { icon: "📊", text: "Adım adım görselleştirme" },
                      { icon: "🔍", text: "Şifre kırma teknikleri" },
                      { icon: "📚", text: "Tarihsel bağlam bilgileri" },
                      { icon: "🇹🇷", text: "Tamamen Türkçe içerik" },
                      { icon: "🆓", text: "Ücretsiz ve açık kaynak" }
                    ].map((feature, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-2xl mr-4">{feature.icon}</div>
                        <span className="text-gray-700">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Timeline & Tech */}
              <div className="space-y-8">
                
                {/* Development Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <div className="h-6 w-1.5 bg-gradient-to-b from-[#38B6FF] to-[#0EA5E9] rounded-full mr-3"></div>
                    Geliştirme Süreci
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      { phase: "Araştırma", desc: "Kriptografi algoritmaları analizi", status: "completed", color: "green" },
                      { phase: "Tasarım", desc: "UI/UX ve platform mimarisi", status: "completed", color: "green" },
                      { phase: "Geliştirme", desc: "İnteraktif demo sistemleri", status: "current", color: "blue" },
                      { phase: "Test", desc: "Performans ve kullanılabilirlik", status: "pending", color: "yellow" },
                      { phase: "Yayın", desc: "Platform lansmanı", status: "pending", color: "gray" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        className="flex items-center"
                      >
                        <div className={`w-4 h-4 rounded-full mr-4 ${
                          item.status === "completed" ? "bg-green-500" :
                          item.status === "current" ? "bg-blue-500 animate-pulse" :
                          "bg-gray-300"
                        }`}></div>
                        <div className="flex-grow">
                          <div className="font-semibold text-gray-800">{item.phase}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <div className="h-6 w-1.5 bg-gradient-to-b from-[#38B6FF] to-[#0EA5E9] rounded-full mr-3"></div>
                    Teknik Altyapı
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Kriptik, modern web teknolojileri kullanılarak geliştirilmiştir:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Next.js", desc: "React framework", icon: "⚛️", color: "blue" },
                      { name: "TypeScript", desc: "Tip güvenliği", icon: "📘", color: "blue" },
                      { name: "Tailwind CSS", desc: "Stil ve tasarım", icon: "🎨", color: "cyan" },
                      { name: "Vercel", desc: "Hosting ve deployment", icon: "▲", color: "black" }
                    ].map((tech, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        onHoverStart={() => setHoveredTech(index)}
                        onHoverEnd={() => setHoveredTech(null)}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                          hoveredTech === index 
                            ? "border-[#38B6FF] bg-[#F0F8FF] shadow-md" 
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-3">{tech.icon}</span>
                          <div className="font-semibold text-gray-800">{tech.name}</div>
                        </div>
                        <div className="text-sm text-gray-600">{tech.desc}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Educational Approach */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 border border-blue-100"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Eğitim Yaklaşımımız</h3>
                <div className="h-1 w-24 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "🎯",
                    title: "Hedef Odaklı",
                    description: "Her algoritma için net öğrenme hedefleri ve sonuçları belirlendi."
                  },
                  {
                    icon: "🤝",
                    title: "İnteraktif",
                    description: "Öğrenciler algoritmaları deneyimleyerek ve uygulayarak öğrenirler."
                  },
                  {
                    icon: "📈",
                    title: "Aşamalı",
                    description: "Basit algoritmalardan karmaşık sistemlere doğru aşamalı öğrenme."
                  }
                ].map((approach, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-4xl mb-4">{approach.icon}</div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{approach.title}</h4>
                    <p className="text-gray-600">{approach.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="mt-12 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] p-8 rounded-xl text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-4">İletişim & Geri Bildirim</h3>
              <p className="mb-6 opacity-90">
                Bu proje hakkında daha fazla bilgi almak, önerilerde bulunmak veya katkıda bulunmak için:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:info@kriptik.edu.tr" 
                  className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  E-posta Gönder
                </a>
                <a 
                  href="https://github.com/kriptik-edu" 
                  className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
} 