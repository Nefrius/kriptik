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
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [analysisType, setAnalysisType] = useState<"frequency" | "strength" | "pattern">("frequency");
  
  // Çözüm geçmişi için state
  const [solutionHistory, setSolutionHistory] = useState<Array<{
    id: string;
    input: string;
    output: string;
    key: string;
    timestamp: Date;
  }>>([]);

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
    
    // Geçmişe ekle
    if (inputText && key && result) {
      const newEntry = {
        id: Date.now().toString(),
        input: inputText,
        output: result,
        key: key,
        timestamp: new Date()
      };
      setSolutionHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Son 10 işlemi sakla
    }
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

  // Dosya yükleme fonksiyonu
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content.length <= 10000) { // 10KB limit
          setInputText(content);
        } else {
          alert("Dosya çok büyük! Maksimum 10KB metin yükleyebilirsiniz.");
        }
      };
      reader.readAsText(file, 'UTF-8');
    } else {
      alert("Lütfen geçerli bir .txt dosyası seçin.");
    }
  };

  // Frekans analizi fonksiyonu
  const getFrequencyAnalysis = (text: string) => {
    const frequency: { [key: string]: number } = {};
    const cleanText = text.toUpperCase().replace(/[^ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]/g, "");
    
    for (const char of cleanText) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    
    const total = cleanText.length;
    const sorted = Object.entries(frequency)
      .map(([char, count]) => ({
        char,
        count,
        percentage: (count / total) * 100
      }))
      .sort((a, b) => b.count - a.count);
    
    return { sorted, total };
  };

  // Şifre gücü analizi
  const getCipherStrength = (text: string, key: string) => {
    const cleanText = text.replace(/[^ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]/gi, "");
    const cleanKey = key.replace(/[^ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]/gi, "");
    
    let score = 0;
    const maxScore = 100;
    
    // Anahtar uzunluğu
    if (cleanKey.length >= 8) score += 25;
    else if (cleanKey.length >= 5) score += 15;
    else if (cleanKey.length >= 3) score += 10;
    
    // Anahtar karmaşıklığı (tekrar eden karakterler)
    const uniqueChars = new Set(cleanKey.toUpperCase()).size;
    const complexity = uniqueChars / cleanKey.length;
    score += complexity * 25;
    
    // Metin uzunluğu
    if (cleanText.length >= 100) score += 25;
    else if (cleanText.length >= 50) score += 15;
    else if (cleanText.length >= 20) score += 10;
    
    // Frekans dağılımı uniformluğu
    const { sorted } = getFrequencyAnalysis(outputText);
    if (sorted.length > 0) {
      const variance = sorted.reduce((acc, item) => {
        const expected = 100 / alphabet.length;
        return acc + Math.pow(item.percentage - expected, 2);
      }, 0) / sorted.length;
      const uniformity = Math.max(0, 25 - (variance / 10));
      score += uniformity;
    }
    
    return {
      score: Math.min(score, maxScore),
      level: score >= 80 ? "Çok Güçlü" : score >= 60 ? "Güçlü" : score >= 40 ? "Orta" : score >= 20 ? "Zayıf" : "Çok Zayıf",
      color: score >= 80 ? "text-green-600" : score >= 60 ? "text-blue-600" : score >= 40 ? "text-yellow-600" : score >= 20 ? "text-orange-600" : "text-red-600"
    };
  };

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

                  {/* Dosya Yükleme */}
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Dosyadan Metin Yükle
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 cursor-pointer flex items-center transition-colors"
                      >
                        📁 .txt Dosyası Seç
                      </label>
                      <span className="text-sm text-gray-500">Maksimum 10KB</span>
                    </div>
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
                  
                  {/* Şifre Gücü Göstergesi */}
                  {inputText && key && (
                    <div className="mb-6">
                      {(() => {
                        const strength = getCipherStrength(inputText, key);
                        return (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Şifre Gücü:</span>
                              <span className={`font-semibold ${strength.color}`}>{strength.level}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                style={{ width: `${strength.score}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{Math.round(strength.score)}/100 puan</div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm">
                      <strong>Not:</strong> Beaufort şifresinde şifreleme ve şifre çözme işlemi aynıdır. 
                      Metni iki kez şifrelerseniz, orijinal metne geri dönersiniz.
                    </p>
                  </div>
                </motion.div>

                {/* Analiz ve Geçmiş Butonları */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <button
                    onClick={() => setShowTable(!showTable)}
                    className="px-4 py-3 bg-[#38B6FF]/10 hover:bg-[#38B6FF]/20 text-[#38B6FF] rounded-lg transition-colors flex justify-center items-center"
                  >
                    <span className="mr-2">{showTable ? 'Tabloyu Gizle' : 'Beaufort Tablosu'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform ${showTable ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className="px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex justify-center items-center"
                  >
                    <span className="mr-2">{showAnalysis ? 'Analizi Gizle' : 'Metin Analizi'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform ${showAnalysis ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors flex justify-center items-center"
                  >
                    <span className="mr-2">{showHistory ? 'Geçmişi Gizle' : 'İşlem Geçmişi'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform ${showHistory ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </button>
                </div>

                {/* Metin Analizi */}
                {showAnalysis && outputText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Metin Analizi</h3>
                    
                    {/* Analiz Türü Seçici */}
                    <div className="flex space-x-2 mb-6">
                      <button
                        onClick={() => setAnalysisType("frequency")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          analysisType === "frequency" 
                            ? "bg-[#38B6FF] text-white" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Frekans Analizi
                      </button>
                      <button
                        onClick={() => setAnalysisType("strength")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          analysisType === "strength" 
                            ? "bg-[#38B6FF] text-white" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Güvenlik Analizi
                      </button>
                      <button
                        onClick={() => setAnalysisType("pattern")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          analysisType === "pattern" 
                            ? "bg-[#38B6FF] text-white" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Kalıp Analizi
                      </button>
                    </div>

                    {analysisType === "frequency" && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Harf Frekansları</h4>
                        {(() => {
                          const { sorted, total } = getFrequencyAnalysis(outputText);
                          return (
                            <div className="space-y-2">
                              {sorted.slice(0, 10).map((item) => (
                                <div key={item.char} className="flex items-center space-x-3">
                                  <span className="w-8 text-center font-mono font-bold">{item.char}</span>
                                  <div className="flex-1">
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                      <div
                                        className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end pr-2"
                                        style={{ width: `${Math.max(item.percentage * 3, 10)}%` }}
                                      >
                                        <span className="text-xs text-white font-medium">
                                          {item.percentage.toFixed(1)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                                </div>
                              ))}
                              <div className="text-sm text-gray-500 mt-4">
                                Toplam {alphabet.length} harften {sorted.length} farklı harf kullanıldı. ({total} karakter)
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {analysisType === "strength" && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Güvenlik Değerlendirmesi</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">Anahtar Uzunluğu</div>
                              <div className="font-semibold">{key.replace(/[^ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]/gi, "").length} karakter</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">Metin Uzunluğu</div>
                              <div className="font-semibold">{inputText.replace(/[^ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]/gi, "").length} karakter</div>
                            </div>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                            <h5 className="font-semibold text-yellow-800 mb-2">💡 Güvenlik Önerileri</h5>
                            <ul className="text-sm text-yellow-700 space-y-1">
                              {key.length < 8 && <li>• Daha uzun anahtar kullanın (en az 8 karakter)</li>}
                              {inputText.length < 50 && <li>• Daha uzun metin şifrelemek güvenliği artırır</li>}
                              {new Set(key.toUpperCase()).size < key.length * 0.7 && <li>• Anahtar kelimede tekrar eden harfleri azaltın</li>}
                              <li>• Beaufort şifresi modern standartlara göre güvenli değildir</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {analysisType === "pattern" && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Kalıp Analizi</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 mb-2">Anahtar Tekrar Paterni</div>
                            <div className="font-mono text-sm">
                              {key.repeat(Math.ceil(inputText.length / key.length)).substring(0, inputText.length)}
                            </div>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <div className="text-sm text-blue-600 mb-2">🔍 Kalıp Gözlemi</div>
                            <div className="text-sm text-blue-700">
                              Anahtar {Math.ceil(inputText.replace(/[^ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]/gi, "").length / key.replace(/[^ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]/gi, "").length)} kez tekrarlanıyor.
                              Bu, kriptanaliz için ipucu sağlayabilir.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* İşlem Geçmişi */}
                {showHistory && solutionHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">🕒 Son İşlemler</h3>
                    <div className="space-y-3">
                      {solutionHistory.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Anahtar: <span className="font-mono">{entry.key}</span>
                            </span>
                            <span className="text-xs text-gray-500">
                              {entry.timestamp.toLocaleTimeString('tr-TR')}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-gray-600">Giriş:</div>
                              <div className="font-mono bg-gray-100 p-2 rounded text-xs truncate">
                                {entry.input.substring(0, 50)}{entry.input.length > 50 ? '...' : ''}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Çıkış:</div>
                              <div className="font-mono bg-gray-100 p-2 rounded text-xs truncate">
                                {entry.output.substring(0, 50)}{entry.output.length > 50 ? '...' : ''}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setInputText(entry.input);
                              setKey(entry.key);
                            }}
                            className="mt-2 text-xs px-3 py-1 bg-[#38B6FF] text-white rounded hover:bg-[#2ea3ef] transition-colors"
                          >
                            Bu Ayarları Kullan
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

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