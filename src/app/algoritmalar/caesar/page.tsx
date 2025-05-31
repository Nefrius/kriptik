"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function CaesarPage() {
  const [inputText, setInputText] = useState("MERHABA DÜNYA");
  const [outputText, setOutputText] = useState("");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [showTable, setShowTable] = useState(false);

  const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";

  // Caesar şifreleme/şifre çözme fonksiyonu
  const caesarCipher = (text: string, shift: number, mode: "encrypt" | "decrypt") => {
    const actualShift = mode === "encrypt" ? shift : (alphabet.length - shift) % alphabet.length;
    
    return text
      .split("")
      .map((char) => {
        const upperChar = char.toUpperCase();
        const charIndex = alphabet.indexOf(upperChar);
        
        if (charIndex === -1) return char;
        
        const newIndex = (charIndex + actualShift) % alphabet.length;
        const newChar = alphabet[newIndex];
        
        return char === upperChar ? newChar : newChar.toLowerCase();
      })
      .join("");
  };

  // Şifreleme işlemini gerçekleştir
  useEffect(() => {
    const result = caesarCipher(inputText, shift, mode);
    setOutputText(result);
  }, [inputText, shift, mode]);

  // Kaydırma tablosu oluştur
  const getShiftTable = () => {
    const result = [];
    
    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i].toUpperCase();
      if (alphabet.indexOf(char) !== -1) {
        const charIndex = alphabet.indexOf(char);
        const actualShift = mode === "encrypt" ? shift : (alphabet.length - shift) % alphabet.length;
        const newIndex = (charIndex + actualShift) % alphabet.length;
        const newChar = alphabet[newIndex];
        
        result.push({
          original: inputText[i],
          shifted: char === inputText[i] ? newChar : newChar.toLowerCase(),
          position: charIndex,
          newPosition: newIndex,
          shift: actualShift
        });
      } else {
        result.push({
          original: inputText[i],
          shifted: inputText[i],
          position: -1,
          newPosition: -1,
          shift: 0
        });
      }
    }
    
    return result;
  };

  const shiftTable = getShiftTable();

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
                🏛️ Caesar Şifresi
              </h1>
              <p className="text-lg md:text-xl max-w-3xl text-white/90">
                Roma İmparatoru Julius Caesar tarafından kullanılan bu basit şifreleme yöntemi, 
                alfabedeki her harfi belirli bir sayıda kaydırma prensibine dayanır. Tarihte bilinen 
                en eski ve en basit şifreleme yöntemlerinden biridir.
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Caesar Şifresi Nedir?</h2>
                  <p className="text-gray-600 mb-4">
                    Caesar şifresi, açık metindeki her harfin alfabede belirli bir sayıda 
                    ileriye kaydırılmasıyla oluşturulan basit bir şifreleme yöntemidir.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Örneğin, 3 birim kaydırma ile &quot;A&quot; harfi &quot;D&quot; olur, &quot;B&quot; harfi &quot;E&quot; olur 
                    ve böyle devam eder. Bu sistematik kaydırma tüm alfabe için uygulanır.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-[#38B6FF] p-4 mt-6">
                    <h3 className="text-lg font-semibold text-[#38B6FF] mb-2">Özellikler</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Monoalfabetik şifreleme</li>
                      <li>• Sabit kaydırma miktarı</li>
                      <li>• Basit ve hızlı uygulama</li>
                      <li>• Eğitim amaçlı idealdir</li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Tarihçe</h2>
                  <div className="border-l-4 border-gray-300 pl-4 py-2 mb-4">
                    <p className="italic text-gray-600">
                      &quot;Eğer gizli bir şey söylenmek istiyorsa, A yerine D, B yerine E... yazılır.&quot;
                    </p>
                    <p className="text-gray-500 mt-2">- Suetonius, Roma Tarihçisi</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    M.Ö. 1. yüzyılda Julius Caesar, önemli askeri ve siyasi mesajlarını korumak 
                    için bu şifreleme yöntemini kullanmıştır. Caesar genellikle 3 birim kaydırma kullanırdı.
                  </p>
                  <p className="text-gray-600">
                    Bu yöntem, alfabetik kaydırma prensibinin ilk sistematik kullanımı olarak 
                    kriptografi tarihinde önemli bir yere sahiptir.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Güvenlik</h2>
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <h3 className="text-lg font-semibold text-red-700 mb-2">⚠️ Çok Zayıf Güvenlik</h3>
                    <p className="text-red-600 text-sm">
                      Caesar şifresi sadece 28 farklı olasılık sunduğu için kaba kuvvet saldırısı 
                      ile saniyeler içinde kırılabilir. Modern kullanım için uygun değildir.
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Türkçe alfabesinde sadece 28 farklı kaydırma olasılığı vardır. 
                    Bu, bir bilgisayarın tüm olasılıkları çok hızlı deneyebileceği anlamına gelir.
                  </p>
                  <p className="text-gray-600">
                    Ayrıca frekans analizi ile de kolayca kırılabilir çünkü her harf 
                    tutarlı şekilde aynı harfe dönüştürülür.
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Caesar Şifreleme Aracı</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">İşlem Türü</label>
                      <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                        <button 
                          className={`flex-1 px-4 py-3 font-medium transition-colors ${
                            mode === "encrypt" 
                              ? "bg-[#38B6FF] text-white" 
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => setMode("encrypt")}
                        >
                          Şifrele
                        </button>
                        <button 
                          className={`flex-1 px-4 py-3 font-medium transition-colors ${
                            mode === "decrypt" 
                              ? "bg-[#38B6FF] text-white" 
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => setMode("decrypt")}
                        >
                          Şifre Çöz
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="shift" className="block text-gray-700 text-sm font-medium mb-2">
                        Kaydırma Miktarı: <span className="font-bold text-[#38B6FF]">{shift}</span>
                      </label>
                      <input
                        type="range"
                        id="shift"
                        min="1"
                        max={alphabet.length - 1}
                        value={shift}
                        onChange={(e) => setShift(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{accentColor: '#38B6FF'}}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span>{alphabet.length - 1}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="input" className="block text-gray-700 text-sm font-medium mb-2">
                        {mode === "encrypt" ? "Şifrelenecek Metin" : "Çözülecek Şifreli Metin"}
                      </label>
                      <textarea
                        id="input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent h-32 resize-none"
                        placeholder={mode === "encrypt" ? "Şifrelenecek metni girin..." : "Çözülecek şifreli metni girin..."}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        {mode === "encrypt" ? "Şifrelenmiş Metin" : "Çözülmüş Metin"}
                      </label>
                      <div className="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-lg h-32 overflow-y-auto">
                        <p className="text-gray-800 font-mono whitespace-pre-wrap break-all">
                          {outputText || "Sonuç burada görünecek..."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm">
                      <strong>Formül:</strong> {mode === "encrypt" ? "E(x) = (x + k) mod 29" : "D(x) = (x - k) mod 29"}, 
                      burada k = {shift} (kaydırma miktarı)
                    </p>
                  </div>
                </motion.div>

                {/* Kaydırma Tablosu Buton */}
                <div className="mb-8">
                  <button
                    onClick={() => setShowTable(!showTable)}
                    className="w-full px-4 py-3 bg-[#38B6FF]/10 hover:bg-[#38B6FF]/20 text-[#38B6FF] rounded-lg transition-colors flex justify-center items-center"
                  >
                    <span className="mr-2">{showTable ? 'Tabloyu Gizle' : 'Caesar Alfabe Tablosunu Göster'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform ${showTable ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>

                {/* Caesar Kaydırma Tablosu */}
                {showTable && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Caesar Alfabe Kaydırma Tablosu</h3>
                    <p className="text-gray-600 mb-4">
                      Caesar şifresi her harfi {shift} pozisyon kaydırır. Aşağıdaki tabloda 
                      her harfin hangi harfe dönüştüğünü görebilirsiniz.
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-2">Orijinal</th>
                            <th className="border border-gray-300 p-2">Pozisyon</th>
                            <th className="border border-gray-300 p-2">Kaydırma</th>
                            <th className="border border-gray-300 p-2">Yeni Pozisyon</th>
                            <th className="border border-gray-300 p-2">Şifreli</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alphabet.split('').map((char, index) => {
                            const actualShift = mode === "encrypt" ? shift : (alphabet.length - shift) % alphabet.length;
                            const newIndex = (index + actualShift) % alphabet.length;
                            const newChar = alphabet[newIndex];
                            return (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 p-2 text-center font-mono font-bold">{char}</td>
                                <td className="border border-gray-300 p-2 text-center">{index}</td>
                                <td className="border border-gray-300 p-2 text-center">+{actualShift}</td>
                                <td className="border border-gray-300 p-2 text-center">{newIndex}</td>
                                <td className="border border-gray-300 p-2 text-center font-mono font-bold text-[#38B6FF]">{newChar}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* Metin Kaydırma Görünümü */}
                {shiftTable.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Metin Kaydırma Görünümü</h3>
                    <p className="text-gray-600 mb-4">
                      Metninizin her harfinin nasıl kaydırıldığını görebilirsiniz:
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">Orijinal</th>
                            <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">Kaydırılmış</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {shiftTable.map((item, index) => (
                                  <span
                                    key={index}
                                    className={`inline-block px-2 py-1 text-sm font-mono rounded ${
                                      item.position !== -1 
                                        ? "bg-blue-100 text-blue-800" 
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {item.original}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {shiftTable.map((item, index) => (
                                  <span
                                    key={index}
                                    className={`inline-block px-2 py-1 text-sm font-mono rounded ${
                                      item.position !== -1 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                                  >
                                    {item.shifted}
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
                        <h4 className="font-semibold text-gray-800">Alfabede Pozisyon Belirleme</h4>
                        <p className="text-gray-600">Her harf alfabede bir pozisyona sahiptir. A=0, B=1, C=2... şeklinde numaralandırılır.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Kaydırma İşlemi</h4>
                        <p className="text-gray-600">
                          Şifreleme: (pozisyon + kaydırma) mod 29<br />
                          Şifre çözme: (pozisyon - kaydırma) mod 29
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Modulo İşlemi</h4>
                        <p className="text-gray-600">
                          Sonuç alfabenin sonunu geçerse başa döner. Örneğin 30 mod 29 = 1 olur.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Örnek Hesaplama:</h4>
                    <p className="text-gray-600">
                      &quot;A&quot; harfini 3 kaydırma ile şifreleyelim:<br />
                      A pozisyonu = 0, kaydırma = 3<br />
                      Sonuç: (0 + 3) mod 29 = 3 = &quot;D&quot;
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