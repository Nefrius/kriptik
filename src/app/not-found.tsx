"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function NotFound() {
  const [encryptedText, setEncryptedText] = useState("404");
  const [decryptedText, setDecryptedText] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  // Caesar şifresi animasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    switch (currentStep) {
      case 0:
        setEncryptedText("404");
        setDecryptedText("");
        break;
      case 1:
        setEncryptedText("717");
        setDecryptedText("");
        break;
      case 2:
        setEncryptedText("717");
        setDecryptedText("Şifreleniyor...");
        break;
      case 3:
        setEncryptedText("717");
        setDecryptedText("SAYFA YOK");
        break;
    }
  }, [currentStep]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/404" />

        {/* Main Content */}
        <section className="flex-grow flex items-center justify-center py-16 px-4 md:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto max-w-4xl text-center">
            
            {/* Animated Error Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              className="mb-12"
            >
              <div className="relative inline-block">
                {/* Background decoration */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#38B6FF]/20 to-[#0EA5E9]/20 rounded-2xl blur-xl"></div>
                
                <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                  <div className="mb-6">
                    <div className="text-6xl md:text-8xl font-mono font-bold text-gray-300 mb-2">
                      {encryptedText}
                    </div>
                    <motion.div 
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut"
                      }}
                      className="inline-flex items-center justify-center w-12 h-12 bg-[#38B6FF]/10 rounded-full mb-4"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#38B6FF]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </motion.div>
                    {decryptedText && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-3xl font-bold text-[#38B6FF]"
                      >
                        {decryptedText}
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="text-gray-500 text-sm font-mono">
                    Caesar Şifresi (Kaydırma: +13)
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Sayfa Bulunamadı
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Aradığınız sayfa şifrelenmiş olabilir veya kriptografinin derinliklerinde kaybolmuş olabilir. 
                Endişelenmeyin, size yardımcı olmak için buradayız!
              </p>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {[
                {
                  title: "Anasayfa",
                  description: "Kriptik platformunun ana sayfasına dönün",
                  link: "/",
                  icon: "🏠",
                  color: "blue"
                },
                {
                  title: "Algoritmalar",
                  description: "Şifreleme algoritmalarını keşfedin",
                  link: "/algoritmalar",
                  icon: "🔐",
                  color: "green"
                },
                {
                  title: "Hakkında",
                  description: "Proje hakkında daha fazla bilgi alın",
                  link: "/hakkinda",
                  icon: "ℹ️",
                  color: "purple"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <Link href={item.link} className="block">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Fun Crypto Facts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-gradient-to-r from-[#38B6FF]/10 to-[#0EA5E9]/10 p-8 rounded-xl border border-[#38B6FF]/20 mb-12"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                💡 Bilir misiniz?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                <div className="flex items-start">
                  <span className="text-[#38B6FF] mr-2">•</span>
                  <span>404 hatası, HTTP protokolünde &quot;Not Found&quot; anlamına gelir ve ilk kez 1992 yılında kullanılmıştır.</span>
                </div>
                <div className="flex items-start">
                  <span className="text-[#38B6FF] mr-2">•</span>
                  <span>Caesar şifresi, alfabedeki harfleri sabit bir sayı kadar kaydırarak çalışan en basit şifreleme yöntemlerinden biridir.</span>
                </div>
                <div className="flex items-start">
                  <span className="text-[#38B6FF] mr-2">•</span>
                  <span>Modern web sayfalarında ortalama olarak kullanıcıların %4&apos;ü 404 sayfası ile karşılaşır.</span>
                </div>
                <div className="flex items-start">
                  <span className="text-[#38B6FF] mr-2">•</span>
                  <span>Kriptografi kelimesi, Yunanca &quot;gizli yazı&quot; anlamına gelen &quot;kryptos&quot; ve &quot;graphos&quot; kelimelerinden türetilmiştir.</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/" 
                className="relative inline-flex group"
              >
                <div className="absolute inset-0 bg-[#38B6FF]/20 blur-lg rounded-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-[#38B6FF] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#0098F7] transition-colors inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  Anasayfaya Dön
                </div>
              </Link>
              
              <Link 
                href="/algoritmalar"
                className="relative inline-flex group"
              >
                <div className="relative border-2 border-[#38B6FF] text-[#38B6FF] px-8 py-4 rounded-lg font-medium hover:bg-[#38B6FF] hover:text-white transition-colors inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  Algoritmaları Keşfet
                </div>
              </Link>
            </motion.div>

            {/* Easter Egg */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
              className="mt-12 text-xs text-gray-400 font-mono"
            >
              Gizli mesaj: 01010100 01100101 01100010 01110010 01101001 01101011 01101100 01100101 01110010 00100001
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
} 