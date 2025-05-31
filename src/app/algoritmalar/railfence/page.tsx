"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function RailFencePage() {
  const [inputText, setInputText] = useState("MERHABA DÜNYA");
  const [outputText, setOutputText] = useState("");
  const [rails, setRails] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [visualization, setVisualization] = useState<string[][]>([]);

  // Rail Fence şifreleme fonksiyonu
  const railFenceEncrypt = (text: string, numRails: number): string => {
    if (numRails <= 1) return text;
    
    const cleanText = text.replace(/\s/g, "").toUpperCase();
    const fence: string[][] = Array(numRails).fill(null).map(() => []);
    
    let rail = 0;
    let direction = 1;
    
    for (let i = 0; i < cleanText.length; i++) {
      fence[rail].push(cleanText[i]);
      
      if (rail === 0) {
        direction = 1;
      } else if (rail === numRails - 1) {
        direction = -1;
      }
      
      rail += direction;
    }
    
    setVisualization(fence);
    return fence.flat().join("");
  };

  // Rail Fence şifre çözme fonksiyonu
  const railFenceDecrypt = (text: string, numRails: number): string => {
    if (numRails <= 1) return text;
    
    const cleanText = text.replace(/\s/g, "").toUpperCase();
    const fence: string[][] = Array(numRails).fill(null).map(() => []);
    
    // Önce pattern&apos;i bul
    const railLengths = Array(numRails).fill(0);
    let rail = 0;
    let direction = 1;
    
    for (let i = 0; i < cleanText.length; i++) {
      railLengths[rail]++;
      
      if (rail === 0) {
        direction = 1;
      } else if (rail === numRails - 1) {
        direction = -1;
      }
      
      rail += direction;
    }
    
    // Harfleri raylara dağıt
    let index = 0;
    for (let i = 0; i < numRails; i++) {
      for (let j = 0; j < railLengths[i]; j++) {
        fence[i].push(cleanText[index++]);
      }
    }
    
    // Zigzag pattern&apos;inde oku
    const result = [];
    const railIndices = Array(numRails).fill(0);
    rail = 0;
    direction = 1;
    
    for (let i = 0; i < cleanText.length; i++) {
      result.push(fence[rail][railIndices[rail]++]);
      
      if (rail === 0) {
        direction = 1;
      } else if (rail === numRails - 1) {
        direction = -1;
      }
      
      rail += direction;
    }
    
    return result.join("");
  };

  // Şifreleme/şifre çözme işlemini gerçekleştir
  useEffect(() => {
    if (mode === "encrypt") {
      const result = railFenceEncrypt(inputText, rails);
      setOutputText(result);
    } else {
      const result = railFenceDecrypt(inputText, rails);
      setOutputText(result);
      // Decrypt için visualization&apos;ı temizle
      setVisualization([]);
    }
  }, [inputText, rails, mode]);

  // Görselleştirme için zigzag pattern oluştur
  const createZigzagVisualization = () => {
    if (mode === "decrypt" || !inputText) return [];
    
    const cleanText = inputText.replace(/\s/g, "").toUpperCase();
    const pattern: (string | null)[][] = Array(rails).fill(null).map(() => 
      Array(cleanText.length).fill(null)
    );
    
    let rail = 0;
    let direction = 1;
    
    for (let i = 0; i < cleanText.length; i++) {
      pattern[rail][i] = cleanText[i];
      
      if (rail === 0) {
        direction = 1;
      } else if (rail === rails - 1) {
        direction = -1;
      }
      
      rail += direction;
    }
    
    return pattern;
  };

  const zigzagPattern = createZigzagVisualization();

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
                🚂 Rail Fence Şifresi
              </h1>
              <p className="text-lg md:text-xl max-w-3xl text-white/90">
                Metni zigzag (zikzak) şeklinde yazarak şifreleyen basit transpozisyon yöntemi. 
                &quot;Çit Şifresi&quot; olarak da bilinir. Harfler değişmez, sadece sıraları değişir.
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Rail Fence Nedir?</h2>
                  <p className="text-gray-600 mb-4">
                    Rail Fence şifresi, metni belirli sayıda ray üzerinde zigzag şeklinde yazarak 
                    şifreleyen transpozisyon yöntemidir.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Harfler değişmez, sadece konumları değişir. Bu yüzden &quot;transpozisyon&quot; 
                    (yer değiştirme) şifresi olarak adlandırılır.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-[#38B6FF] p-4 mt-6">
                    <h3 className="text-lg font-semibold text-[#38B6FF] mb-2">Özellikler</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Basit ve hızlı</li>
                      <li>• Görsel pattern</li>
                      <li>• Frekans korunur</li>
                      <li>• Transpozisyon tipi</li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Nasıl Çalışır?</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Ray Sayısı Belirleme</h4>
                        <p className="text-gray-600 text-sm">Metni yazacağınız ray (satır) sayısını seçin</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Zigzag Yazma</h4>
                        <p className="text-gray-600 text-sm">Metni yukarı-aşağı zigzag şeklinde yazın</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Satır Satır Okuma</h4>
                        <p className="text-gray-600 text-sm">Her rayı soldan sağa okuyarak şifreli metni oluşturun</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Güvenlik</h2>
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
                    <h3 className="text-lg font-semibold text-orange-700 mb-2">⚠️ Zayıf Güvenlik</h3>
                    <p className="text-orange-600 text-sm">
                      Rail Fence çok basit bir şifredir ve kolayca kırılabilir. 
                      Sadece eğitim amaçlı kullanılmalıdır.
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Harflerin frekansı değişmediği için frekans analizi ile kırılabilir. 
                    Ayrıca az sayıda ray seçeneği vardır.
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Rail Fence Şifreleme Aracı</h2>
                  
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
                      <label htmlFor="rails" className="block text-gray-700 text-sm font-medium mb-2">
                        Ray Sayısı: {rails}
                      </label>
                      <input
                        type="range"
                        id="rails"
                        min="2"
                        max="10"
                        value={rails}
                        onChange={(e) => setRails(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>2</span>
                        <span>10</span>
                      </div>
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

                {/* Görselleştirme */}
                {mode === "encrypt" && zigzagPattern.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Zigzag Pattern Görselleştirme</h3>
                    <p className="text-gray-600 mb-4">
                      Metininiz nasıl zigzag şeklinde yazıldığını görebilirsiniz:
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      <div className="font-mono text-sm">
                        {zigzagPattern.map((row, rowIndex) => (
                          <div key={rowIndex} className="flex gap-1 mb-2">
                            <span className="w-8 text-gray-500 text-right mr-2">
                              {rowIndex + 1}:
                            </span>
                            {row.map((char, colIndex) => (
                              <span
                                key={colIndex}
                                className={`w-8 h-8 flex items-center justify-center rounded ${
                                  char ? "bg-[#38B6FF] text-white font-bold" : "bg-transparent"
                                }`}
                              >
                                {char || "·"}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Ray İçerikleri */}
                {mode === "encrypt" && visualization.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Ray İçerikleri</h3>
                    <p className="text-gray-600 mb-4">
                      Her ray&apos;daki harfler sırayla okunarak şifreli metin oluşturulur:
                    </p>
                    
                    <div className="space-y-3">
                      {visualization.map((rail, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-16 text-sm font-medium text-gray-700">
                            Ray {index + 1}:
                          </span>
                          <div className="flex gap-1">
                            {rail.map((char, charIndex) => (
                              <span
                                key={charIndex}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm"
                              >
                                {char}
                              </span>
                            ))}
                          </div>
                          <span className="ml-4 text-sm text-gray-500">
                            ({rail.length} harf)
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        <strong>Şifreli Metin:</strong> Tüm raylar soldan sağa birleştirilerek oluşturulur.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
} 