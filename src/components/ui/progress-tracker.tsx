"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Clock, Target, Book, Award } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "algorithm" | "puzzle" | "streak" | "special";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface ProgressTrackerProps {
  userProgress: {
    totalAlgorithmsLearned: number;
    puzzlesSolved: number;
    currentStreak: number;
    totalPoints: number;
    rank: number;
    achievements: Achievement[];
  };
}

export default function ProgressTracker({ userProgress }: ProgressTrackerProps) {
  const achievements: Achievement[] = [
    {
      id: "first-cipher",
      title: "İlk Şifre",
      description: "İlk algoritmanızı öğrendiniz",
      icon: "🔓",
      category: "algorithm",
      progress: userProgress.totalAlgorithmsLearned,
      maxProgress: 1,
      unlocked: userProgress.totalAlgorithmsLearned >= 1,
      unlockedAt: "2024-01-15"
    },
    {
      id: "cipher-master",
      title: "Şifre Ustası",
      description: "5 farklı algoritma öğrenin",
      icon: "🎯",
      category: "algorithm",
      progress: userProgress.totalAlgorithmsLearned,
      maxProgress: 5,
      unlocked: userProgress.totalAlgorithmsLearned >= 5
    },
    {
      id: "puzzle-solver",
      title: "Puzzle Çözücü",
      description: "İlk puzzle'ınızı çözün",
      icon: "🧩",
      category: "puzzle",
      progress: userProgress.puzzlesSolved,
      maxProgress: 1,
      unlocked: userProgress.puzzlesSolved >= 1
    },
    {
      id: "streak-master",
      title: "Süreklilik Ustası",
      description: "7 gün üst üste çalışın",
      icon: "🔥",
      category: "streak",
      progress: userProgress.currentStreak,
      maxProgress: 7,
      unlocked: userProgress.currentStreak >= 7
    },
    {
      id: "ancient-wisdom",
      title: "Antik Bilgelik",
      description: "Tüm klasik şifreleri öğrenin",
      icon: "🏛️",
      category: "special",
      progress: 3, // Örnek veri
      maxProgress: 6,
      unlocked: false
    },
    {
      id: "modern-crypto",
      title: "Modern Kriptograf",
      description: "Modern şifreleme algoritmalarını tamamlayın",
      icon: "💻",
      category: "special",
      progress: 1, // Örnek veri
      maxProgress: 4,
      unlocked: false
    }
  ];

  const getCategoryColor = (category: Achievement["category"]) => {
    switch (category) {
      case "algorithm": return "bg-blue-500";
      case "puzzle": return "bg-green-500";
      case "streak": return "bg-orange-500";
      case "special": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryName = (category: Achievement["category"]) => {
    switch (category) {
      case "algorithm": return "Algoritma";
      case "puzzle": return "Puzzle";
      case "streak": return "Süreklilik";
      case "special": return "Özel";
      default: return "Diğer";
    }
  };

  const progressPercentage = (progress: number, max: number) => {
    return Math.min((progress / max) * 100, 100);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">İlerleme Takibi</h2>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            {userProgress.totalPoints} puan
          </div>
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-1 text-blue-500" />
            #{userProgress.rank} sırada
          </div>
        </div>
      </div>

      {/* Ana İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{userProgress.totalAlgorithmsLearned}</div>
              <div className="text-sm text-blue-600">Öğrenilen Algoritma</div>
            </div>
            <Book className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{userProgress.puzzlesSolved}</div>
              <div className="text-sm text-green-600">Çözülen Puzzle</div>
            </div>
            <Trophy className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{userProgress.currentStreak}</div>
              <div className="text-sm text-orange-600">Günlük Seri</div>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{achievements.filter(a => a.unlocked).length}</div>
              <div className="text-sm text-purple-600">Başarım</div>
            </div>
            <Award className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Başarımlar */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Başarımlar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`border rounded-lg p-4 transition-all duration-300 ${
                achievement.unlocked 
                  ? "bg-white border-gray-200 shadow-sm" 
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div 
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                      achievement.unlocked ? "bg-yellow-100" : "bg-gray-200"
                    }`}
                  >
                    {achievement.unlocked ? achievement.icon : "🔒"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-semibold ${achievement.unlocked ? "text-gray-800" : "text-gray-500"}`}>
                        {achievement.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)} text-white`}>
                        {getCategoryName(achievement.category)}
                      </span>
                    </div>
                    <p className={`text-sm mb-3 ${achievement.unlocked ? "text-gray-600" : "text-gray-400"}`}>
                      {achievement.description}
                    </p>
                    
                    {/* İlerleme Çubuğu */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                        <span>{Math.round(progressPercentage(achievement.progress, achievement.maxProgress))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            achievement.unlocked ? "bg-green-500" : "bg-gray-400"
                          }`}
                          style={{ width: `${progressPercentage(achievement.progress, achievement.maxProgress)}%` }}
                        />
                      </div>
                    </div>
                    
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="mt-2 text-xs text-green-600">
                        ✓ {new Date(achievement.unlockedAt).toLocaleDateString('tr-TR')} tarihinde kazanıldı
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Öneriler */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">📈 Öneriler</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          {userProgress.currentStreak < 7 && (
            <li>• Günlük seri için {7 - userProgress.currentStreak} gün daha çalışın</li>
          )}
          {userProgress.totalAlgorithmsLearned < 5 && (
            <li>• Şifre Ustası başarımı için {5 - userProgress.totalAlgorithmsLearned} algoritma daha öğrenin</li>
          )}
          {userProgress.puzzlesSolved === 0 && (
            <li>• İlk puzzle&apos;ınızı çözerek başarım kazanın</li>
          )}
        </ul>
      </div>
    </div>
  );
} 