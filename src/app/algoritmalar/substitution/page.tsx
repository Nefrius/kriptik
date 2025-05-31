"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function SubstitutionPage() {
  const [inputText, setInputText] = useState("MERHABA DÜNYA");
  const [outputText, setOutputText] = useState("");
  const [key, setKey] = useState("ZYXVUTŞSRPÖONMLKJİIHGĞFEDÇCBA");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [randomizeKey, setRandomizeKey] = useState(false);

  const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";

  // Yerine koyma şifresi için randomize tuş oluşturma
  const generateRandomKey = () => {
    const alphabetArray = alphabet.split('');
    
    // Fisher-Yates shuffle
    for (let i = alphabetArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [alphabetArray[i], alphabetArray[j]] = [alphabetArray[j], alphabetArray[i]];
    }
    
    return alphabetArray.join('');
  };

  // Key geçerli mi kontrol et
  const isValidKey = (key: string): boolean => {
    if (key.length !== alphabet.length) return false;
    
    // Her harf sadece bir kez kullanılmalı
    const charSet = new Set(key.split(''));
    if (charSet.size !== alphabet.length) return false;
    
    // Tüm harfler Türkçe alfabesinden olmalı
    for (const char of key) {
      if (!alphabet.includes(char)) return false;
    }
    
    return true;
  };

  // Randomize butonu kullanıldığında
  useEffect(() => {
    if (randomizeKey) {
      setKey(generateRandomKey());
      setRandomizeKey(false);
    }
  }, [randomizeKey]);

  // Substitution şifreleme fonksiyonu
  const substitutionCipher = (text: string, key: string, mode: "encrypt" | "decrypt") => {
    if (!isValidKey(key)) return "HATALI ANAHTAR! Tüm Türkçe harfleri içeren, her harfi tam bir kez kullanan bir anahtar gerekiyor.";
    
    return text
      .split("")
      .map((char) => {
        const upperChar = char.toUpperCase();
        const index = alphabet.indexOf(upperChar);
        
        if (index === -1) return char; // Alfabede olmayan karakterleri değiştirme
        
        let newChar;
        if (mode === "encrypt") {
          // Şifreleme: Alfabedeki harfi key'deki karşılığıyla değiştir
          newChar = key[index];
        } else {
          // Şifre çözme: Key'deki harfin alfabedeki karşılığını bul
          const keyIndex = key.indexOf(upperChar);
          newChar = alphabet[keyIndex];
        }
        
        // Harfin büyük/küçük harf durumunu koru
        return char === upperChar ? newChar : newChar.toLowerCase();
      })
      .join("");
  };

  // Şifreleme/şifre çözme işlemini gerçekleştir
  useEffect(() => {
    const result = substitutionCipher(inputText, key, mode);
    setOutputText(result);
  }, [inputText, key, mode]);

  // Karşılık tablosunu oluştur
  const getSubstitutionTable = () => {
    if (!isValidKey(key)) return [];
    
    return alphabet.split('').map((char, index) => ({
      original: char,
      substituted: key[index]
    }));
  };

  const substitutionTable = getSubstitutionTable();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/algoritmalar" />

        {/* Page Header */}
        <div className="bg-[#38B6FF] text-white py-16 px-4 md:px-8 relative">
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="flex items-center mb-4">
              <Link href="/algoritmalar" className="text-white/80 hover:text-white transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Algoritmalar
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                🔤 Yerine Koyma Şifresi
              </h1>
              <p className="text-lg md:text-xl max-w-3xl text-white/90">
                Yerine Koyma Şifresi (Substitution Cipher), alfabedeki her harfin farklı bir harf ile değiştirilmesine dayanan klasik 
                bir şifreleme yöntemidir. Monoalfabetik şifrelerin temelidir.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-12 px-4 md:px-8 flex-grow bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bilgi Bölümü */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Yerine Koyma Şifresi Nedir?</h2>
                  <p className="text-gray-600 mb-4">
                    Yerine Koyma Şifresi, alfabedeki her harfin farklı bir harf ile değiştirilmesine dayanan monoalfabetik 
                    bir şifreleme yöntemidir.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Her harf için sabit bir karşılık kullanılır, böylece belirli bir harf her zaman aynı harf ile şifrelenir.
                    Bu, basit bir şifreleme sağlar fakat frekans analizine karşı zayıftır.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-[#38B6FF] p-4 mt-6">
                    <h3 className="text-lg font-semibold text-[#38B6FF] mb-2">Anahtar Boyutu</h3>
                    <p className="text-gray-700">
                      Türkçe alfabede 29 harf için olası anahtar sayısı: 29! (29 faktöriyel) - yaklaşık 
                      8.8 x 10<sup>30</sup> farklı anahtar mümkündür.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Tarihçe ve Kullanım</h2>
                  <div className="border-l-4 border-gray-300 pl-4 py-2 mb-4">
                    <p className="italic text-gray-600">
                      &quot;Bilgelik, bilgiyi gizlemekle değil, yaymakla büyür.&quot;
                    </p>
                    <p className="text-gray-500 mt-2">- Antik dönem</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Yerine koyma şifresi, en eski şifreleme yöntemlerinden biridir ve çeşitli formları binlerce yıldır kullanılmaktadır.
                    Özellikle askeri, diplomatik ve ticari gizli yazışmalarda tercih edilmiştir.
                  </p>
                  <p className="text-gray-600">
                    19. yüzyılda frekans analizi yöntemlerinin gelişmesiyle kolayca kırılabilir hale gelmiştir. 
                    Günümüzde eğitim ve eğlence amaçlı bulmacalarda kullanılmaktadır.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Güvenlik</h2>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                    <h3 className="text-lg font-semibold text-yellow-700 mb-2">⚠️ Orta Düzey Güvenlik</h3>
                    <p className="text-yellow-600 text-sm">
                      Yerine koyma şifresi, frekans analizi kullanılarak kırılabilir. Bu nedenle
                      modern güvenlik uygulamaları için uygun değildir.
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Her dilde harflerin kullanım sıklığı farklıdır. Örneğin, Türkçe&apos;de &quot;A&quot;, &quot;E&quot; ve &quot;İ&quot; harfleri
                    en sık kullanılan harflerdir. Bu bilgi kullanılarak şifreli metinde en sık geçen harfler tespit edilebilir.
                  </p>
                </motion.div>
              </div>
              
              {/* İnteraktif Bölüm */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Yerine Koyma Şifreleme Aracı</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">İşlem</label>
                      <div className="flex">
                        <button 
                          className={`px-4 py-2 rounded-l-lg font-medium transition-colors ${mode === "encrypt" ? "bg-[#38B6FF] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                          onClick={() => setMode("encrypt")}
                        >
                          Şifrele
                        </button>
                        <button 
                          className={`px-4 py-2 rounded-r-lg font-medium transition-colors ${mode === "decrypt" ? "bg-[#38B6FF] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                          onClick={() => setMode("decrypt")}
                        >
                          Şifre Çöz
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <button
                        onClick={() => setRandomizeKey(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full"
                      >
                        Rastgele Anahtar Oluştur
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="key" className="block text-gray-700 text-sm font-medium mb-2">
                      Anahtar (Türkçe alfabenin tüm harflerini içermeli)
                    </label>
                    <input
                      type="text"
                      id="key"
                      value={key}
                      onChange={(e) => setKey(e.target.value.toUpperCase())}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        isValidKey(key) 
                          ? "border-gray-300 focus:ring-[#38B6FF]" 
                          : "border-red-300 focus:ring-red-500 bg-red-50"
                      }`}
                      placeholder="Şifreleme anahtarını girin..."
                    />
                    {!isValidKey(key) && (
                      <p className="text-red-500 text-sm mt-1">
                        Anahtar, Türkçe alfabedeki tüm 29 harfi (her birini tam bir kez) içermelidir.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="input" className="block text-gray-700 text-sm font-medium mb-2">
                        {mode === "encrypt" ? "Şifrelenecek Metin" : "Şifreli Metin"}
                      </label>
                      <textarea
                        id="input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent h-32 resize-none"
                        placeholder={mode === "encrypt" ? "Şifrelenecek metni girin..." : "Şifreli metni girin..."}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        {mode === "encrypt" ? "Şifreli Metin" : "Çözülen Metin"}
                      </label>
                      <div className="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-lg h-32 overflow-y-auto">
                        <p className="text-gray-800 font-mono whitespace-pre-wrap break-all">
                          {outputText || "Sonuç burada görünecek..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Karşılık Tablosu */}
                {isValidKey(key) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Harf Karşılık Tablosu</h3>
                    <p className="text-gray-600 mb-4">
                      Alfabedeki her harfin yerine kullanılan harfleri görebilirsiniz:
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {substitutionTable.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="text-lg font-bold text-gray-800">{item.original}</div>
                          <div className="text-xs text-gray-500 my-1">↓</div>
                          <div className="text-lg font-bold text-[#38B6FF]">{item.substituted}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Nasıl Çalışır */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Nasıl Çalışır?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Anahtar Hazırlama</h4>
                        <p className="text-gray-600">Her harfin yerine kullanılacak harfi belirleyen bir anahtar oluşturun.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Harf Değiştirme</h4>
                        <p className="text-gray-600">Metindeki her harfi, anahtardaki karşılığı ile değiştirin.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Şifre Çözme</h4>
                        <p className="text-gray-600">Şifreli metindeki her harfi, anahtardaki orijinal karşılığı ile değiştirin.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Örnek:</h4>
                    <p className="text-gray-600">
                      <span className="font-bold">Anahtar:</span> Normal alfabe: ABCÇD... → Şifreli alfabe: ZYXVW...
                    </p>
                    <p className="text-gray-600 mt-1">
                      <span className="font-bold">Metin:</span> &quot;MERHABA&quot; → Şifreli: &quot;ÖĞSIZYZ&quot; 
                      (M→Ö, E→Ğ, R→S, ...)
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
} 