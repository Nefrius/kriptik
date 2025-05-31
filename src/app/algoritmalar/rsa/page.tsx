"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function RSAPage() {
  const [message, setMessage] = useState("123");
  const [p, setP] = useState(7);
  const [q, setQ] = useState(11);
  const [e, setE] = useState(13);
  const [encrypted, setEncrypted] = useState<number | null>(null);
  const [decrypted, setDecrypted] = useState<number | null>(null);

  // RSA hesaplamaları
  const n = p * q;
  const phi = (p - 1) * (q - 1);

  // Modular exponentiation - büyük sayılar için optimize edilmiş
  const modPow = (base: number, exp: number, mod: number): number => {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  };

  // Extended Euclidean Algorithm - modular inverse için
  const extgcd = (a: number, b: number): [number, number, number] => {
    if (a === 0) return [b, 0, 1];
    const [gcd, x1, y1] = extgcd(b % a, a);
    const x = y1 - Math.floor(b / a) * x1;
    const y = x1;
    return [gcd, x, y];
  };

  const modInverse = (a: number, m: number): number => {
    const [gcd, x] = extgcd(a, m);
    if (gcd !== 1) throw new Error("Modular inverse does not exist");
    return ((x % m) + m) % m;
  };

  // RSA anahtarlarını hesapla
  const calculateKeys = () => {
    try {
      const d = modInverse(e, phi);
      return { publicKey: { n, e }, privateKey: { n, d } };
    } catch {
      return null;
    }
  };

  const keys = calculateKeys();

  // Şifreleme
  const encryptMessage = () => {
    if (!keys) return;
    const msg = parseInt(message);
    if (isNaN(msg) || msg >= n) {
      alert(`Mesaj ${n}&apos;den küçük bir sayı olmalıdır`);
      return;
    }
    const encrypted = modPow(msg, keys.publicKey.e, keys.publicKey.n);
    setEncrypted(encrypted);
  };

  // Şifre çözme
  const decryptMessage = () => {
    if (!keys || encrypted === null) return;
    const decrypted = modPow(encrypted, keys.privateKey.d, keys.privateKey.n);
    setDecrypted(decrypted);
  };

  // GCD hesaplama
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const isValidE = keys && gcd(e, phi) === 1;

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
                🔑 RSA Algoritması
              </h1>
              <p className="text-lg md:text-xl max-w-3xl text-white/90">
                Rivest, Shamir ve Adleman tarafından 1977&apos;de geliştirilen RSA, ilk pratik açık 
                anahtarlı şifreleme sistemidir. Büyük sayıların faktörizasyonunun zorluğuna dayanır 
                ve modern internetin güvenlik temelini oluşturur.
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">RSA Nedir?</h2>
                  <p className="text-gray-600 mb-4">
                    RSA, açık anahtarlı kriptografinin ilk pratik uygulamasıdır. İki farklı anahtar 
                    kullanır: biri şifreleme (açık anahtar), diğeri şifre çözme (özel anahtar) için.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Güvenliği, büyük sayıların faktörizasyonunun hesaplama açısından zor olmasına dayanır. 
                    1024-bit veya daha büyük anahtarlar günümüzde güvenli kabul edilir.
                  </p>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-6">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">Kullanım Alanları</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>• HTTPS/SSL şifreleme</li>
                      <li>• Dijital imzalar</li>
                      <li>• E-posta güvenliği</li>
                      <li>• Anahtar değişimi</li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Matematiksel Temel</h2>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">1. Asal Sayı Seçimi</h4>
                      <p className="text-gray-600 text-sm">İki büyük asal sayı p ve q seçilir</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">2. Modulus Hesaplama</h4>
                      <p className="text-gray-600 text-sm">n = p × q hesaplanır</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">3. Euler Fonksiyonu</h4>
                      <p className="text-gray-600 text-sm">φ(n) = (p-1) × (q-1)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">4. Açık Üs</h4>
                      <p className="text-gray-600 text-sm">gcd(e, φ(n)) = 1 olan e seçilir</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">5. Özel Üs</h4>
                      <p className="text-gray-600 text-sm">d ≡ e⁻¹ (mod φ(n))</p>
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
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <h3 className="text-lg font-semibold text-red-700 mb-2">⚠️ Uyarı</h3>
                    <p className="text-red-600 text-sm">
                      Bu demo sadece eğitim amaçlıdır. Gerçek uygulamalarda çok daha büyük 
                      asal sayılar (1024-bit+) kullanılmalıdır.
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    RSA&apos;nın güvenliği, p ve q&apos;nun gizli tutulmasına bağlıdır. Bu sayılar 
                    bilinirse, özel anahtar hesaplanabilir.
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">RSA Anahtar Oluşturucu</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label htmlFor="p" className="block text-gray-700 text-sm font-medium mb-2">
                        Asal sayı p
                      </label>
                      <input
                        type="number"
                        id="p"
                        value={p}
                        onChange={(e) => setP(parseInt(e.target.value) || 7)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                        min="2"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="q" className="block text-gray-700 text-sm font-medium mb-2">
                        Asal sayı q
                      </label>
                      <input
                        type="number"
                        id="q"
                        value={q}
                        onChange={(e) => setQ(parseInt(e.target.value) || 11)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                        min="2"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="e" className="block text-gray-700 text-sm font-medium mb-2">
                        Açık üs e
                      </label>
                      <input
                        type="number"
                        id="e"
                        value={e}
                        onChange={(e) => setE(parseInt(e.target.value) || 13)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                        min="2"
                      />
                    </div>
                  </div>

                  {/* Hesaplanmış Değerler */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Hesaplanmış Değerler</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-600">n = p × q</div>
                        <div className="text-xl font-bold text-[#38B6FF]">{n}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">φ(n)</div>
                        <div className="text-xl font-bold text-[#38B6FF]">{phi}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Açık Anahtar</div>
                        <div className="text-sm font-bold text-green-600">({n}, {e})</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Özel Anahtar</div>
                        <div className="text-sm font-bold text-red-600">
                          {keys ? `(${n}, ${keys.privateKey.d})` : "Geçersiz"}
                        </div>
                      </div>
                    </div>
                    
                    {!isValidE && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-red-700 text-sm">
                          ⚠️ e değeri φ(n) ile aralarında asal olmalıdır. gcd(e, φ(n)) = {gcd(e, phi)}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Şifreleme Bölümü */}
                {keys && isValidE && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">RSA Şifreleme Demonstrasyonu</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                          Mesaj (sayısal, n&apos;den küçük: &lt; {n})
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                            placeholder="Şifrelenecek sayıyı girin..."
                          />
                          <button
                            onClick={encryptMessage}
                            className="px-4 py-2 bg-[#38B6FF] text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Şifrele
                          </button>
                        </div>
                      </div>

                      {encrypted !== null && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">Şifrelenmiş Mesaj:</h4>
                          <p className="text-2xl font-mono text-blue-900">{encrypted}</p>
                          <p className="text-sm text-blue-600 mt-2">
                            Hesaplama: {message}^{e} mod {n} = {encrypted}
                          </p>
                          <button
                            onClick={decryptMessage}
                            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Şifre Çöz
                          </button>
                        </div>
                      )}

                      {decrypted !== null && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">Çözülen Mesaj:</h4>
                          <p className="text-2xl font-mono text-green-900">{decrypted}</p>
                          <p className="text-sm text-green-600 mt-2">
                            Hesaplama: {encrypted}^{keys.privateKey.d} mod {n} = {decrypted}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Algoritma Adımları */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-4 text-gray-800">RSA Algoritması Adımları</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Anahtar Oluşturma</h4>
                        <p className="text-gray-600">İki büyük asal sayı p ve q seç, n = p×q hesapla</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Euler Fonksiyonu</h4>
                        <p className="text-gray-600">φ(n) = (p-1)(q-1) hesapla</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Açık Üs Seçimi</h4>
                        <p className="text-gray-600">gcd(e, φ(n)) = 1 koşulunu sağlayan e seç</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Özel Üs Hesaplama</h4>
                        <p className="text-gray-600">d ≡ e⁻¹ (mod φ(n)) hesapla</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-[#38B6FF] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">Şifreleme/Çözme</h4>
                        <p className="text-gray-600">Şifrele: c ≡ m^e (mod n), Çöz: m ≡ c^d (mod n)</p>
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