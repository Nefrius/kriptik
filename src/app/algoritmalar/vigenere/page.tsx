"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function VigenerePage() {
  const [inputText, setInputText] = useState("MERHABA DÜNYA");
  const [outputText, setOutputText] = useState("");
  const [key, setKey] = useState("ANAHTAR");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";

  // Vigenère şifreleme/şifre çözme fonksiyonu
  const vigenereeCipher = (text: string, key: string, mode: "encrypt" | "decrypt") => {
    if (!key || key.length === 0) return text;
    
    const cleanKey = key.toUpperCase().replace(/[^ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]/g, "");
    if (cleanKey.length === 0) return text;
    
    let keyIndex = 0;
    
    return text
      .split("")
      .map((char) => {
        const upperChar = char.toUpperCase();
        const charIndex = alphabet.indexOf(upperChar);
        
        if (charIndex === -1) return char;
        
        const keyChar = cleanKey[keyIndex % cleanKey.length];
        const keyCharIndex = alphabet.indexOf(keyChar);
        keyIndex++;
        
        let newIndex;
        if (mode === "encrypt") {
          newIndex = (charIndex + keyCharIndex) % alphabet.length;
        } else {
          newIndex = (charIndex - keyCharIndex + alphabet.length) % alphabet.length;
        }
        
        const newChar = alphabet[newIndex];
        return char === upperChar ? newChar : newChar.toLowerCase();
      })
      .join("");
  };

  // Şifreleme/şifre çözme işlemini gerçekleştir
  useEffect(() => {
    const result = vigenereeCipher(inputText, key, mode);
    setOutputText(result);
  }, [inputText, key, mode]);

  // Anahtar tekrar tablosu oluştur
  const getKeyTable = () => {
    if (!key || inputText.length === 0) return [];
    
    const cleanKey = key.toUpperCase().replace(/[^ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]/g, "");
    const result = [];
    let keyIndex = 0;
    
    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i].toUpperCase();
      if (alphabet.indexOf(char) !== -1) {
        result.push({
          char: inputText[i],
          key: cleanKey[keyIndex % cleanKey.length],
          keyIndex: keyIndex % cleanKey.length
        });
        keyIndex++;
      } else {
        result.push({
          char: inputText[i],
          key: "-",
          keyIndex: -1
        });
      }
    }
    
    return result;
  };

  const keyTable = getKeyTable();

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
                🗝️ Vigenère Şifresi
              </h1>
              <p className="text-lg md:text-xl max-w-3xl text-white/90">
                16. yüzyılda Blaise de Vigenère tarafından popülerleştirilen bu polialfabetik şifreleme 
                yöntemi, uzun süre &quot;kırılamaz şifre&quot; olarak bilinmiştir. Her harf için farklı 
                Caesar şifresi kullanır.
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Vigenère Şifresi Nedir?</h2>
                  <p className="text-gray-600 mb-4">
                    Vigenère şifresi, anahtar kelime kullanarak her harfi farklı miktarlarda kaydıran 
                    polialfabetik bir şifreleme yöntemidir.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Anahtar kelime metnin uzunluğu boyunca tekrarlanır ve her harf için farklı bir 
                    Caesar şifresi uygulanır. Bu, frekans analizini zorlaştırır.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-[#38B6FF] p-4 mt-6">
                    <h3 className="text-lg font-semibold text-[#38B6FF] mb-2">Avantajları</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Frekans analizine dayanıklı</li>
                      <li>• Caesar&apos;dan çok daha güvenli</li>
                      <li>• Uzun anahtarlarla güçlü</li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Tarihçe</h2>
                  <div className="border-l-4 border-gray-300 pl-4 py-2 mb-4">
                    <p className="italic text-gray-600">
                      &quot;Le Chiffre Indéchiffrable&quot; - Kırılamaz Şifre
                    </p>
                    <p className="text-gray-500 mt-2">- 19. Yüzyıl Fransız Kriptografları</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    İlk olarak 1553&apos;te Giovan Battista Bellaso tarafından tarif edilse de, 
                    Blaise de Vigenère&apos;nin 1586&apos;daki çalışması ile popüler hale gelmiştir.
                  </p>
                  <p className="text-gray-600">
                    300 yıl boyunca güvenli kabul edilmiş, 1863&apos;te Friedrich Kasiski&apos;nin 
                    geliştirdiği analiz yöntemi ile kırılabilir hale gelmiştir.
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Vigenère Şifreleme Aracı</h2>
                  
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
                      <label htmlFor="key" className="block text-gray-700 text-sm font-medium mb-2">
                        Anahtar Kelime
                      </label>
                      <input
                        type="text"
                        id="key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                        placeholder="Anahtar kelimeyi girin..."
                      />
                    </div>
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

                {/* Anahtar Tekrar Tablosu */}
                {keyTable.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Anahtar Tekrar Tablosu</h3>
                    <p className="text-gray-600 mb-4">
                      Anahtar kelime metin boyunca nasıl tekrarlandığını görebilirsiniz:
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">Metin</th>
                            <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">Anahtar</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {keyTable.map((item, index) => (
                                  <span
                                    key={index}
                                    className={`inline-block px-2 py-1 text-sm font-mono rounded ${
                                      item.keyIndex !== -1 
                                        ? "bg-blue-100 text-blue-800" 
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {item.char}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {keyTable.map((item, index) => (
                                  <span
                                    key={index}
                                    className={`inline-block px-2 py-1 text-sm font-mono rounded ${
                                      item.keyIndex !== -1 
                                        ? `bg-green-100 text-green-800` 
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                                  >
                                    {item.key}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
                        <h4 className="font-semibold text-gray-800">Anahtar Tekrarı</h4>
                        <p className="text-gray-600">Anahtar kelime, metin uzunluğu boyunca tekrarlanır.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Kaydırma Hesaplama</h4>
                        <p className="text-gray-600">Her harf için anahtar harfinin alfabetik konumu kadar kaydırma yapılır.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Polialfabetik Güvenlik</h4>
                        <p className="text-gray-600">Aynı harf farklı pozisyonlarda farklı harflere dönüşerek frekans analizini zorlaştırır.</p>
                      </div>
                    </div>
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