-- =====================================================
-- KRIPTIK PROJESI - SUPABASE VERİTABANI ŞEMASI (FİNAL VERSİYON)
-- =====================================================

-- 1. PROFILES Tablosu (zaten var, güncellenecek)
-- Kullanıcı profil bilgileri için

CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  website text,
  created_at timestamptz DEFAULT NOW() NOT NULL,
  updated_at timestamptz DEFAULT NOW() NOT NULL
);

-- 2. USER_STATS Tablosu
-- Kullanıcı istatistikleri ve puanları için

CREATE TABLE IF NOT EXISTS user_stats (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  total_points integer DEFAULT 0 NOT NULL,
  puzzles_solved integer DEFAULT 0 NOT NULL,
  algorithms_learned integer DEFAULT 0 NOT NULL,
  current_streak integer DEFAULT 0 NOT NULL,
  max_streak integer DEFAULT 0 NOT NULL,
  rank_position integer DEFAULT 0 NOT NULL,
  level text DEFAULT 'Başlangıç' NOT NULL,
  last_activity timestamptz DEFAULT NOW(),
  created_at timestamptz DEFAULT NOW() NOT NULL,
  updated_at timestamptz DEFAULT NOW() NOT NULL
);

-- 3. PUZZLES Tablosu
-- Puzzle'ların bilgileri için

CREATE TABLE IF NOT EXISTS puzzles (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  cipher_text text NOT NULL,
  solution text NOT NULL,
  algorithm text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Kolay', 'Orta', 'Zor', 'Çok Zor')),
  category text NOT NULL,
  points integer NOT NULL DEFAULT 50,
  hint text,
  explanation text,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users ON DELETE SET NULL,
  created_at timestamptz DEFAULT NOW() NOT NULL,
  updated_at timestamptz DEFAULT NOW() NOT NULL
);

-- 4. PUZZLE_SOLUTIONS Tablosu
-- Kullanıcıların çözümlerini takip etmek için

CREATE TABLE IF NOT EXISTS puzzle_solutions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  puzzle_id integer REFERENCES puzzles ON DELETE CASCADE NOT NULL,
  solution_text text NOT NULL,
  is_correct boolean NOT NULL,
  points_earned integer DEFAULT 0,
  attempts integer DEFAULT 1,
  solved_at timestamptz DEFAULT NOW(),
  
  UNIQUE(user_id, puzzle_id)
);

-- 5. ACHIEVEMENTS Tablosu
-- Başarım tanımları için

CREATE TABLE IF NOT EXISTS achievements (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL CHECK (category IN ('algorithm', 'puzzle', 'streak', 'special')),
  max_progress integer DEFAULT 1,
  points_reward integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT NOW() NOT NULL
);

-- 6. USER_ACHIEVEMENTS Tablosu
-- Kullanıcıların kazandığı başarımlar için

CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  achievement_id integer REFERENCES achievements ON DELETE CASCADE NOT NULL,
  current_progress integer DEFAULT 0,
  is_unlocked boolean DEFAULT false,
  unlocked_at timestamptz,
  
  UNIQUE(user_id, achievement_id)
);

-- 7. ALGORITHM_PROGRESS Tablosu
-- Kullanıcıların algoritma öğrenme ilerlemesi için

CREATE TABLE IF NOT EXISTS algorithm_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  algorithm_name text NOT NULL,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  
  UNIQUE(user_id, algorithm_name)
);

-- =====================================================
-- MEVCUT YAPILARINI TEMİZLE (Tablolar oluştuktan sonra)
-- =====================================================

-- Mevcut trigger'ları ve fonksiyonları temizle
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_user_stats_updated_at ON user_stats;
DROP TRIGGER IF EXISTS update_puzzles_updated_at ON puzzles;
DROP TRIGGER IF EXISTS on_auth_user_created_user_stats ON profiles;

-- Mevcut fonksiyonları temizle
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS create_user_stats();
DROP FUNCTION IF EXISTS update_user_rankings();

-- Mevcut view'ları temizle
DROP VIEW IF EXISTS leaderboard;
DROP VIEW IF EXISTS user_achievements_view;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- =====================================================

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini görebilir" ON profiles;
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini güncelleyebilir" ON profiles;
DROP POLICY IF EXISTS "Herkes profilleri görebilir" ON profiles;
DROP POLICY IF EXISTS "Herkes istatistikleri görebilir" ON user_stats;
DROP POLICY IF EXISTS "Kullanıcılar kendi istatistiklerini güncelleyebilir" ON user_stats;
DROP POLICY IF EXISTS "Herkes aktif puzzle'ları görebilir" ON puzzles;
DROP POLICY IF EXISTS "Kullanıcılar kendi çözümlerini görebilir" ON puzzle_solutions;
DROP POLICY IF EXISTS "Kullanıcılar çözüm ekleyebilir" ON puzzle_solutions;
DROP POLICY IF EXISTS "Kullanıcılar kendi çözümlerini güncelleyebilir" ON puzzle_solutions;
DROP POLICY IF EXISTS "Herkes aktif başarımları görebilir" ON achievements;
DROP POLICY IF EXISTS "Herkes başarımları görebilir" ON user_achievements;
DROP POLICY IF EXISTS "Kullanıcılar kendi başarımlarını güncelleyebilir" ON user_achievements;
DROP POLICY IF EXISTS "Kullanıcılar kendi ilerlemelerini görebilir" ON algorithm_progress;
DROP POLICY IF EXISTS "Kullanıcılar ilerleme ekleyebilir" ON algorithm_progress;
DROP POLICY IF EXISTS "Kullanıcılar kendi ilerlemelerini güncelleyebilir" ON algorithm_progress;

