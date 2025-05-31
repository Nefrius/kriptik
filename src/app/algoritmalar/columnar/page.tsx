"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function ColumnarPage() {
  const [inputText, setInputText] = useState("MERHABA DÜNYA");
  const [outputText, setOutputText] = useState("");
  const [key, setKey] = useState("ANAHTAR");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [table, setTable] = useState<string[][]>([]);
  const [keyOrder, setKeyOrder] = useState<number[]>([]);

  // Sütunsal Transpozisyon şifrelemesi için anahtar sıralaması
  const getKeyOrder = (key: string): number[] => {
    const cleanKey = key.toUpperCase();
    const keyChars = [...cleanKey];
    
    // Anahtar harflerini sıralayın ve indekslerini tutun
    const sortedKeyChars = [...keyChars].sort();
    
    // Her harfin sıralı indeksini bul (aynı harfler için sıralı olarak artırın)
    const order: number[] = [];
    const usedPositions = new Set<number>();
    
    for (let i = 0; i < keyChars.length; i++) {
      const char = keyChars[i];
      
      for (let j = 0; j < sortedKeyChars.length; j++) {
        if (sortedKeyChars[j] === char && !usedPositions.has(j)) {
          order.push(j);
          usedPositions.add(j);
          break;
        }
      }
    }
    
    return order;
  };

  // Sütunsal Transpozisyon şifreleme
  const columnarEncrypt = (text: string, key: string): string => {
    if (!key || key.length === 0) return text;
    
    const cleanText = text.replace(/\s/g, "").toUpperCase();
    const keyLength = key.length;
    
    // Boş tabloyu oluştur (satır × sütun)
    const numRows = Math.ceil(cleanText.length / keyLength);
    const matrix: string[][] = Array(numRows).fill(null).map(() => Array(keyLength).fill(""));
    
    // Metni tabloya yerleştir (soldan sağa, yukarıdan aşağı)
    let textIndex = 0;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < keyLength; col++) {
        if (textIndex < cleanText.length) {
          matrix[row][col] = cleanText[textIndex++];
        } else {
          matrix[row][col] = "X"; // Dolgu karakteri
        }
      }
    }
    
    // Anahtar sıralamasını al
    const order = getKeyOrder(key);
    setKeyOrder(order);
    setTable(matrix);
    
    // Sütunları anahtar sırasına göre oku
    let result = "";
    for (let i = 0; i < keyLength; i++) {
      const colIndex = order.indexOf(i);
      for (let row = 0; row < numRows; row++) {
        result += matrix[row][colIndex];
      }
    }
    
    return result;
  };

  // Sütunsal Transpozisyon şifre çözme
  const columnarDecrypt = (text: string, key: string): string => {
    if (!key || key.length === 0 || !text) return text;
    
    const cleanText = text.replace(/\s/g, "").toUpperCase();
    const keyLength = key.length;
    
    // Şifreli metin tabloya sığmıyorsa, yanlış metin veya anahtar
    if (cleanText.length % keyLength !== 0 && cleanText.length < keyLength) {
      return "Hata: Anahtar ve şifreli metin uyumlu değil!";
    }
    
    // Tablonun boyutlarını hesapla
    const numRows = Math.ceil(cleanText.length / keyLength);
    const numCols = keyLength;
    
    // Anahtar sıralamasını al
    const order = getKeyOrder(key);
    setKeyOrder(order);
    
    // Boş matris oluştur
    const matrix: string[][] = Array(numRows).fill(null).map(() => Array(numCols).fill(""));
    
    // Her sütundaki karakter sayısını hesapla
    const colLengths = Array(numCols).fill(numRows);
    
    // Şifreli metni sütunlara dağıt
    let textIndex = 0;
    for (let i = 0; i < numCols; i++) {
      const colIndex = order.indexOf(i);
      for (let row = 0; row < colLengths[colIndex]; row++) {
        if (textIndex < cleanText.length) {
          matrix[row][colIndex] = cleanText[textIndex++];
        }
      }
    }
    
    setTable(matrix);
    
    // Satırları soldan sağa oku
    let result = "";
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (matrix[row][col] !== "") {
          result += matrix[row][col];
        }
      }
    }
    
    return result;
  };

  // Şifreleme/şifre çözme işlemini gerçekleştir
  useEffect(() => {
    if (mode === "encrypt") {
      const result = columnarEncrypt(inputText, key);
      setOutputText(result);
    } else {
      const result = columnarDecrypt(inputText, key);
      setOutputText(result);
    }
  }, [inputText, key, mode]);

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
                📊 Sütunsal Transpozisyon
              </h1>
              <p className="text-lg md:text-xl max-w-3xl text-white/90">
                Metni tabloya yerleştirip sütunları belirli bir anahtar sırasına göre okuyarak şifreleyen 
                klasik transpozisyon yöntemi. 1. Dünya Savaşı&apos;nda yaygın olarak kullanılmıştır.
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Sütunsal Transpozisyon Nedir?</h2>
                  <p className="text-gray-600 mb-4">
                    Sütunsal Transpozisyon, metni bir tabloya satırlar halinde yazıp, sonra 
                    sütunları anahtar kelimeye göre belirlenen bir sırada okuyarak elde edilen şifreleme yöntemidir.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Bu bir transpozisyon (yer değiştirme) şifresidir, yani harfler değişmez, 
                    sadece yerleri değişir. Bu sayede, harf frekansları korunur.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-[#38B6FF] p-4 mt-6">
                    <h3 className="text-lg font-semibold text-[#38B6FF] mb-2">Özellikler</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Harfler değişmez, konumları değişir</li>
                      <li>• Anahtar tabanlı</li>
                      <li>• Frekans analizi yetersiz kalır</li>
                      <li>• Askeri haberleşmede kullanılmıştır</li>
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
                      &quot;Basit ama güçlü transpozisyon şifreleri, yüzyıllar boyunca askeri iletişimin bel kemiği olmuştur.&quot;
                    </p>
                    <p className="text-gray-500 mt-2">- Kriptografi Tarihi</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Sütunsal transpozisyon, 1. Dünya Savaşı sırasında Alman ordusu tarafından 
                    ADFGVX şifresi içinde kullanılmış ve 2. Dünya Savaşı&apos;nda da çeşitli ordular tarafından tercih edilmiştir.
                  </p>
                  <p className="text-gray-600">
                    Karmaşık formlarını kırmak için Müttefik kriptoanalistler özel teknikler 
                    geliştirmek zorunda kalmış ve alan çalışmasında önemli başarılar elde etmişlerdir.
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
                      Basit sütunsal transpozisyon, uzun metinlerde kırılabilir ancak 
                      çoklu transpozisyonlar (iki veya daha fazla kez uygulanan) oldukça güvenlidir.
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Harfler değişmediği için frekans analizi yapılabilir, ancak dil modellerine 
                    dayalı anagramsal çözümlemeler gerektirir. Kısa anahtarlar daha kolay kırılabilir.
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Sütunsal Transpozisyon Aracı</h2>
                  
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

                {/* Şifreleme Tablosu */}
                {table.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Şifreleme Tablosu</h3>
                    <p className="text-gray-600 mb-4">
                      {mode === "encrypt" 
                        ? "Metin tabloya yerleştirildikten sonra sütunlar anahtara göre sıralanır ve yukarıdan aşağı okunur:" 
                        : "Şifreli metin, anahtara göre sütunlara dağıtılır ve satırlar soldan sağa okunur:"}
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="border-collapse">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 px-3 py-2 bg-gray-50"></th>
                            {key.split('').map((char, index) => (
                              <th key={index} className="border border-gray-300 px-3 py-2 bg-gray-50">
                                {char} ({keyOrder[index] + 1})
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-semibold text-gray-700">
                                Satır {rowIndex + 1}
                              </td>
                              {row.map((cell, colIndex) => (
                                <td key={colIndex} className="border border-gray-300 px-3 py-2 text-center font-mono">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>Okuma sırası: </strong> 
                        {keyOrder.map(order => `${order + 1}. sütun`).join(' → ')}
                      </p>
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
                        <p className="text-gray-600">
                          Anahtar kelimenin harfleri alfabetik sıraya göre numaralandırılır.
                          Aynı harfler için soldan sağa sıralama kullanılır.
                        </p>
                        <p className="text-gray-600 mt-1">
                          Örnek: &quot;ANAHTAR&quot; → A:1, N:5, A:2, H:4, T:6, A:3, R:7
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Şifreleme</h4>
                        <p className="text-gray-600">
                          <strong>a)</strong> Metin, anahtarın uzunluğu kadar sütun içeren bir tabloya satır satır yazılır.
                          <br />
                          <strong>b)</strong> Eksik kalan hücreler genellikle &quot;X&quot; ile doldurulur.
                          <br />
                          <strong>c)</strong> Sütunlar, anahtar sırasına göre okunur ve şifreli metin oluşturulur.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Şifre Çözme</h4>
                        <p className="text-gray-600">
                          <strong>a)</strong> Anahtar sıralaması tekrar hesaplanır.
                          <br />
                          <strong>b)</strong> Şifreli metin, sütunlara anahtar sırasına göre dağıtılır.
                          <br />
                          <strong>c)</strong> Tablo soldan sağa, yukarıdan aşağı okunarak orijinal metin elde edilir.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Farklı Varyasyonlar:</h4>
                    <p className="text-gray-600">
                      <strong>İkili Transpozisyon:</strong> İşlem iki farklı anahtarla iki kez tekrarlanır.
                      <br />
                      <strong>Düzensiz Sütunlar:</strong> Sütunların farklı uzunluklarda olması, çözümü daha da zorlaştırır.
                      <br />
                      <strong>Myszkowski Transpozisyon:</strong> Anahtar içinde tekrarlayan harfler için özel bir okuma düzeni kullanılır.
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