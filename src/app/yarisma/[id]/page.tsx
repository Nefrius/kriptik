"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import PageTransition from "@/components/ui/page-transition";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Star, Users, Target, ArrowLeft, Lightbulb, CheckCircle } from "lucide-react";

interface Puzzle {
  id: number;
  title: string;
  description: string;
  cipher_text: string;
  solution: string;
  algorithm: string;
  difficulty: "Kolay" | "Orta" | "Zor" | "Çok Zor";
  points: number;
  hint: string;
  category: string;
  explanation: string;
}

interface SimplePuzzle {
  id: number;
  title: string;
  difficulty: "Kolay" | "Orta" | "Zor" | "Çok Zor";
  points: number;
}

interface PuzzleSolution {
  id: string;
  user_id: string;
  puzzle_id: number;
  solution_text: string;
  is_correct: boolean;
  points_earned: number;
  attempts: number;
  solved_at: string;
}

export default function PuzzlePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [userSolution, setUserSolution] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [userPuzzleSolution, setUserPuzzleSolution] = useState<PuzzleSolution | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allPuzzles, setAllPuzzles] = useState<SimplePuzzle[]>([]);

  // Puzzle verilerini getir
  const fetchPuzzleData = async () => {
    try {
      setLoading(true);
      const puzzleId = parseInt(params.id as string);
      
      // Puzzle bilgisini getir
      const { data: puzzleData, error: puzzleError } = await supabase
        .from('puzzles')
        .select('*')
        .eq('id', puzzleId)
        .eq('is_active', true)
        .single();

      if (puzzleError || !puzzleData) {
        console.error('Puzzle bulunamadı:', puzzleError);
        return;
      }

      setPuzzle(puzzleData);

      // Kullanıcının bu puzzle için çözümünü kontrol et
      if (user) {
        const { data: solutionData } = await supabase
          .from('puzzle_solutions')
          .select('*')
          .eq('user_id', user.id)
          .eq('puzzle_id', puzzleId)
          .single();

        if (solutionData) {
          setUserPuzzleSolution(solutionData);
          setAttempts(solutionData.attempts);
          if (solutionData.is_correct) {
            setUserSolution(solutionData.solution_text);
          }
        }
      }

      // Bu puzzle'ı çözen toplam kullanıcı sayısı
      const { count } = await supabase
        .from('puzzle_solutions')
        .select('*', { count: 'exact', head: true })
        .eq('puzzle_id', puzzleId)
        .eq('is_correct', true);

      setSolvedCount(count || 0);

      // Diğer puzzle'ları getir
      const { data: allPuzzlesData } = await supabase
        .from('puzzles')
        .select('id, title, difficulty, points')
        .eq('is_active', true)
        .neq('id', puzzleId)
        .limit(3);

      setAllPuzzles(allPuzzlesData || []);

    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }
    fetchPuzzleData();
  }, [user, params.id, router]);

  // Çözüm kontrolü ve kaydetme
  const checkSolution = useCallback(async () => {
    if (!puzzle || !user) return;
    
    const cleanUserSolution = userSolution.toUpperCase().replace(/[^ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ\s]/g, "").trim();
    const cleanCorrectSolution = puzzle.solution.toUpperCase().replace(/[^ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ\s]/g, "").trim();
    
    const isCorrect = cleanUserSolution === cleanCorrectSolution;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    try {
      // Çözümü kaydet veya güncelle
      const solutionData = {
        user_id: user.id,
        puzzle_id: puzzle.id,
        solution_text: userSolution,
        is_correct: isCorrect,
        points_earned: isCorrect ? puzzle.points : 0,
        attempts: newAttempts,
        solved_at: isCorrect ? new Date().toISOString() : null
      };

      if (userPuzzleSolution) {
        // Mevcut çözümü güncelle
        const { error } = await supabase
          .from('puzzle_solutions')
          .update(solutionData)
          .eq('id', userPuzzleSolution.id);

        if (error) throw error;
      } else {
        // Yeni çözüm kaydet
        const { data, error } = await supabase
          .from('puzzle_solutions')
          .insert(solutionData)
          .select()
          .single();

        if (error) throw error;
        if (data) setUserPuzzleSolution(data);
      }

      if (isCorrect) {
        // Kullanıcı istatistiklerini güncelle
        await updateUserStats();
        
        setTimeout(() => {
          alert(`🎉 Tebrikler! Puzzle&apos;ı çözdünüz!\n\nKazandığınız puan: ${puzzle.points}`);
        }, 500);
      } else {
        alert("❌ Yanlış cevap! Tekrar deneyin.");
      }
    } catch (error) {
      console.error('Çözüm kaydedilirken hata:', error);
      alert("Çözüm kaydedilirken bir hata oluştu.");
    }
  }, [userSolution, puzzle, user, attempts, userPuzzleSolution]);

  // Kullanıcı istatistiklerini güncelle
  const updateUserStats = async () => {
    if (!user) return;

    try {
      // Kullanıcının çözdüğü toplam puzzle sayısını hesapla
      const { count: solvedPuzzles } = await supabase
        .from('puzzle_solutions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_correct', true);

      // Kullanıcının toplam puanını hesapla
      const { data: totalPointsData } = await supabase
        .from('puzzle_solutions')
        .select('points_earned')
        .eq('user_id', user.id)
        .eq('is_correct', true);

      const totalPoints = totalPointsData?.reduce((sum, solution) => sum + solution.points_earned, 0) || 0;

      // User stats tablosunu güncelle
      await supabase
        .from('user_stats')
        .upsert({
          id: user.id,
          puzzles_solved: solvedPuzzles || 0,
          total_points: totalPoints,
          last_activity: new Date().toISOString()
        })
        .eq('id', user.id);

      // Sıralamaları güncelle
      await supabase.rpc('update_user_rankings');
    } catch (error) {
      console.error('Kullanıcı istatistikleri güncellenirken hata:', error);
    }
  };

  // Zorluk rengi
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Kolay": return "bg-green-100 text-green-800 border-green-200";
      case "Orta": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Zor": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Çok Zor": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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
              <p className="text-gray-600">Puzzle yükleniyor...</p>
            </div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (!puzzle) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-white">
          <Header currentPath="/yarisma" />
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-gray-400 mb-4">🔍</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Puzzle Bulunamadı</h1>
              <p className="text-gray-600 mb-6">Aradığınız puzzle mevcut değil.</p>
              <Link href="/yarisma">
                <button className="px-6 py-3 bg-[#38B6FF] text-white rounded-lg hover:bg-[#2ea3ef] transition-colors">
                  Yarışma Sayfasına Dön
                </button>
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (!user) {
    return <div>Yönlendiriliyor...</div>;
  }

  const isSolved = userPuzzleSolution?.is_correct || false;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/yarisma" />

        {/* Page Header */}
        <div className="bg-[#38B6FF] text-white py-12 px-4 md:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center mb-4">
              <Link href="/yarisma" className="text-white/80 hover:text-white transition-colors flex items-center mr-4">
                <ArrowLeft className="w-5 h-5 mr-1" />
                Yarışmalar
              </Link>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(puzzle.difficulty)}`}>
                {puzzle.difficulty}
              </span>
              {isSolved && (
                <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  ✓ Çözüldü
                </span>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {puzzle.title}
              </h1>
              <p className="text-lg text-white/90 mb-6">
                {puzzle.description}
              </p>
              
              {/* İstatistikler */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-300" />
                    <div>
                      <div className="text-lg font-bold">{puzzle.points}</div>
                      <div className="text-xs text-white/80">Puan</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-300" />
                    <div>
                      <div className="text-lg font-bold">{solvedCount}</div>
                      <div className="text-xs text-white/80">Çözen</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-300" />
                    <div>
                      <div className="text-lg font-bold">{attempts}</div>
                      <div className="text-xs text-white/80">Deneme</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-12 px-4 md:px-8 flex-grow bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Puzzle Çözme Alanı */}
              <div className="lg:col-span-2 space-y-6">
                {/* Şifreli Metin */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4">🔐 Şifreli Metin</h2>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="font-mono text-lg text-gray-800 break-all leading-relaxed">
                      {puzzle.cipher_text}
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    Algoritma: <span className="font-medium text-[#38B6FF]">{puzzle.algorithm}</span>
                  </div>
                </motion.div>

                {/* Çözüm Girişi */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4">✍️ Çözümünüz</h2>
                  <div className="space-y-4">
                    <textarea
                      value={userSolution}
                      onChange={(e) => setUserSolution(e.target.value)}
                      placeholder="Çözümünüzü buraya yazın..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent resize-none"
                      rows={3}
                      disabled={isSolved}
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={checkSolution}
                        disabled={!userSolution.trim() || isSolved}
                        className="flex-1 px-6 py-3 bg-[#38B6FF] text-white rounded-lg hover:bg-[#2ea3ef] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {isSolved ? (
                          <>
                            <CheckCircle className="w-5 h-5 inline mr-2" />
                            Çözüldü! 🎉
                          </>
                        ) : (
                          "Cevabı Kontrol Et"
                        )}
                      </button>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="px-6 py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors font-medium"
                      >
                        <Lightbulb className="w-5 h-5 inline mr-2" />
                        İpucu
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* İpucu */}
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">💡 İpucu</h3>
                    <p className="text-yellow-700">{puzzle.hint}</p>
                  </motion.div>
                )}

                {/* Açıklama (çözüldükten sonra) */}
                {isSolved && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-green-800 mb-2">🎓 Açıklama</h3>
                    <p className="text-green-700 mb-4">{puzzle.explanation}</p>
                    <Link href={`/algoritmalar/${puzzle.algorithm}`}>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Algoritma Hakkında Daha Fazla Bilgi
                      </button>
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Yan Panel */}
              <div className="space-y-6">
                {/* Durum */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Durum</h3>
                  <div className="space-y-4">
                    {isSolved ? (
                      <div className="text-center p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-green-800 font-semibold">Başarıyla Çözüldü!</div>
                        <div className="text-sm text-green-600 mt-1">
                          {userPuzzleSolution?.points_earned} puan kazanıldı
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-3 bg-blue-100 rounded-lg">
                        <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-blue-800 font-semibold">Çözmeye Hazır</div>
                        <div className="text-sm text-blue-600 mt-1">
                          {puzzle.points} puan kazanabilirsiniz
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-800">{attempts}</div>
                        <div className="text-xs text-gray-600">Deneme</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-800">{solvedCount}</div>
                        <div className="text-xs text-gray-600">Çözen</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Diğer Puzzle'lar */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🧩 Diğer Puzzle&apos;lar</h3>
                  <div className="space-y-3">
                    {allPuzzles.map((otherPuzzle) => (
                      <Link key={otherPuzzle.id} href={`/yarisma/${otherPuzzle.id}`}>
                        <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="font-medium text-gray-800 text-sm mb-1">{otherPuzzle.title}</div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{otherPuzzle.difficulty}</span>
                            <span>{otherPuzzle.points} puan</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/yarisma">
                    <button className="w-full mt-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Tüm Puzzle&apos;ları Gör
                    </button>
                  </Link>
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