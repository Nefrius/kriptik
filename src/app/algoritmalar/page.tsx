"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useAuth } from "@/contexts/AuthContext";
import { Lock } from "lucide-react";

export default function AlgoritmalarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const { user } = useAuth();

  // Üye olmayan kullanıcıların görebileceği algoritmalar
  const freeAlgorithms = ["caesar", "atbash", "aes"];

  const categories = [
    { id: "all", name: "Tümü", count: 0 },
    { id: "klasik", name: "Klasik Şifreler", count: 0 },
    { id: "polialfabetik", name: "Polialfabetik", count: 0 },
    { id: "transpozisyon", name: "Transpozisyon", count: 0 },
    { id: "modern", name: "Modern Şifreler", count: 0 },
    { id: "makine", name: "Makine Şifreleri", count: 0 },
    { id: "hash", name: "Hash Fonksiyonları", count: 0 },
    { id: "asimetrik", name: "Asimetrik", count: 0 }
  ];

  const difficulties = [
    { id: "all", name: "Tüm Seviyeler" },
    { id: "Kolay", name: "Kolay" },
    { id: "Orta", name: "Orta" },
    { id: "Zor", name: "Zor" },
    { id: "Çok Zor", name: "Çok Zor" }
  ];

  const algoritmalar = [
    // Klasik Şifreler
    {
      id: "caesar",
      name: "Caesar Şifresi",
      description: "Alfabedeki harflerin belirli bir sayıda kaydırılmasına dayanan en temel şifreleme yöntemi. Julius Caesar tarafından kullanılmıştır.",
      zorluk: "Kolay",
      tarih: "M.Ö. 1. Yüzyıl",
      category: "klasik",
      slug: "/algoritmalar/caesar",
      tags: ["kaydırma", "basit", "tarihsel"],
      icon: "🏛️",
      implemented: true
    },
    {
      id: "substitution",
      name: "Yerine Koyma Şifresi",
      description: "Alfabedeki her harfin başka bir harf ile değiştirilmesine dayanan şifreleme yöntemi. Monoalfabetik şifrelerin temelidir.",
      zorluk: "Orta",
      tarih: "Antik Çağlar",
      category: "klasik",
      slug: "/algoritmalar/substitution",
      tags: ["ikame", "alfabe", "monoalfabetik"],
      icon: "🔤",
      implemented: true
    },
    {
      id: "atbash",
      name: "Atbaş Şifresi",
      description: "İbranice alfabesinin tersine çevrilmesiyle oluşturulan antik şifreleme yöntemi. A=Z, B=Y şeklinde çalışır.",
      zorluk: "Kolay",
      tarih: "M.Ö. 500",
      category: "klasik",
      slug: "/algoritmalar/atbash",
      tags: ["ters", "ibranice", "antik"],
      icon: "📜",
      implemented: true
    },
    {
      id: "affine",
      name: "Affine Şifresi",
      description: "Matematiksel formül kullanarak harfleri dönüştüren şifreleme yöntemi. Caesar şifresinin genelleştirilmiş halidir.",
      zorluk: "Orta",
      tarih: "19. Yüzyıl",
      category: "klasik",
      slug: "/algoritmalar/affine",
      tags: ["matematik", "formül", "lineer"],
      icon: "📐",
      implemented: false
    },

    // Polialfabetik Şifreler
    {
      id: "vigenere",
      name: "Vigenère Şifresi",
      description: "Bir anahtar kelime kullanarak harflerin farklı miktarlarda kaydırılmasına dayanan polialfabetik şifreleme. Uzun süre kırılamaz kabul edilmiştir.",
      zorluk: "Orta",
      tarih: "16. Yüzyıl",
      category: "polialfabetik",
      slug: "/algoritmalar/vigenere",
      tags: ["anahtar", "polialfabetik", "tekrarlı"],
      icon: "🗝️",
      implemented: true
    },
    {
      id: "beaufort",
      name: "Beaufort Şifresi",
      description: "Vigenère şifresinin modifikasyonu. Şifreleme ve şifre çözme işlemleri aynı algoritma ile yapılır.",
      zorluk: "Orta",
      tarih: "1857",
      category: "polialfabetik",
      slug: "/algoritmalar/beaufort",
      tags: ["vigenere", "simetrik", "naval"],
      icon: "⚓",
      implemented: true
    },
    {
      id: "autokey",
      name: "Autokey Şifresi",
      description: "Anahtar olarak hem sabit bir kelime hem de metnin kendisini kullanan gelişmiş Vigenère varyantı.",
      zorluk: "Zor",
      tarih: "1586",
      category: "polialfabetik",
      slug: "/algoritmalar/autokey",
      tags: ["otomatik", "anahtar", "gelişmiş"],
      icon: "🔐",
      implemented: false
    },

    // Transpozisyon Şifreleri
    {
      id: "transposition",
      name: "Yer Değiştirme Şifresi",
      description: "Metindeki harflerin yerlerinin belirli bir kurala göre değiştirilmesine dayalı şifreleme. Harfler değişmez, sadece konumları değişir.",
      zorluk: "Orta",
      tarih: "Antik Çağlar",
      category: "transpozisyon",
      slug: "/algoritmalar/transposition",
      tags: ["konum", "sıralama", "matris"],
      icon: "🔄",
      implemented: false
    },
    {
      id: "railfence",
      name: "Rail Fence Şifresi",
      description: "Metni zigzag şeklinde yazarak şifreleyen basit transpozisyon yöntemi. Çit şifresi olarak da bilinir.",
      zorluk: "Kolay",
      tarih: "Antik Çağlar",
      category: "transpozisyon",
      slug: "/algoritmalar/railfence",
      tags: ["zigzag", "çit", "basit"],
      icon: "🚂",
      implemented: true
    },
    {
      id: "columnar",
      name: "Sütunsal Transpozisyon",
      description: "Metni tabloya yerleştirip sütunları belirli bir sıraya göre okuyarak şifreleyen yöntem.",
      zorluk: "Orta",
      tarih: "1. Dünya Savaşı",
      category: "transpozisyon",
      slug: "/algoritmalar/columnar",
      tags: ["tablo", "sütun", "sıralama"],
      icon: "📊",
      implemented: true
    },

    // Makine Şifreleri
    {
      id: "enigma",
      name: "Enigma Makinesi",
      description: "II. Dünya Savaşı'nda Almanlar tarafından kullanılan mekanik ve elektrikli şifreleme cihazı. Rotorlar kullanarak karmaşık şifreleme yapar.",
      zorluk: "Çok Zor",
      tarih: "1918-1945",
      category: "makine",
      slug: "/algoritmalar/enigma",
      tags: ["rotor", "alman", "savaş"],
      icon: "⚙️",
      implemented: false
    },
    {
      id: "lorenz",
      name: "Lorenz Şifresi",
      description: "Almanya'nın yüksek komuta seviyesi iletişimi için kullandığı gelişmiş telekomunikasyon şifreleme sistemi.",
      zorluk: "Çok Zor",
      tarih: "1940-1945",
      category: "makine",
      slug: "/algoritmalar/lorenz",
      tags: ["teletype", "tunny", "bletchley"],
      icon: "📞",
      implemented: false
    },

    // Matris ve Geometrik Şifreler
    {
      id: "playfair",
      name: "Playfair Şifresi",
      description: "Harfleri ikişerli gruplar halinde şifreleyen, 5x5 matris üzerine kurulu bir şifreleme sistemi. Digraf şifrelerinin öncüsüdür.",
      zorluk: "Zor",
      tarih: "1854",
      category: "klasik",
      slug: "/algoritmalar/playfair",
      tags: ["matris", "ikili", "digraf"],
      icon: "📋",
      implemented: true
    },
    {
      id: "foursquare",
      name: "Four Square Şifresi",
      description: "Dört adet 5x5 matris kullanarak Playfair şifresini geliştiren yöntem. Daha güvenli digraf şifresi.",
      zorluk: "Zor",
      tarih: "1896",
      category: "klasik",
      slug: "/algoritmalar/foursquare",
      tags: ["dörtlü", "matris", "gelişmiş"],
      icon: "⬜",
      implemented: false
    },
    {
      id: "twosquare",
      name: "Two Square Şifresi",
      description: "İki matris kullanarak çalışan Playfair benzeri şifreleme sistemi. Wheatstone tarafından geliştirilmiştir.",
      zorluk: "Zor",
      tarih: "1854",
      category: "klasik",
      slug: "/algoritmalar/twosquare",
      tags: ["ikili", "wheatstone", "matris"],
      icon: "⬛",
      implemented: false
    },

    // Modern Şifreler
    {
      id: "des",
      name: "DES (Data Encryption Standard)",
      description: "1970'lerde geliştirilen simetrik blok şifreleme standardı. 56-bit anahtar kullanır ve artık güvenli değildir.",
      zorluk: "Çok Zor",
      tarih: "1977",
      category: "modern",
      slug: "/algoritmalar/des",
      tags: ["blok", "simetrik", "standard"],
      icon: "🔒",
      implemented: false
    },
    {
      id: "aes",
      name: "AES (Advanced Encryption Standard)",
      description: "Günümüzde yaygın olarak kullanılan güvenli simetrik şifreleme standardı. 128, 192 veya 256-bit anahtar destekler.",
      zorluk: "Çok Zor",
      tarih: "2001",
      category: "modern",
      slug: "/algoritmalar/aes",
      tags: ["rijndael", "standard", "güvenli"],
      icon: "🛡️",
      implemented: true
    },
    {
      id: "blowfish",
      name: "Blowfish",
      description: "Bruce Schneier tarafından tasarlanan hızlı ve güvenli simetrik şifreleme algoritması. Değişken anahtar boyutu destekler.",
      zorluk: "Zor",
      tarih: "1993",
      category: "modern",
      slug: "/algoritmalar/blowfish",
      tags: ["schneier", "hızlı", "değişken"],
      icon: "🐡",
      implemented: false
    },

    // Asimetrik Şifreler
    {
      id: "rsa",
      name: "RSA",
      description: "Rivest, Shamir ve Adleman tarafından geliştirilen ilk pratik açık anahtarlı şifreleme sistemi. Büyük sayıların faktörizasyonuna dayanır.",
      zorluk: "Çok Zor",
      tarih: "1977",
      category: "asimetrik",
      slug: "/algoritmalar/rsa",
      tags: ["açık-anahtar", "faktorizasyon", "dijital-imza"],
      icon: "🔑",
      implemented: true
    },
    {
      id: "ecc",
      name: "Eliptik Eğri Kriptografisi",
      description: "Eliptik eğriler üzerindeki matematik problemlere dayanan modern açık anahtarlı şifreleme yöntemi.",
      zorluk: "Çok Zor",
      tarih: "1985",
      category: "asimetrik",
      slug: "/algoritmalar/ecc",
      tags: ["eliptik", "eğri", "modern"],
      icon: "📈",
      implemented: false
    },
    {
      id: "dh",
      name: "Diffie-Hellman",
      description: "İki taraf arasında güvenli anahtar değişimi için kullanılan ilk açık anahtarlı protokol.",
      zorluk: "Zor",
      tarih: "1976",
      category: "asimetrik",
      slug: "/algoritmalar/dh",
      tags: ["anahtar-değişimi", "protokol", "ilk"],
      icon: "🤝",
      implemented: false
    },

    // Hash Fonksiyonları
    {
      id: "md5",
      name: "MD5",
      description: "128-bit hash değeri üreten yaygın kullanılan ancak artık güvenli olmayan hash fonksiyonu.",
      zorluk: "Orta",
      tarih: "1991",
      category: "hash",
      slug: "/algoritmalar/md5",
      tags: ["128-bit", "hash", "eski"],
      icon: "🔍",
      implemented: false
    },
    {
      id: "sha1",
      name: "SHA-1",
      description: "160-bit hash değeri üreten, eskiden güvenli kabul edilen ancak artık kırılmış hash fonksiyonu.",
      zorluk: "Orta",
      tarih: "1995",
      category: "hash",
      slug: "/algoritmalar/sha1",
      tags: ["160-bit", "kırılmış", "eski"],
      icon: "⚠️",
      implemented: false
    },
    {
      id: "sha256",
      name: "SHA-256",
      description: "256-bit hash değeri üreten güvenli hash fonksiyonu. Bitcoin ve birçok modern uygulamada kullanılır.",
      zorluk: "Zor",
      tarih: "2001",
      category: "hash",
      slug: "/algoritmalar/sha256",
      tags: ["256-bit", "güvenli", "bitcoin"],
      icon: "💎",
      implemented: false
    },
    {
      id: "bcrypt",
      name: "bcrypt",
      description: "Parola hashleme için özel olarak tasarlanmış yavaş ve güvenli hash fonksiyonu.",
      zorluk: "Zor",
      tarih: "1999",
      category: "hash",
      slug: "/algoritmalar/bcrypt",
      tags: ["parola", "yavaş", "tuz"],
      icon: "🔐",
      implemented: false
    },

    // Diğer İlginç Şifreler
    {
      id: "morse",
      name: "Morse Kodu",
      description: "Harfleri nokta ve çizgilerle temsil eden iletişim sistemi. Şifreleme amaçlı da kullanılabilir.",
      zorluk: "Kolay",
      tarih: "1830'lar",
      category: "klasik",
      slug: "/algoritmalar/morse",
      tags: ["nokta", "çizgi", "telgraf"],
      icon: "📡",
      implemented: false
    },
    {
      id: "base64",
      name: "Base64 Kodlama",
      description: "Binary veriyi text formatına dönüştürmek için kullanılan kodlama yöntemi. Şifreleme değil, kodlamadır.",
      zorluk: "Kolay",
      tarih: "1980'ler",
      category: "modern",
      slug: "/algoritmalar/base64",
      tags: ["kodlama", "binary", "text"],
      icon: "💾",
      implemented: false
    },
    {
      id: "scytale",
      name: "Scytale Şifresi",
      description: "Antik Sparta'da kullanılan silindir etrafına sarılan deri şerit ile yapılan transpozisyon şifresi.",
      zorluk: "Kolay",
      tarih: "M.Ö. 7. Yüzyıl",
      category: "transpozisyon",
      slug: "/algoritmalar/scytale",
      tags: ["sparta", "silindir", "antik"],
      icon: "📜",
      implemented: false
    }
  ];

  // Filtrelenmiş ve sıralanmış algoritmalar
  const filteredAlgoritmalar = useMemo(() => {
    let filtered = algoritmalar;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(alg => 
        alg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alg.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Kategori filtresi
    if (selectedCategory !== "all") {
      filtered = filtered.filter(alg => alg.category === selectedCategory);
    }

    // Zorluk filtresi
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(alg => alg.zorluk === selectedDifficulty);
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name, 'tr');
        case "difficulty":
          const diffOrder: { [key: string]: number } = { "Kolay": 1, "Orta": 2, "Zor": 3, "Çok Zor": 4 };
          return diffOrder[a.zorluk] - diffOrder[b.zorluk];
        case "date":
          return new Date(a.tarih).getTime() - new Date(b.tarih).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  // Kategori sayılarını güncelle
  const updatedCategories = categories.map(cat => ({
    ...cat,
    count: cat.id === "all" ? algoritmalar.length : algoritmalar.filter(alg => alg.category === cat.id).length
  }));

  const difficultyColors: { [key: string]: string } = {
    "Kolay": "bg-green-100 text-green-800",
    "Orta": "bg-yellow-100 text-yellow-800", 
    "Zor": "bg-orange-100 text-orange-800",
    "Çok Zor": "bg-red-100 text-red-800"
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/algoritmalar" />

        {/* Page Header */}
        <div className="bg-[#38B6FF] text-white py-16 px-4 md:px-8 relative">
          <div className="container mx-auto max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Şifreleme Algoritmaları</span>
              </h1>
              <p className="text-lg md:text-xl max-w-4xl text-white mb-8">
                Antik çağlardan günümüze kadar geliştirilmiş şifreleme yöntemlerini keşfedin. 
                Klasik şifrelerden modern kriptografi algoritmalarına kadar geniş bir koleksiyon.
              </p>
              
              {/* İstatistikler */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{algoritmalar.length}</div>
                  <div className="text-sm text-white/80">Toplam Algoritma</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{updatedCategories.length - 1}</div>
                  <div className="text-sm text-white/80">Kategori</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{algoritmalar.filter(a => a.zorluk === "Kolay").length}</div>
                  <div className="text-sm text-white/80">Kolay Seviye</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{algoritmalar.filter(a => a.zorluk === "Çok Zor").length}</div>
                  <div className="text-sm text-white/80">Çok Zor Seviye</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filtre ve Arama Bölümü */}
        <section className="py-8 px-4 md:px-8 bg-gray-50 border-b">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Arama Çubuğu */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Algoritma ara... (örn: Caesar, RSA, hash)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Zorluk Filtresi */}
              <div>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                >
                  {difficulties.map(diff => (
                    <option key={diff.id} value={diff.id}>{diff.name}</option>
                  ))}
                </select>
              </div>

              {/* Sıralama */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                >
                  <option value="name">İsme Göre Sırala</option>
                  <option value="difficulty">Zorluğa Göre</option>
                  <option value="date">Tarihe Göre</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Ana İçerik */}
        <div className="py-12 px-4 md:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Kenar Çubuğu - Kategoriler */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
            <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Kategoriler</h3>
                    <div className="space-y-2">
                      {updatedCategories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${
                            selectedCategory === category.id
                              ? "bg-[#38B6FF] text-white"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            selectedCategory === category.id
                              ? "bg-white/20 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}>
                            {category.count}
                          </span>
                        </button>
                      ))}
                    </div>
            </motion.div>
                </div>
              </div>

              {/* Algoritmalar Listesi */}
              <div className="lg:col-span-3">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {filteredAlgoritmalar.length} Algoritma Bulundu
                  </h2>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-sm text-[#38B6FF] hover:underline flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      Aramayı Temizle
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAlgoritmalar.map((algoritma, index) => {
                    const isAccessible = user || freeAlgorithms.includes(algoritma.id);
                    
                    return (
                      <motion.div
                        key={algoritma.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        {isAccessible && algoritma.implemented ? (
                          <Link href={algoritma.slug} className="group">
                            <div className="border border-gray-200 h-full rounded-xl transition-all duration-300 group-hover:shadow-[0_8px_30px_0_rgba(56,182,255,0.15)] group-hover:border-[#38B6FF]/30 overflow-hidden bg-white">
                              <div className="h-2 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] rounded-t-xl"></div>
                    <div className="p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center">
                                    <span className="text-2xl mr-3">{algoritma.icon}</span>
                                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#38B6FF] transition-colors">
                        {algoritma.name}
                      </h3>
                                  </div>
                                </div>
                                
                                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                        {algoritma.description}
                      </p>
                      
                                <div className="space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[algoritma.zorluk]}`}>
                            {algoritma.zorluk}
                          </span>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {algoritma.tarih}
                          </span>
                        </div>
                                  
                                  <div className="flex flex-wrap gap-1">
                                    {algoritma.tags.slice(0, 3).map(tag => (
                                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                      </div>
                    </div>
                              
                              <div className="p-4 bg-gray-50 border-t border-gray-100 group-hover:bg-blue-50 transition-colors">
                      <span className="inline-flex items-center text-sm font-medium text-[#38B6FF]">
                        Detayları Görüntüle
                        <motion.svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                                    className="w-5 h-5 ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            repeatType: "loop",
                            ease: "easeInOut",
                            repeatDelay: 1
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </motion.svg>
                      </span>
                    </div>
                  </div>
                </Link>
                        ) : !isAccessible ? (
                          /* Premium Algorithm Card */
                          <div className="border border-orange-200 h-full rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 relative">
                            <div className="h-2 bg-gradient-to-r from-orange-400 to-amber-500 rounded-t-xl"></div>
                            <div className="p-6 flex flex-col h-full relative">
                              {/* Premium Badge */}
                              <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                                <Lock size={12} className="mr-1" />
                                Premium
                              </div>
                              
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                  <span className="text-2xl mr-3 opacity-60">{algoritma.icon}</span>
                                  <h3 className="text-xl font-semibold text-gray-700">
                                    {algoritma.name}
                                  </h3>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                                {algoritma.description}
                              </p>
                              
                              <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    {algoritma.zorluk}
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                    {algoritma.tarih}
                                  </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-1">
                                  {algoritma.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-orange-50 text-orange-700">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <Link href="/auth" className="block p-4 bg-gradient-to-r from-orange-100 to-amber-100 border-t border-orange-200 hover:from-orange-200 hover:to-amber-200 transition-colors">
                              <span className="inline-flex items-center text-sm font-medium text-orange-700 w-full justify-center">
                                <Lock size={16} className="mr-2" />
                                Üye Ol ve Erişim Kazan
                              </span>
                            </Link>
                          </div>
                        ) : (
                          /* Coming Soon Card */
                          <div className="border border-gray-200 h-full rounded-xl overflow-hidden bg-white opacity-75 cursor-not-allowed">
                            <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-t-xl"></div>
                            <div className="p-6 flex flex-col h-full relative">
                              {/* Yakında Badge */}
                              <div className="absolute top-2 right-2 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
                                Yakında
                              </div>
                              
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                  <span className="text-2xl mr-3 grayscale">{algoritma.icon}</span>
                                  <h3 className="text-xl font-semibold text-gray-600">
                                    {algoritma.name}
                                  </h3>
                                </div>
                              </div>
                              
                              <p className="text-gray-500 mb-6 flex-grow leading-relaxed">
                                {algoritma.description}
                              </p>
                              
                              <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    {algoritma.zorluk}
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    {algoritma.tarih}
                                  </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-1">
                                  {algoritma.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-50 text-gray-500">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-gray-100 border-t border-gray-200">
                              <span className="inline-flex items-center text-sm font-medium text-gray-500">
                                Geliştiriliyor...
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {filteredAlgoritmalar.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Sonuç Bulunamadı</h3>
                    <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bilgi Bölümü */}
        <section className="py-16 px-4 md:px-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-[#E8F7FF] border border-[#A3DDFF] p-8 rounded-xl"
              >
                <h2 className="text-2xl font-bold mb-6 text-[#003B5F]">Kriptografi Tarihçesi</h2>
                <p className="text-[#005A91] mb-4">
                   Şifreleme sanatı, insanlık tarihi kadar eskidir. Antik Mısır&apos;dan günümüze kadar, 
                   gizli bilgi iletme ihtiyacı sürekli yeni yöntemlerin geliştirilmesine yol açmıştır.
                </p>
                <p className="text-[#005A91]">
                  Bu koleksiyonda, basit Caesar şifresinden modern AES algoritmasına kadar, 
                  kriptografinin evrimini kronolojik olarak takip edebilirsiniz.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-[#FFF4E6] border border-[#FFD6A3] p-8 rounded-xl"
              >
                <h2 className="text-2xl font-bold mb-6 text-[#8B4513]">Öğrenme Yolu</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                    <span className="text-[#8B4513]">Kolay seviye klasik şifrelerle başlayın</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                    <span className="text-[#8B4513]">Orta seviye polialfabetik şifreleri öğrenin</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                    <span className="text-[#8B4513]">Zor seviye makine şifrelerini keşfedin</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
                    <span className="text-[#8B4513]">Modern kriptografi ile tamamlayın</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
} 