"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function PlayfairPage() {
  const [inputText, setInputText] = useState("MERHABA DÜNYA");
  const [outputText, setOutputText] = useState("");
  const [keyword, setKeyword] = useState("KRİPTİK");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  // Playfair matrisini oluşturmak için alfabeyi değiştir
  // Not: Türkçe'de "I" ve "İ" harfleri farklıdır, "J" harfini "I" ile birleştiriyoruz
  const turkishAlphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
  
  // Playfair matrisi oluştur
  const createPlayfairMatrix = (keyword: string) => {
    const cleanKeyword = keyword.toUpperCase().replace(/[^A-ZÇĞİÖŞÜ]/g, "");
    
    // J harfini I ile birleştir (5x5 matris için)
    const modifiedAlphabet = turkishAlphabet.replace("J", "");
    
    // Anahtar kelimeden matris oluştur
    const charSet = new Set<string>();
    
    // Önce anahtar kelimeyi ekle
    for (const char of cleanKeyword) {
      // J yerine I kullan
      if (char === "J") charSet.add("I");
      else charSet.add(char);
    }
    
    // Sonra geri kalan alfabeyi ekle
    for (const char of modifiedAlphabet) {
      charSet.add(char);
    }
    
    // 5x6 matris oluştur (Türkçe alfabe için)
    const matrix: string[][] = [];
    const chars = Array.from(charSet);
    
    for (let i = 0; i < 5; i++) {
      const row: string[] = [];
      for (let j = 0; j < 6; j++) {
        const index = i * 6 + j;
        if (index < chars.length) {
          row.push(chars[index]);
        }
      }
      matrix.push(row);
    }
    
    return matrix;
  };

  // İkilileri oluştur
  const createDigraphs = (text: string, isEncrypting: boolean) => {
    // Metindeki boşlukları ve özel karakterleri temizle
    let cleanText = text.toUpperCase().replace(/[^A-ZÇĞİÖŞÜ]/g, "");
    
    // J'yi I ile değiştir
    cleanText = cleanText.replace(/J/g, "I");
    
    const digraphs: string[] = [];
    
    for (let i = 0; i < cleanText.length; i += 2) {
      if (i + 1 >= cleanText.length) {
        // Tek harf kaldıysa, X ekle
        digraphs.push(`${cleanText[i]}X`);
      } else if (cleanText[i] === cleanText[i + 1] && isEncrypting) {
        // Aynı harfler yan yana geliyorsa araya X ekle (sadece şifrelerken)
        digraphs.push(`${cleanText[i]}X`);
        i--; // İkinci harfi tekrar kullanmak için indeksi azalt
      } else {
        digraphs.push(`${cleanText[i]}${cleanText[i + 1]}`);
      }
    }
    
    return digraphs;
  };

  // Karakterin matristeki konumunu bul
  const findPosition = (matrix: string[][], char: string) => {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === char) {
          return { row, col };
        }
      }
    }
    return { row: -1, col: -1 };
  };

  // Playfair şifreleme
  const playfairCipher = (text: string, keyword: string, mode: "encrypt" | "decrypt") => {
    const matrix = createPlayfairMatrix(keyword);
    const isEncrypting = mode === "encrypt";
    const digraphs = createDigraphs(text, isEncrypting);
    const result: string[] = [];
    
    for (const digraph of digraphs) {
      const char1 = digraph[0];
      const char2 = digraph[1];
      
      const pos1 = findPosition(matrix, char1);
      const pos2 = findPosition(matrix, char2);
      
      // Karakterler bulunamadıysa, digraphı değiştirmeden ekle
      if (pos1.row === -1 || pos2.row === -1) {
        result.push(digraph);
        continue;
      }
      
      let newChar1: string, newChar2: string;
      
      if (pos1.row === pos2.row) {
        // Aynı satırdaysa, sağdaki (şifreleme) veya soldaki (şifre çözme) karakterleri al
        const colOffset = isEncrypting ? 1 : -1;
        const col1 = (pos1.col + colOffset + matrix[pos1.row].length) % matrix[pos1.row].length;
        const col2 = (pos2.col + colOffset + matrix[pos2.row].length) % matrix[pos2.row].length;
        
        newChar1 = matrix[pos1.row][col1];
        newChar2 = matrix[pos2.row][col2];
      } else if (pos1.col === pos2.col) {
        // Aynı sütundaysa, altdaki (şifreleme) veya üstdeki (şifre çözme) karakterleri al
        const rowOffset = isEncrypting ? 1 : -1;
        const row1 = (pos1.row + rowOffset + matrix.length) % matrix.length;
        const row2 = (pos2.row + rowOffset + matrix.length) % matrix.length;
        
        newChar1 = matrix[row1][pos1.col];
        newChar2 = matrix[row2][pos2.col];
      } else {
        // Farklı satır ve sütundaysa, köşe karakterleri al
        newChar1 = matrix[pos1.row][pos2.col];
        newChar2 = matrix[pos2.row][pos1.col];
      }
      
      result.push(`${newChar1}${newChar2}`);
    }
    
    return result.join("");
  };

  // Şifreleme işlemini gerçekleştir
  useEffect(() => {
    const result = playfairCipher(inputText, keyword, mode);
    setOutputText(result);
  }, [inputText, keyword, mode]);

  // Playfair matrisini UI için oluştur
  const playfairMatrix = createPlayfairMatrix(keyword);

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
                📋 Playfair Şifresi
              </h1>
              <p className="text-lg md:text-xl max-w-3xl text-white/90">
                Harfleri ikişerli gruplar halinde şifreleyen, 5x6 matris üzerine kurulu bir şifreleme sistemi. 
                Digraf şifrelerinin öncüsüdür ve 1854 yılında geliştirilmiştir.
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Playfair Şifresi Nedir?</h2>
                  <p className="text-gray-600 mb-4">
                    Playfair, harfleri tek tek değil, ikili gruplar (digraf) halinde şifreleyen ilk pratik şifreleme 
                    sistemlerinden biridir. 5x5 veya 5x6 bir matris üzerinde çalışır.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Charles Wheatstone tarafından icat edilmiş, ancak Baron Playfair tarafından İngiliz hükümeti 
                    içinde tanıtılıp desteklendiği için onun adıyla anılmaktadır.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-[#38B6FF] p-4 mt-6">
                    <h3 className="text-lg font-semibold text-[#38B6FF] mb-2">Üstün Yanları</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Monoalfabetik şifrelerden daha güvenli</li>
                      <li>• Frekans analizine daha dirençli</li>
                      <li>• Sahada hızlı uygulanabilir</li>
                      <li>• Kağıt-kalem ile kolayca şifrelenebilir</li>
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
                      &quot;Bu şifre, pratik olarak çözülemez.&quot;
                    </p>
                    <p className="text-gray-500 mt-2">- Lord Playfair, 1854</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Playfair şifresi ilk olarak 1854 yılında İngiliz fizikçi Charles Wheatstone tarafından icat edilmiştir.
                    Baron Lyon Playfair bu şifreleme sistemini İngiliz hükümetine tanıtmıştır.
                  </p>
                  <p className="text-gray-600">
                    Bu şifre, Boer Savaşı, I. Dünya Savaşı ve II. Dünya Savaşı&apos;nın erken dönemlerinde taktik 
                    iletişim için kullanılmıştır. Özellikle sahada hızlı şifreleme gerektiren durumlarda tercih edilmiştir.
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
                      Playfair şifresi, tek harfli şifrelerden daha güvenli olsa da, modern kriptografik 
                      standartlara göre zayıf kabul edilir. Günümüzde sadece eğitim amaçlı kullanılmalıdır.
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Playfair şifresi, tek harfli yerine iki harfli birimleri şifrelediği için basit frekans analizine 
                    karşı daha dirençlidir. Ancak, digraf frekans analizi ile kırılabilir.
                  </p>
                  <p className="text-gray-600">
                    Ayrıca, bazı digraflar için değişim simetrik olduğundan (BA→XY ise AB→YX olması gibi), 
                    bu özellik kriptanalizi kolaylaştırır.
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Playfair Şifreleme Aracı</h2>
                  
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
                      <label htmlFor="keyword" className="block text-gray-700 text-sm font-medium mb-2">
                        Anahtar Kelime
                      </label>
                      <input
                        type="text"
                        id="keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
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
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm">
                      <strong>Not:</strong> Türkçe alfabe için 5x6 matris kullanılmaktadır. Şifreleme sırasında J harfi I harfi ile birleştirilir. 
                      Aynı harfler yan yana geldiğinde araya X harfi eklenir ve metin uzunluğu tek sayı ise sonuna X eklenir.
                    </p>
                  </div>
                </motion.div>

                {/* Playfair Matrisi */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                >
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Playfair Matrisi</h3>
                  <p className="text-gray-600 mb-4">
                    Anahtar kelimeye göre oluşturulan matris:
                  </p>
                  
                  <div className="overflow-x-auto">
                    <div className="inline-block">
                      <table className="border-collapse">
                        <tbody>
                          {playfairMatrix.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td 
                                  key={cellIndex} 
                                  className={`w-12 h-12 text-center border-2 border-gray-300 font-bold text-lg ${
                                    keyword.toUpperCase().includes(cell) 
                                      ? "bg-blue-100 text-blue-800" 
                                      : "bg-gray-50 text-gray-700"
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-sm mt-3">
                    * Mavi kutular anahtar kelimeden gelen harfleri göstermektedir.
                  </p>
                </motion.div>

                {/* Playfair Kuralları */}
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
                        <h4 className="font-semibold text-gray-800">Matris Oluşturma</h4>
                        <p className="text-gray-600">Anahtar kelimeyle başlayarak, tekrarlayan harfleri çıkararak 5x6 matris oluşturulur.</p>
                        <p className="text-gray-600">J harfi, I harfiyle aynı hücrede yer alır veya tamamen çıkarılır.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">İkili Gruplar (Digraf)</h4>
                        <p className="text-gray-600">Metin ikili harf gruplarına ayrılır. Aynı harfler yan yana gelirse araya X eklenir.</p>
                        <p className="text-gray-600">Örneğin: HELLO → HE LX LO</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Şifreleme Kuralları</h4>
                        <div className="mt-2 space-y-3">
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700">Aynı Satırda İse</p>
                            <p className="text-xs text-gray-600 mt-1">
                              İki harf aynı satırda ise, her harfin sağındaki harf ile değiştirilir (sağa kaydırılır).
                              Satırın sonundaysa, satırın başındaki harf alınır.
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700">Aynı Sütunda İse</p>
                            <p className="text-xs text-gray-600 mt-1">
                              İki harf aynı sütunda ise, her harfin altındaki harf ile değiştirilir (aşağı kaydırılır).
                              Sütunun sonundaysa, sütunun başındaki harf alınır.
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700">Farklı Satır ve Sütunda İse</p>
                            <p className="text-xs text-gray-600 mt-1">
                              İki harf farklı satır ve sütunda ise, her harf kendi satırında diğer harfin sütunundaki harf ile değiştirilir.
                              Bu, harflerin oluşturduğu dikdörtgenin diğer köşelerindeki harfleri seçmek anlamına gelir.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Şifre Çözme</h4>
                        <p className="text-gray-600">Aynı kurallar tersine uygulanır. Aynı satırda ise sola, aynı sütunda ise yukarı kaydırma yapılır.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Örnek:</h4>
                    <p className="text-gray-600">
                      <span className="font-bold">Anahtar:</span> &quot;KRİPTİK&quot;
                    </p>
                    <p className="text-gray-600 mt-1">
                      <span className="font-bold">Metin:</span> &quot;HELLO&quot; → &quot;HE LX LO&quot; → &quot;FNRVZR&quot;
                    </p>
                    <p className="text-gray-600 mt-1">
                      Bu şifreleme, her iki harfin matristeki konumlarına göre yapılmıştır.
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