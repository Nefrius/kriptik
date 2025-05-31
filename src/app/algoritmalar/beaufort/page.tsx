"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function BeaufortPage() {
  const [inputText, setInputText] = useState("MERHABA DÜNYA");
  const [outputText, setOutputText] = useState("");
  const [key, setKey] = useState("ANAHTAR");
  const [showTable, setShowTable] = useState(false);

  const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";

  // Beaufort şifreleme/şifre çözme fonksiyonu (şifreleme ve çözme aynı işlem)
  const beaufortCipher = (text: string, key: string) => {
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
        
        // Beaufort formülü: (keyCharIndex - charIndex + alphabet.length) % alphabet.length
        // NOT: Vigenère'nin tersine, anahtar harfinden metin harfini çıkarıyoruz
        const newIndex = (keyCharIndex - charIndex + alphabet.length) % alphabet.length;
        
        const newChar = alphabet[newIndex];
        return char === upperChar ? newChar : newChar.toLowerCase();
      })
      .join("");
  };

  // Şifreleme işlemini gerçekleştir
  useEffect(() => {
    const result = beaufortCipher(inputText, key);
    setOutputText(result);
  }, [inputText, key]);

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
                ⚓ Beaufort Şifresi
              </h1>
              <p className="text-lg md:text-xl max-w-3xl text-white/90">
                Vigenère şifresinin modifikasyonu olan Beaufort şifresi, şifreleme ve şifre çözme 
                işlemleri aynı algoritma ile yapılan özel bir polialfabetik şifreleme yöntemidir.
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Beaufort Şifresi Nedir?</h2>
                  <p className="text-gray-600 mb-4">
                    Beaufort şifresi, İngiliz Donanması Amirali Sir Francis Beaufort tarafından 
                    geliştirilmiş, Vigenère şifresinin bir varyasyonudur.
                  </p>
                  <p className="text-gray-600 mb-4">
                    En önemli özelliği, şifreleme ve şifre çözme işlemlerinin aynı algoritma ile 
                    yapılmasıdır - kendi kendine çevirmelidir (involutory).
                  </p>
                  <div className="bg-blue-50 border-l-4 border-[#38B6FF] p-4 mt-6">
                    <h3 className="text-lg font-semibold text-[#38B6FF] mb-2">Özellikler</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Vigenère&apos;nin tersi formülü kullanır</li>
                      <li>• Şifreleme = Şifre çözme</li>
                      <li>• Polialfabetik şifreleme</li>
                      <li>• Donanma haberleşmesinde kullanılmıştır</li>
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
                      &quot;Şifreleme ve şifre çözmenin aynı işlemle yapılabilmesi, saha kullanımında büyük kolaylık sağlar.&quot;
                    </p>
                    <p className="text-gray-500 mt-2">- Kriptografi Tarihi</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Beaufort şifresi, Sir Francis Beaufort tarafından 1857 yılında geliştirilmiş ve 
                    İngiliz Kraliyet Donanması tarafından kullanılmıştır.
                  </p>
                  <p className="text-gray-600">
                    Özellikle askeri haberleşmede şifreleme ve şifre çözme işlemlerinin aynı algoritmayla 
                    yapılması, saha kullanımında karışıklığı önlediği için tercih edilmiştir.
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
                      Vigenère şifresi gibi Beaufort şifresi de Kasiski analizi ve indeks eşleştirme teknikleri 
                      ile kırılabilir. Modern kriptografik standartlara göre güvenli değildir.
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Anahtar kelime yeteri kadar uzun olmazsa veya düzenli bir metin şifrelenirse, 
                    tekrarlayan patternler oluşarak şifrenin kırılmasını kolaylaştırabilir.
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Beaufort Şifreleme Aracı</h2>
                  
                  <div className="mb-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="input" className="block text-gray-700 text-sm font-medium mb-2">
                        Metin
                      </label>
                      <textarea
                        id="input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent h-32 resize-none"
                        placeholder="Şifrelenecek/çözülecek metni girin..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Şifrelenmiş/Çözülmüş Metin
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
                      <strong>Not:</strong> Beaufort şifresinde şifreleme ve şifre çözme işlemi aynıdır. 
                      Metni iki kez şifrelerseniz, orijinal metne geri dönersiniz.
                    </p>
                  </div>
                </motion.div>

                {/* Anahtar Tablosu Buton */}
                <div className="mb-8">
                  <button
                    onClick={() => setShowTable(!showTable)}
                    className="w-full px-4 py-3 bg-[#38B6FF]/10 hover:bg-[#38B6FF]/20 text-[#38B6FF] rounded-lg transition-colors flex justify-center items-center"
                  >
                    <span className="mr-2">{showTable ? 'Tabloyu Gizle' : 'Beaufort Tablosunu Göster'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform ${showTable ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>

                {/* Beaufort Tablosu */}
                {showTable && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Beaufort Şifreleme Tablosu</h3>
                    <p className="text-gray-600 mb-4">
                      Beaufort şifresi, aşağıdaki tabloyu kullanarak çalışır. İlk satır açık metindeki harfi, 
                      ilk sütun anahtar harfini temsil eder. Kesişimdeki harf şifreli/çözülmüş harftir.
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-1 sticky left-0 bg-gray-50 z-10">A/K</th>
                            {alphabet.split('').map((char, i) => (
                              <th key={i} className="border border-gray-300 p-1">{char}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {alphabet.split('').map((keyChar, keyIndex) => (
                            <tr key={keyIndex}>
                              <th className="border border-gray-300 p-1 sticky left-0 bg-gray-50">{keyChar}</th>
                              {alphabet.split('').map((plainChar, plainIndex) => {
                                const encryptedIndex = (keyIndex - plainIndex + alphabet.length) % alphabet.length;
                                const encryptedChar = alphabet[encryptedIndex];
                                return (
                                  <td 
                                    key={plainIndex} 
                                    className={`border border-gray-300 p-1 text-center ${
                                      keyChar === key[0] && plainChar === inputText[0]
                                        ? 'bg-blue-100 font-bold'
                                        : ''
                                    }`}
                                  >
                                    {encryptedChar}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="text-gray-500 text-xs mt-3">
                      * Tablonun boyutu sebebiyle yatay ve dikey kaydırma gerekebilir.
                    </p>
                  </motion.div>
                )}

                {/* Anahtar Tekrar Tablosu */}
                {keyTable.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Anahtar Tekrar Görünümü</h3>
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
                        <h4 className="font-semibold text-gray-800">Formül</h4>
                        <p className="text-gray-600">
                          Beaufort şifresi, Vigenère şifresinin tersini kullanır:
                          <br />
                          <span className="font-mono">E(k,p) = (k - p) mod 29</span>, burada k anahtar harfi, p açık metin harfidir.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">İnvolütif Özellik</h4>
                        <p className="text-gray-600">
                          Beaufort şifresinin en önemli özelliği, kendisinin tersi olmasıdır:
                          <br />
                          <span className="font-mono">D(k,c) = E(k,c) = (k - c) mod 29</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Şifreleme Örneği</h4>
                        <p className="text-gray-600">
                          Metin: <span className="font-mono">A</span>, Anahtar: <span className="font-mono">B</span>
                          <br />
                          A = 0, B = 1
                          <br />
                          E(B,A) = (1 - 0) mod 29 = 1 = <span className="font-mono">B</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Vigenère ile Farkı:</h4>
                    <p className="text-gray-600">
                      <span className="font-mono">Vigenère: E(k,p) = (p + k) mod 29, D(k,c) = (c - k) mod 29</span>
                      <br />
                      <span className="font-mono">Beaufort: E(k,p) = D(k,p) = (k - p) mod 29</span>
                    </p>
                    <p className="text-gray-600 mt-2">
                      Beaufort şifresinde şifreleme ve şifre çözme işlemleri aynıdır, bu yüzden saha uygulamalarında karışıklığı önler.
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