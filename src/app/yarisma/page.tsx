"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Trophy, Star, Users, Target } from "lucide-react";

interface Puzzle {
  id: number;
  title: string;
  description: string;
  cipher_text: string;
  algorithm: string;
  difficulty: "Kolay" | "Orta" | "Zor" | "Çok Zor";
  points: number;
  hint: string;
  category: string;
  is_active: boolean;
  solved_count?: number;
  user_solved?: boolean;
}

interface UserStats {
  total_points: number;
  puzzles_solved: number;
  rank_position: number;
}

export default function YarismaPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const { user } = useAuth();

  // Puzzle verilerini getir
  const fetchPuzzles = async () => {
    try {
      setLoading(true);
      
      // Tüm aktif puzzle'ları getir
      const { data: puzzlesData, error: puzzlesError } = await supabase
        .from('puzzles')
        .select('*')
        .eq('is_active', true)
        .order('difficulty', { ascending: true });

      if (puzzlesError) {
        console.error('Puzzlelar yüklenirken hata:', puzzlesError);
        return;
      }

      // Her puzzle için çözen sayısını hesapla
      const puzzlesWithStats = await Promise.all(
        (puzzlesData || []).map(async (puzzle) => {
          // Bu puzzle'ı çözen toplam kullanıcı sayısı
          const { count: solvedCount } = await supabase
            .from('puzzle_solutions')
            .select('*', { count: 'exact', head: true })
            .eq('puzzle_id', puzzle.id)
            .eq('is_correct', true);

          // Kullanıcının bu puzzle'ı çözüp çözmediğini kontrol et
          let userSolved = false;
          if (user) {
            const { data: userSolution } = await supabase
              .from('puzzle_solutions')
              .select('is_correct')
              .eq('user_id', user.id)
              .eq('puzzle_id', puzzle.id)
              .eq('is_correct', true)
              .single();

            userSolved = !!userSolution;
          }

          return {
            ...puzzle,
            solved_count: solvedCount || 0,
            user_solved: userSolved
          };
        })
      );

      setPuzzles(puzzlesWithStats);

      // Kullanıcı istatistiklerini getir
      if (user) {
        const { data: statsData } = await supabase
          .from('user_stats')
          .select('total_points, puzzles_solved, rank_position')
          .eq('id', user.id)
          .single();

        if (statsData) {
          setUserStats(statsData);
        }
      }

      // Toplam katılımcı sayısını getir
      const { count: participantCount } = await supabase
        .from('user_stats')
        .select('*', { count: 'exact', head: true })
        .gt('total_points', 0);

      setTotalParticipants(participantCount || 0);

    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzles();
  }, [user]);

  const difficulties = ["all", "Kolay", "Orta", "Zor", "Çok Zor"];
  const categories = [
    { id: "all", name: "Tümü" },
    { id: "klasik", name: "Klasik" },
    { id: "polialfabetik", name: "Polialfabetik" },
    { id: "transpozisyon", name: "Transpozisyon" },
    { id: "matris", name: "Matris" }
  ];

  const filteredPuzzles = puzzles.filter(puzzle => {
    const difficultyMatch = selectedDifficulty === "all" || puzzle.difficulty === selectedDifficulty;
    const categoryMatch = selectedCategory === "all" || puzzle.category === selectedCategory;
    return difficultyMatch && categoryMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Kolay": return "bg-green-100 text-green-800";
      case "Orta": return "bg-yellow-100 text-yellow-800";
      case "Zor": return "bg-orange-100 text-orange-800";
      case "Çok Zor": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-white">
          <Header currentPath="/yarisma" />
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38B6FF] mx-auto mb-4"></div>
              <p className="text-gray-600">Puzzle&apos;lar yükleniyor...</p>
            </div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/yarisma" />

        {/* Page Header */}
        <div className="bg-[#38B6FF] text-white py-16 px-4 md:px-8 relative">
          <div className="container mx-auto max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                🏆 Şifre Çözme Yarışmaları
              </h1>
              <p className="text-lg md:text-xl max-w-4xl text-white/90 mb-8">
                Kriptografi becerilerinizi test edin! Çeşitli zorluk seviyelerinde şifreli metinleri çözerek
                puanlar kazanın ve liderlik tablosunda yerinizi alın.
              </p>
              
              {/* İstatistikler */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{puzzles.length}</div>
                  <div className="text-sm text-white/80">Aktif Puzzle</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{totalParticipants}</div>
                  <div className="text-sm text-white/80">Katılımcı</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{userStats?.total_points || 0}</div>
                  <div className="text-sm text-white/80">Toplam Puan</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">#{userStats?.rank_position || '-'}</div>
                  <div className="text-sm text-white/80">Sıralamanız</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-12 px-4 md:px-8 flex-grow bg-gray-50">
          <div className="container mx-auto max-w-7xl">
            
            {/* Filtreler */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Zorluk Seviyesi</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>
                        {diff === "all" ? "Tüm Seviyeler" : diff}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Link href="/yarisma/liderlik" className="w-full">
                    <button className="w-full px-4 py-2 bg-[#38B6FF] text-white rounded-lg hover:bg-[#2ea3ef] transition-colors flex items-center justify-center">
                      <Trophy className="w-4 h-4 mr-2" />
                      Liderlik Tablosu
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Puzzle'lar */}
            {filteredPuzzles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Puzzle Bulunamadı</h3>
                <p className="text-gray-500">
                  {puzzles.length === 0 
                    ? "Henüz hiç puzzle eklenmemiş. Yakında harika puzzle'lar sizleri bekliyor!" 
                    : "Seçilen filtrelere uygun puzzle bulunmuyor."
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPuzzles.map((puzzle, index) => (
                  <motion.div
                    key={puzzle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-bold text-gray-800 mr-2">{puzzle.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(puzzle.difficulty)}`}>
                              {puzzle.difficulty}
                            </span>
                            {puzzle.user_solved && (
                              <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Çözüldü
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{puzzle.description}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                        <div className="text-xs text-gray-500 mb-1">Şifreli Metin:</div>
                        <div className="font-mono text-sm text-gray-800 break-all">{puzzle.cipher_text}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {puzzle.points} puan
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-1 text-green-500" />
                          {puzzle.solved_count} çözdü
                        </div>
                        <div className="flex items-center text-gray-600 col-span-2">
                          <Target className="w-4 h-4 mr-1 text-purple-500" />
                          {puzzle.algorithm}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {user ? (
                          <Link href={`/yarisma/${puzzle.id}`}>
                            <button className={`w-full px-4 py-2 rounded-lg transition-colors font-medium ${
                              puzzle.user_solved 
                                ? "bg-green-100 text-green-700 hover:bg-green-200" 
                                : "bg-[#38B6FF] text-white hover:bg-[#2ea3ef]"
                            }`}>
                              {puzzle.user_solved ? "Tekrar Çöz" : "Puzzle'ı Çöz"}
                            </button>
                          </Link>
                        ) : (
                          <Link href="/auth">
                            <button className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400 hover:text-gray-700 transition-colors font-medium">
                              Giriş Yapın
                            </button>
                          </Link>
                        )}
                        
                        <button
                          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                          onClick={() => alert(`İpucu: ${puzzle.hint}`)}
                        >
                          💡 İpucu Al
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
} 