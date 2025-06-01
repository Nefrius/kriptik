"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Trophy, Star, Target, ArrowLeft, Medal, Crown, Award, Users, TrendingUp } from "lucide-react";

interface LeaderboardUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  total_points: number;
  puzzles_solved: number;
  algorithms_learned: number;
  current_streak: number;
  max_streak: number;
  rank_position: number;
  level: string;
  last_activity: string;
  joined_at: string;
  last_active_text: string;
  achievement_count: number;
}

interface LeaderboardStats {
  totalUsers: number;
  totalPoints: number;
  totalPuzzlesSolved: number;
  userRank: number;
}

export default function LiderlikPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    totalUsers: 0,
    totalPoints: 0,
    totalPuzzlesSolved: 0,
    userRank: 0
  });
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<"overall" | "puzzles" | "algorithms">("overall");
  const { user } = useAuth();

  // Liderlik tablosu verilerini getir
  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // Liderlik tablosu verilerini getir
      const { data: leaderboard, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select('*')
        .order('rank_position', { ascending: true })
        .limit(50);

      if (leaderboardError) {
        console.error('Liderlik verileri alınamadı:', leaderboardError);
        return;
      }

      setLeaderboardData(leaderboard || []);

      // İstatistikleri hesapla
      if (leaderboard && leaderboard.length > 0) {
        const totalUsers = leaderboard.length;
        const totalPoints = leaderboard.reduce((sum, user) => sum + user.total_points, 0);
        const totalPuzzlesSolved = leaderboard.reduce((sum, user) => sum + user.puzzles_solved, 0);
        
        // Kullanıcının sıralamasını bul
        const currentUser = leaderboard.find(u => u.id === user?.id);
        const userRank = currentUser?.rank_position || 0;

        setStats({
          totalUsers,
          totalPoints,
          totalPuzzlesSolved,
          userRank
        });
      }
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [user]);

  // Kategori değişikliğinde sıralamayı güncelle
  const getSortedData = () => {
    if (!leaderboardData.length) return [];
    
    const sortedData = [...leaderboardData];
    
    switch (category) {
      case "puzzles":
        sortedData.sort((a, b) => b.puzzles_solved - a.puzzles_solved || b.total_points - a.total_points);
        break;
      case "algorithms":
        sortedData.sort((a, b) => b.algorithms_learned - a.algorithms_learned || b.total_points - a.total_points);
        break;
      default:
        sortedData.sort((a, b) => a.rank_position - b.rank_position);
        break;
    }
    
    return sortedData;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-500" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (rank === 3) return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
    return "bg-white border border-gray-300 text-gray-700";
  };

  const sortedData = getSortedData();

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-white">
          <Header currentPath="/yarisma" />
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38B6FF] mx-auto mb-4"></div>
              <p className="text-gray-600">Liderlik tablosu yükleniyor...</p>
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
            <div className="flex items-center mb-4">
              <Link href="/yarisma" className="text-white/80 hover:text-white transition-colors flex items-center mr-4">
                <ArrowLeft className="w-5 h-5 mr-1" />
                Yarışmalar
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                🏆 Liderlik Tablosu
              </h1>
              <p className="text-lg md:text-xl max-w-4xl text-white/90 mb-8">
                En başarılı kriptografi meraklılarını keşfedin. Puanlar, çözülen puzzle&apos;lar ve başarımlar ile 
                sıralanmış en iyi kullanıcıların listesi.
              </p>
              
              {/* İstatistikler */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 mr-3 text-blue-300" />
                    <div>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      <div className="text-sm text-white/80">Aktif Kullanıcı</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center">
                    <Trophy className="w-6 h-6 mr-3 text-yellow-300" />
                    <div>
                      <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>
                      <div className="text-sm text-white/80">Toplam Puan</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center">
                    <Target className="w-6 h-6 mr-3 text-green-300" />
                    <div>
                      <div className="text-2xl font-bold">{stats.totalPuzzlesSolved}</div>
                      <div className="text-sm text-white/80">Çözülen Puzzle</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-purple-300" />
                    <div>
                      <div className="text-2xl font-bold">#{stats.userRank || '-'}</div>
                      <div className="text-sm text-white/80">Sıralamanız</div>
                    </div>
                  </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Sıralama Kategorisi</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as "overall" | "puzzles" | "algorithms")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                  >
                    <option value="overall">Genel Sıralama</option>
                    <option value="puzzles">Puzzle Başarısı</option>
                    <option value="algorithms">Algoritma Bilgisi</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <div className="w-full">
                    <div className="text-sm text-gray-600 mb-2">Toplam Kullanıcı</div>
                    <div className="px-3 py-2 bg-blue-50 text-[#38B6FF] rounded-lg font-medium text-center">
                      {stats.totalUsers} Kriptograf
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Veri yoksa uyarı */}
            {sortedData.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz Liderlik Verileri Yok</h3>
                <p className="text-gray-600">
                  İlk puzzle&apos;ları çözerek liderlik tablosunda yerinizi alın!
                </p>
                <Link href="/yarisma">
                  <button className="mt-4 px-6 py-3 bg-[#38B6FF] text-white rounded-lg hover:bg-[#2ea3ef] transition-colors">
                    Puzzle&apos;ları Keşfet
                  </button>
                </Link>
              </div>
            ) : (
              <>
                {/* Top 3 Spotlight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {sortedData.slice(0, 3).map((leaderboardUser, index) => {
                    const actualRank = category === "overall" ? leaderboardUser.rank_position : index + 1;
                    return (
                      <motion.div
                        key={leaderboardUser.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`relative overflow-hidden rounded-xl p-6 text-center ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                          'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                        }`}
                      >
                        <div className="relative z-10">
                          <div className="mb-4">
                            {getRankIcon(actualRank)}
                          </div>
                          
                          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                            {leaderboardUser.avatar_url ? (
                              <img 
                                src={leaderboardUser.avatar_url} 
                                alt={leaderboardUser.username}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl font-bold">
                                {leaderboardUser.username[0]?.toUpperCase() || '?'}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-bold mb-1">{leaderboardUser.username}</h3>
                          <p className="text-sm opacity-90 mb-3">{leaderboardUser.full_name || 'Kriptografi Meraklısı'}</p>
                          
                          <div className="space-y-2">
                            <div>
                              <div className="text-2xl font-bold">{leaderboardUser.total_points.toLocaleString()}</div>
                              <div className="text-xs opacity-80">Toplam Puan</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <div className="font-semibold">{leaderboardUser.puzzles_solved}</div>
                                <div className="opacity-80">Puzzle</div>
                              </div>
                              <div>
                                <div className="font-semibold">{leaderboardUser.current_streak}</div>
                                <div className="opacity-80">Seri</div>
                              </div>
                            </div>
                          </div>
                          
                          {leaderboardUser.achievement_count > 0 && (
                            <div className="mt-4">
                              <div className="text-xs opacity-80 mb-1">Başarımlar</div>
                              <div className="text-sm bg-white/20 px-2 py-1 rounded">
                                🏆 {leaderboardUser.achievement_count} Başarım
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Decorative background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Full Leaderboard */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Tam Sıralama</h2>
                    <p className="text-gray-600">Tüm kullanıcıların detaylı sıralaması</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Sıra</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Kullanıcı</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Seviye</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Puan</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Puzzle</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Algoritma</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Seri</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Son Aktivite</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sortedData.map((leaderboardUser, index) => {
                          const actualRank = category === "overall" ? leaderboardUser.rank_position : index + 1;
                          return (
                            <motion.tr
                              key={leaderboardUser.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className={`hover:bg-gray-50 transition-colors ${
                                leaderboardUser.id === user?.id ? 'bg-blue-50' : ''
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankBadge(actualRank)}`}>
                                  {actualRank <= 3 ? getRankIcon(actualRank) : actualRank}
                                </div>
                              </td>
                              
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-[#38B6FF] rounded-full flex items-center justify-center text-white font-bold mr-3">
                                    {leaderboardUser.avatar_url ? (
                                      <img 
                                        src={leaderboardUser.avatar_url} 
                                        alt={leaderboardUser.username}
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    ) : (
                                      leaderboardUser.username[0]?.toUpperCase() || '?'
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{leaderboardUser.username}</div>
                                    <div className="text-sm text-gray-500">{leaderboardUser.full_name || 'Kriptografi Meraklısı'}</div>
                                  </div>
                                </div>
                              </td>
                              
                              <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {leaderboardUser.level}
                                </span>
                              </td>
                              
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="font-semibold">{leaderboardUser.total_points.toLocaleString()}</span>
                                </div>
                              </td>
                              
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center">
                                  <Target className="w-4 h-4 text-green-500 mr-1" />
                                  <span className="font-semibold">{leaderboardUser.puzzles_solved}</span>
                                </div>
                              </td>
                              
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center">
                                  <Award className="w-4 h-4 text-purple-500 mr-1" />
                                  <span className="font-semibold">{leaderboardUser.algorithms_learned}</span>
                                </div>
                              </td>
                              
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center">
                                  <Trophy className="w-4 h-4 text-orange-500 mr-1" />
                                  <span className="font-semibold">{leaderboardUser.current_streak}</span>
                                </div>
                              </td>
                              
                              <td className="px-6 py-4 text-center text-sm text-gray-500">
                                {leaderboardUser.last_active_text}
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Toplam {sortedData.length} kullanıcı gösteriliyor
                      </div>
                      <Link href="/yarisma">
                        <button className="px-4 py-2 bg-[#38B6FF] text-white rounded-lg hover:bg-[#2ea3ef] transition-colors text-sm">
                          Puzzle&apos;lara Geri Dön
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
} 