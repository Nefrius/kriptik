"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function AESPage() {
  const [inputText, setInputText] = useState("Bu metin şifrelenecek");
  const [outputText, setOutputText] = useState("");
  const [key, setKey] = useState("gizli-anahtar-123");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [keySize, setKeySize] = useState<"128" | "192" | "256">("128");
  const [showDetails, setShowDetails] = useState(false);

  // AES şifrelemesi web tarayıcısında gerçek olarak çalıştırılamayacağı için, 
  // bu bir eğitim amaçlı gösterim sayfasıdır. Gerçek AES şifrelemesi için 
  // crypto.subtle API veya bir kriptografi kütüphanesi kullanılmalıdır.

  const handleProcess = () => {
    // Demo amaçlı bir şifreleme/çözme simülasyonu
    if (mode === "encrypt") {
      const result = `[AES-${keySize} Şifrelenmiş Veri] ${inputText}`;
      setOutputText(result);
    } else {
      // Şifreli metinde "[AES-XXX Şifrelenmiş Veri]" ifadesini arıyoruz
      const regex = /\[AES-\d+ Şifrelenmiş Veri\] (.*)/;
      const match = inputText.match(regex);
      
      if (match && match[1]) {
        setOutputText(match[1]);
      } else {
        setOutputText("Hata: Geçersiz şifreli metin formatı");
      }
    }
  };

  // AES'in blok boyutu daima 128 bit (16 bayt) olacaktır
  const blockSize = 128;
  
  // Anahtar uzunluğuna göre tur sayısı
  const rounds = {
    "128": 10,
    "192": 12,
    "256": 14
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
                🛡️ AES (Advanced Encryption Standard)
              </h1>
              <p className="text-lg md:text-xl max-w-3xl text-white/90">
                Günümüzde yaygın olarak kullanılan güvenli simetrik şifreleme standardı. 128, 192 veya 256-bit
                anahtar destekleyen, blok bazlı şifreleme algoritması.
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">AES Nedir?</h2>
                  <p className="text-gray-600 mb-4">
                    AES (Advanced Encryption Standard), Rijndael algoritmasından türetilen ve ABD hükümeti 
                    tarafından 2001 yılında standart olarak kabul edilen simetrik şifreleme algoritmasıdır.
                  </p>
                  <p className="text-gray-600 mb-4">
                    DES&apos;in yerini alan AES, günümüzde internet güvenliği, disk şifreleme, dosya şifreleme ve 
                    birçok güvenlik uygulamasında yaygın olarak kullanılmaktadır.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-[#38B6FF] p-4 mt-6">
                    <h3 className="text-lg font-semibold text-[#38B6FF] mb-2">Özellikler</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Blok boyutu: 128 bit</li>
                      <li>• Anahtar boyutları: 128, 192, 256 bit</li>
                      <li>• Hız ve güvenlik dengesi</li>
                      <li>• Hem yazılım hem donanımda verimli</li>
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
                      &quot;Açık ve sistematik şifreleme algoritmalarının güvenliği, algoritmanın gizliliğine değil, 
                      anahtarın gizliliğine dayanır.&quot;
                    </p>
                    <p className="text-gray-500 mt-2">- Kerckhoffs Prensibi</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    AES, NIST (National Institute of Standards and Technology) tarafından DES&apos;in yerini alacak 
                    yeni bir şifreleme standardı bulmak için 1997&apos;de başlatılan açık bir yarışma sonucunda seçilmiştir.
                  </p>
                  <p className="text-gray-600">
                    Belçikalı kriptograflar Joan Daemen ve Vincent Rijmen tarafından geliştirilen Rijndael 
                    algoritması, 2000 yılında 15 aday arasından seçilmiş ve 2001 yılında FIPS 197 standardı olarak yayınlanmıştır.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Güvenlik</h2>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">✓ Yüksek Güvenlik</h3>
                    <p className="text-green-600 text-sm">
                      AES, günümüzde bilinen saldırı yöntemlerine karşı dirençlidir ve 
                      devletler dahil en hassas verilerin korunmasında güvenle kullanılmaktadır.
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    AES-256, kuantum bilgisayarların gelişiminden bile etkilenmeyecek kadar güçlü kabul edilmektedir. 
                    Kaba kuvvet saldırısı ile 256-bit anahtarı kırmak, mevcut teknoloji ile pratik olarak imkansızdır.
                  </p>
                  <p className="text-gray-600">
                    <strong>AES-256</strong> anahtarının olası kombinasyon sayısı: 2<sup>256</sup> ≈ 1.1 × 10<sup>77</sup>
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">AES Şifreleme Demonstrasyonu</h2>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                    <h3 className="text-base font-semibold text-yellow-700 mb-1">⚠️ Demo Amaçlı</h3>
                    <p className="text-yellow-600 text-sm">
                      Bu bir eğitim amaçlı AES gösterimidir. Gerçek uygulamada, uygun bir kriptografi kütüphanesi kullanılmalıdır.
                    </p>
                  </div>
                  
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
                      <label className="block text-gray-700 text-sm font-medium mb-2">Anahtar Boyutu</label>
                      <div className="flex">
                        <button 
                          className={`px-3 py-2 rounded-l-lg font-medium transition-colors ${keySize === "128" ? "bg-[#38B6FF] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                          onClick={() => setKeySize("128")}
                        >
                          128 bit
                        </button>
                        <button 
                          className={`px-3 py-2 font-medium transition-colors ${keySize === "192" ? "bg-[#38B6FF] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                          onClick={() => setKeySize("192")}
                        >
                          192 bit
                        </button>
                        <button 
                          className={`px-3 py-2 rounded-r-lg font-medium transition-colors ${keySize === "256" ? "bg-[#38B6FF] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                          onClick={() => setKeySize("256")}
                        >
                          256 bit
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="key" className="block text-gray-700 text-sm font-medium mb-2">
                      Şifreleme Anahtarı
                    </label>
                    <input
                      type="text"
                      id="key"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                      placeholder="Şifreleme anahtarını girin..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {keySize}-bit anahtar için gereken minimum uzunluk: {parseInt(keySize) / 8} karakter
                    </p>
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

                  <div className="flex justify-center">
                    <button
                      onClick={handleProcess}
                      className="px-6 py-2 bg-[#38B6FF] text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {mode === "encrypt" ? "Şifrele" : "Şifreyi Çöz"}
                    </button>
                  </div>
                </motion.div>

                {/* AES Yapısı */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">AES Yapısı ve Çalışma Prensibi</h3>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-[#38B6FF] hover:underline flex items-center text-sm"
                    >
                      {showDetails ? "Detayları Gizle" : "Detayları Göster"}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                        {showDetails ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        )}
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center">
                        <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                        <h4 className="font-semibold text-gray-800">Blok Boyutu ve Anahtar Uzunluğu</h4>
                      </div>
                      <p className="text-gray-600 ml-9 mt-1">
                        AES, {blockSize} bit (16 bayt) sabit blok boyutu kullanır ve {keySize} bit anahtar ile çalışır. 
                        Metin, {blockSize} bitlik bloklara bölünür ve her blok ayrı ayrı işlenir.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                        <h4 className="font-semibold text-gray-800">Tur Sayısı</h4>
                      </div>
                      <p className="text-gray-600 ml-9 mt-1">
                        AES-{keySize}, {rounds[keySize as keyof typeof rounds]} tur kullanır. Her tur, bir dizi matematiksel işlemden oluşur.
                      </p>
                    </div>

                    {showDetails && (
                      <>
                        <div>
                          <div className="flex items-center">
                            <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                            <h4 className="font-semibold text-gray-800">Ana İşlemler</h4>
                          </div>
                          <div className="ml-9 mt-2 space-y-2">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                              <p className="text-sm font-semibold text-gray-700">SubBytes (Bayt Değiştirme)</p>
                              <p className="text-xs text-gray-600 mt-1">
                                Her bayt, sabit bir S-box (değiştirme tablosu) kullanılarak başka bir bayt ile değiştirilir.
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                              <p className="text-sm font-semibold text-gray-700">ShiftRows (Satır Kaydırma)</p>
                              <p className="text-xs text-gray-600 mt-1">
                                Durumun her satırı belirli sayıda bayt sola kaydırılır. İlk satır kaydırılmaz, ikinci satır 1 bayt,
                                üçüncü satır 2 bayt ve dördüncü satır 3 bayt sola kaydırılır.
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                              <p className="text-sm font-semibold text-gray-700">MixColumns (Sütun Karıştırma)</p>
                              <p className="text-xs text-gray-600 mt-1">
                                Her sütundaki dört bayt, matematiksel bir fonksiyon kullanılarak birbirleriyle karıştırılır.
                                Son turda bu adım yapılmaz.
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                              <p className="text-sm font-semibold text-gray-700">AddRoundKey (Tur Anahtarı Ekleme)</p>
                              <p className="text-xs text-gray-600 mt-1">
                                Ana anahtardan türetilen tur anahtarı, blok ile XOR işlemine tabi tutulur.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            <span className="bg-[#38B6FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
                            <h4 className="font-semibold text-gray-800">Tur Anahtarları</h4>
                          </div>
                          <p className="text-gray-600 ml-9 mt-1">
                            Ana anahtardan, her tur için bir tur anahtarı türetilir. AES-{keySize} için toplamda 
                            {rounds[keySize as keyof typeof rounds] + 1} adet tur anahtarı gereklidir.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Blok Şifreleme Modları */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-4 text-gray-800">AES Blok Şifreleme Modları</h3>
                  <p className="text-gray-600 mb-4">
                    AES bir blok şifreleme algoritmasıdır. Büyük veri bloklarını şifrelemek için farklı 
                    çalışma modları kullanılır:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">ECB (Electronic Codebook)</h4>
                      <p className="text-sm text-gray-600">
                        En basit mod. Her blok bağımsız olarak şifrelenir. Aynı açık metin blokları, aynı şifreli 
                        metin bloklarını üretir. Genellikle güvenli değildir.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">CBC (Cipher Block Chaining)</h4>
                      <p className="text-sm text-gray-600">
                        Her blok şifrelenmeden önce, önceki şifreli blokla XOR işlemine tabi tutulur. 
                        Başlangıç için bir Başlangıç Vektörü (IV) gerektirir.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">CTR (Counter)</h4>
                      <p className="text-sm text-gray-600">
                        Şifreleme bir sayaç değeri kullanarak yapılır. Her blok için sayaç şifrelenir ve 
                        ardından metin ile XOR işlemine tabi tutulur. Paralel işlemeye uygundur.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">GCM (Galois/Counter Mode)</h4>
                      <p className="text-sm text-gray-600">
                        CTR modunu kullanır ve ayrıca şifrelenen verinin bütünlüğünü ve doğruluğunu kontrol 
                        eden bir kimlik doğrulama bilgisi (MAC) üretir.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Tavsiye Edilen Modlar</h4>
                    <p className="text-sm text-green-700">
                      Modern uygulamalarda genellikle AES-GCM veya AES-CBC modları önerilir. ECB modu asla kullanılmamalıdır. 
                      Her mod için uygun başlangıç vektörü (IV) veya nonce değeri seçilmelidir.
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