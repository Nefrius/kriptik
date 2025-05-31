"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function AtbashPage() {
  const [inputText, setInputText] = useState("MERHABA DÜNYA");
  const [outputText, setOutputText] = useState("");
  
  const turkishAlphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
  const reversedAlphabet = turkishAlphabet.split('').reverse().join('');

  // Atbaş şifreleme/şifre çözme fonksiyonu (şifreleme ve çözme aynı işlem)
  const atbashCipher = (text: string) => {
    return text
      .split("")
      .map((char) => {
        const upperChar = char.toUpperCase();
        const index = turkishAlphabet.indexOf(upperChar);
        
        if (index === -1) return char; // Alfabede olmayan karakterleri değiştirme
        
        const newChar = reversedAlphabet[index];
        
        // Harfin büyük/küçük harf durumunu koru
        return char === upperChar ? newChar : newChar.toLowerCase();
      })
      .join("");
  };

  // Şifreleme işlemini gerçekleştir
  useEffect(() => {
    const result = atbashCipher(inputText);
    setOutputText(result);
  }, [inputText]);

  // Türkçe alfabe karşılık tablosunu oluştur
  const getMappingTable = () => {
    return turkishAlphabet.split('').map((char, index) => ({
      original: char,
      reversed: reversedAlphabet[index]
    }));
  };

  const mappingTable = getMappingTable();

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
                📜 Atbaş Şifresi
              </h1>
              <p className="text-lg md:text-xl max-w-3xl text-white/90">
                İbranice alfabesinin tersine çevrilmesiyle oluşturulan antik şifreleme yöntemi. A=Z, B=Y, C=X şeklinde çalışır.
                En eski ve en basit şifreleme yöntemlerinden biridir.
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Atbaş Şifresi Nedir?</h2>
                  <p className="text-gray-600 mb-4">
                    Atbaş şifresi (Atbash Cipher), alfabenin her harfini, sondan başa doğru karşılık gelen harfle 
                    değiştiren basit bir monoalfabetik şifreleme yöntemidir.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Adını İbranice alfabenin ilk harfi &quot;Aleph&quot; ve son harfi &quot;Tav&quot;ın birleşiminden almıştır. 
                    Türkçe&apos;de buna benzer şekilde &quot;Atbaş&quot; olarak adlandırılabilir.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-[#38B6FF] p-4 mt-6">
                    <h3 className="text-lg font-semibold text-[#38B6FF] mb-2">Özellikler</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Ters çevirme ilkesine dayanır</li>
                      <li>• Anahtar gerektirmez</li>
                      <li>• Şifreleme ve çözme işlemi aynıdır</li>
                      <li>• Çok kolay kırılabilir</li>
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
                      &quot;Ve Tanrı dedi ki: Ben Alfa ve Omega, Başlangıç ve Sonum.&quot;
                    </p>
                    <p className="text-gray-500 mt-2">- Vahiy 21:6</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Atbaş şifresi tarihte bilinen en eski şifreleme yöntemlerinden biridir. M.Ö. 500-600 civarında 
                    İbrani yazılarında kullanıldığı düşünülmektedir.
                  </p>
                  <p className="text-gray-600">
                    İbranice Tanah (Eski Ahit) metinlerinde bazı kelimelerin Atbaş ile şifrelendiğine inanılmaktadır. 
                    Örneğin, Yeremya kitabında geçen &quot;Şeşak&quot; kelimesinin Atbaş şifresi ile &quot;Babil&quot; anlamına geldiği düşünülür.
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
                    <h3 className="text-lg font-semibold text-red-700 mb-2">⚠️ Düşük Güvenlik</h3>
                    <p className="text-red-600 text-sm">
                      Atbaş şifresi çok basit bir şifreleme yöntemidir ve hiçbir modern güvenlik uygulaması için uygun değildir.
                      Sadece tarihsel ve eğitimsel amaçlı kullanılmalıdır.
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Sabit bir dönüşüm tablosu kullandığından, bir kez çözüldüğünde tüm mesajlar aynı yöntemle çözülebilir.
                    Ayrıca, frekans analizi yöntemiyle kolayca kırılabilir.
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Atbaş Şifreleme Aracı</h2>
                  
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
                        placeholder="Şifrelenecek metni girin..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Atbaş Şifreli Metin
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
                      <strong>Not:</strong> Atbaş şifresinde şifreleme ve şifre çözme işlemi aynıdır. Metni iki kez şifrelerseniz, 
                      orijinal metne geri dönersiniz.
                    </p>
                  </div>
                </motion.div>

                {/* Karşılık Tablosu */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                >
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Atbaş Harf Dönüşüm Tablosu</h3>
                  <p className="text-gray-600 mb-4">
                    Türkçe alfabedeki her harfin Atbaş karşılığını görebilirsiniz:
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 border-b">Orijinal</th>
                          {mappingTable.slice(0, 15).map((item, index) => (
                            <th key={index} className="py-2 px-3 text-center text-sm font-semibold text-gray-700 border-b">
                              {item.original}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 px-3 text-left text-sm font-semibold text-gray-700 border-b">Atbaş</td>
                          {mappingTable.slice(0, 15).map((item, index) => (
                            <td key={index} className="py-2 px-3 text-center text-sm font-medium text-[#38B6FF] border-b">
                              {item.reversed}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 border-b">Orijinal</th>
                          {mappingTable.slice(15).map((item, index) => (
                            <th key={index} className="py-2 px-3 text-center text-sm font-semibold text-gray-700 border-b">
                              {item.original}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 px-3 text-left text-sm font-semibold text-gray-700 border-b">Atbaş</td>
                          {mappingTable.slice(15).map((item, index) => (
                            <td key={index} className="py-2 px-3 text-center text-sm font-medium text-[#38B6FF] border-b">
                              {item.reversed}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>

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
                        <h4 className="font-semibold text-gray-800">Alfabeyi Ters Çevirme</h4>
                        <p className="text-gray-600">Türkçe alfabesi: ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ</p>
                        <p className="text-gray-600">Ters alfabe: ZYÜVTUŞSRPÖONMLKJI</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Harf Değiştirme</h4>
                        <p className="text-gray-600">Her harfi, alfabenin diğer ucundaki karşılığı ile değiştirin.</p>
                        <p className="text-gray-600">Örneğin: A → Z, B → Y, C → X, Ç → V...</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Örnek</h4>
                        <p className="text-gray-600">
                          &quot;MERHABA&quot; → &quot;Ö<span className="text-[#38B6FF] font-bold">Ğ</span>S<span className="text-[#38B6FF] font-bold">I</span>Z<span className="text-[#38B6FF] font-bold">Y</span>Z&quot;<br />
                          M → Ö, E → Ğ, R → S, H → I, A → Z, B → Y, A → Z
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">İlginç Bilgi:</h4>
                    <p className="text-gray-600">
                      Atbaş şifresi, antik İbranice metinlerde kullanılmıştır. Yeremya 25:26 ve 51:41&apos;de &quot;Sheshach&quot; (ŞŞK) kelimesi 
                      Atbaş ile şifrelenmiş &quot;Babil&quot; (BBL) olarak yorumlanır.
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