-- PROFILES tablosu için RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi profillerini görebilir" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Herkes profilleri görebilir" ON profiles
  FOR SELECT USING (true);

-- USER_STATS tablosu için RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes istatistikleri görebilir" ON user_stats
  FOR SELECT USING (true);

CREATE POLICY "Kullanıcılar kendi istatistiklerini güncelleyebilir" ON user_stats
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Kullanıcılar kendi istatistiklerini upsert edebilir" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = id);

-- PUZZLES tablosu için RLS
ALTER TABLE puzzles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes aktif puzzle'ları görebilir" ON puzzles
  FOR SELECT USING (is_active = true);

-- PUZZLE_SOLUTIONS tablosu için RLS
ALTER TABLE puzzle_solutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi çözümlerini görebilir" ON puzzle_solutions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar çözüm ekleyebilir" ON puzzle_solutions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi çözümlerini güncelleyebilir" ON puzzle_solutions
  FOR UPDATE USING (auth.uid() = user_id);

-- ACHIEVEMENTS tablosu için RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes aktif başarımları görebilir" ON achievements
  FOR SELECT USING (is_active = true);

-- USER_ACHIEVEMENTS tablosu için RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes başarımları görebilir" ON user_achievements
  FOR SELECT USING (true);

CREATE POLICY "Kullanıcılar kendi başarımlarını güncelleyebilir" ON user_achievements
  FOR UPDATE USING (auth.uid() = user_id);

-- ALGORITHM_PROGRESS tablosu için RLS
ALTER TABLE algorithm_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi ilerlemelerini görebilir" ON algorithm_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar ilerleme ekleyebilir" ON algorithm_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi ilerlemelerini güncelleyebilir" ON algorithm_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- TETİKLEYİCİLER VE FONKSİYONLAR
-- =====================================================

-- updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Tüm tablolar için updated_at tetikleyicileri
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_puzzles_updated_at BEFORE UPDATE ON puzzles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Yeni kullanıcı kaydolduğunda user_stats oluştur
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (id, total_points, puzzles_solved, algorithms_learned, current_streak, max_streak, rank_position, level)
  VALUES (NEW.id, 0, 0, 0, 0, 0, 0, 'Başlangıç')
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created_user_stats
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_stats();

-- Sıralamayı güncelleyen fonksiyon
CREATE OR REPLACE FUNCTION update_user_rankings()
RETURNS void AS $$
BEGIN
  WITH ranked_users AS (
    SELECT 
      id,
      total_points,
      ROW_NUMBER() OVER (ORDER BY total_points DESC, puzzles_solved DESC, updated_at ASC) as new_rank
    FROM user_stats
  )
  UPDATE user_stats 
  SET rank_position = ranked_users.new_rank
  FROM ranked_users 
  WHERE user_stats.id = ranked_users.id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ÖRNEK VERİLER
-- =====================================================

-- Mevcut örnek verileri temizle (sadece örnek veriler)
DO $$
BEGIN
  -- Sadece örnek puzzle'ları sil (created_by NULL olanlar)
  DELETE FROM puzzle_solutions WHERE puzzle_id IN (SELECT id FROM puzzles WHERE created_by IS NULL);
  DELETE FROM puzzles WHERE created_by IS NULL;
  
  -- Sadece örnek başarımları sil
  DELETE FROM user_achievements WHERE achievement_id IN (SELECT id FROM achievements WHERE id <= 6);
  DELETE FROM achievements WHERE id <= 6;
END $$;

-- Puzzle'lar için örnek veriler
INSERT INTO puzzles (title, description, cipher_text, solution, algorithm, difficulty, category, points, hint, explanation) VALUES
('Caesar''ın Gizli Mesajı', 'Julius Caesar''ın bir generale gönderdiği şifreli mesajı çözün.', 'PHUOQP DTKDG GQPQT', 'MERHABA DÜNYA', 'caesar', 'Kolay', 'klasik', 50, 'Roma İmparatoru''nun favori sayısını deneyin... (İpucu: 3)', 'Bu puzzle Caesar şifresi kullanıyor. Her harf alfabede 3 pozisyon ileriye kaydırılmış.'),
('Vigenère''nin Şarkısı', 'Ünlü bir şarkı sözünden alınan bu şifreli metni çözün.', 'XÖÇKÜ ĞCÖAN TNIZQ WMRLA', 'MERHABA DÜNYA', 'vigenere', 'Orta', 'polialfabetik', 100, 'Anahtar kelime bir müzik terimi olabilir...', 'Bu puzzle Vigenère şifresi kullanıyor. MÜZIK anahtar kelimesi ile şifrelenmiş.'),
('Playfair Matrisi', 'Bir casusluk operasyonundan kalan şifreli koordinatlar.', 'RKME ÜŞÇD NOFR WLTG', 'MERHABA DÜNYA', 'playfair', 'Zor', 'matris', 200, 'Matris anahtarı bir şehir adı olabilir...', 'Bu puzzle Playfair şifresi kullanıyor. 5x5 matris ANKARA anahtar kelimesi ile oluşturulmuş.'),
('Beaufort''un Deniz Sırrı', 'Eski bir denizci günlüğünden çıkan gizemli mesaj.', 'ÜÇGĞO BDRNT KIŞMR VQELZ', 'MERHABA DÜNYA', 'beaufort', 'Orta', 'polialfabetik', 150, 'Denizcilikle ilgili bir terim düşünün...', 'Bu puzzle Beaufort şifresi kullanıyor. KAPTAN anahtar kelimesi ile şifrelenmiş.'),
('Rail Fence Treni', 'Bir tren yolculuğu sırasında gizlenen mesaj.', 'MRAA EHBÜ AYNY DL', 'MERHABA DÜNYA', 'railfence', 'Kolay', 'transpozisyon', 75, 'Tren raylarını düşünün, kaç seviye olabilir?', 'Bu puzzle Rail Fence şifresi kullanıyor. Metin 3 seviyeli zigzag deseninde yazılmış.');

-- Başarımlar için örnek veriler
INSERT INTO achievements (title, description, icon, category, max_progress, points_reward) VALUES
('İlk Şifre', 'İlk algoritmanızı öğrendiniz', '🔓', 'algorithm', 1, 50),
('Şifre Ustası', '5 farklı algoritma öğrenin', '🎯', 'algorithm', 5, 200),
('Puzzle Çözücü', 'İlk puzzle''ınızı çözün', '🧩', 'puzzle', 1, 100),
('Süreklilik Ustası', '7 gün üst üste çalışın', '🔥', 'streak', 7, 300),
('Antik Bilgelik', 'Tüm klasik şifreleri öğrenin', '🏛️', 'special', 6, 500),
('Modern Kriptograf', 'Modern şifreleme algoritmalarını tamamlayın', '💻', 'special', 4, 600);

-- =====================================================
-- GÖRÜNÜMLER (VIEWS)
-- =====================================================

-- Liderlik tablosu için görünüm
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  us.total_points,
  us.puzzles_solved,
  us.algorithms_learned,
  us.current_streak,
  us.max_streak,
  us.rank_position,
  us.level,
  us.last_activity,
  p.created_at as joined_at,
  CASE 
    WHEN us.last_activity > NOW() - INTERVAL '1 hour' THEN 'Çevrimiçi'
    WHEN us.last_activity > NOW() - INTERVAL '1 day' THEN '1 gün önce'
    WHEN us.last_activity > NOW() - INTERVAL '1 week' THEN '1 hafta önce'
    ELSE 'Uzun süre önce'
  END as last_active_text,
  (
    SELECT COUNT(*)
    FROM user_achievements ua
    WHERE ua.user_id = p.id AND ua.is_unlocked = true
  ) as achievement_count
FROM profiles p
JOIN user_stats us ON p.id = us.id
ORDER BY us.rank_position ASC;

-- Kullanıcı başarımları için görünüm
CREATE OR REPLACE VIEW user_achievements_view AS
SELECT 
  ua.user_id,
  ua.achievement_id,
  ua.current_progress,
  ua.is_unlocked,
  ua.unlocked_at,
  a.title,
  a.description,
  a.icon,
  a.category,
  a.max_progress,
  a.points_reward
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.id
WHERE a.is_active = true;

-- =====================================================
-- İNDEKSLER
-- =====================================================

-- Performans için indeksler
CREATE INDEX IF NOT EXISTS idx_user_stats_rank ON user_stats(rank_position);
CREATE INDEX IF NOT EXISTS idx_user_stats_points ON user_stats(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_puzzle_solutions_user ON puzzle_solutions(user_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_solutions_puzzle ON puzzle_solutions(puzzle_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- =====================================================
-- VERİ GÜNCELLEMELERİ
-- =====================================================

-- Sıralamaları güncelle
SELECT update_user_rankings(); 