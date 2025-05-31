"use client";

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, MapPin, Globe, Calendar, Heart, MessageCircle, Star, Users, TrendingUp, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, Comment, Favorite, UserStats } from '@/lib/supabase'
import PageTransition from '@/components/ui/page-transition'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import { useRouter } from 'next/navigation'

interface RecentActivity {
  type: 'comment' | 'like' | 'favorite'
  algorithm_id: string
  algorithm_name: string
  created_at: string
  content?: string
}

export default function ProfilPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [recentComments, setRecentComments] = useState<Comment[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const algorithmNames: { [key: string]: string } = {
    caesar: 'Caesar Şifresi',
    substitution: 'Yerine Koyma Şifresi',
    atbash: 'Atbaş Şifresi',
    aes: 'AES',
    playfair: 'Playfair Şifresi',
    vigenere: 'Vigenère Şifresi',
    beaufort: 'Beaufort Şifresi',
    railfence: 'Rail Fence Şifresi',
    columnar: 'Sütunsal Transpozisyon',
    rsa: 'RSA'
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    if (!user) return

    try {
      setIsLoading(true)

      // Kullanıcı istatistiklerini getir
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', user.id)
        .single()

      if (statsData) {
        setUserStats(statsData)
      }

      // Son yorumları getir
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (commentsData) {
        setRecentComments(commentsData)
      }

      // Favorileri getir
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (favoritesData) {
        setFavorites(favoritesData)
      }

      // Son aktiviteleri getir ve birleştir
      const activities: RecentActivity[] = []

      // Son yorumları ekle
      if (commentsData) {
        commentsData.slice(0, 3).forEach(comment => {
          activities.push({
            type: 'comment',
            algorithm_id: comment.algorithm_id,
            algorithm_name: algorithmNames[comment.algorithm_id] || comment.algorithm_id,
            created_at: comment.created_at,
            content: comment.content
          })
        })
      }

      // Son favorileri ekle
      if (favoritesData) {
        favoritesData.slice(0, 3).forEach(favorite => {
          activities.push({
            type: 'favorite',
            algorithm_id: favorite.algorithm_id,
            algorithm_name: algorithmNames[favorite.algorithm_id] || favorite.algorithm_id,
            created_at: favorite.created_at
          })
        })
      }

      // Tarihe göre sırala
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setRecentActivity(activities.slice(0, 10))

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Az önce'
    if (diffInHours < 24) return `${diffInHours} saat önce`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} gün önce`
    return formatDate(dateString)
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38B6FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Profil yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/profil" />

        {/* Profile Header */}
        <section className="bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] py-16 px-4 md:px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-8"
            >
              {/* Avatar */}
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <User size={48} className="text-white" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.full_name || profile.username}</h1>
                <p className="text-xl text-white/90 mb-2">@{profile.username}</p>
                
                {profile.bio && (
                  <p className="text-white/80 mb-4 max-w-2xl">{profile.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-white/80">
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {profile.location}
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center">
                      <Globe size={16} className="mr-1" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        Website
                      </a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {formatDate(profile.created_at)} tarihinde katıldı
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 px-4 md:px-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm"
              >
                <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{userStats?.comment_count || 0}</div>
                <div className="text-sm text-gray-600">Yorum</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm"
              >
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{userStats?.like_count || 0}</div>
                <div className="text-sm text-gray-600">Beğeni</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm"
              >
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{userStats?.favorite_count || 0}</div>
                <div className="text-sm text-gray-600">Favori</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm"
              >
                <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{userStats?.follower_count || 0}</div>
                <div className="text-sm text-gray-600">Takipçi</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4 md:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center mb-6">
                    <TrendingUp className="w-6 h-6 text-[#38B6FF] mr-2" />
                    <h2 className="text-xl font-bold text-gray-800">Son Aktiviteler</h2>
                  </div>

                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            {activity.type === 'comment' && <MessageCircle size={16} className="text-blue-500" />}
                            {activity.type === 'like' && <Heart size={16} className="text-red-500" />}
                            {activity.type === 'favorite' && <Star size={16} className="text-yellow-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800">
                              {activity.type === 'comment' && `${activity.algorithm_name} algoritmasına yorum yaptınız`}
                              {activity.type === 'like' && `${activity.algorithm_name} algoritmasını beğendiniz`}
                              {activity.type === 'favorite' && `${activity.algorithm_name} algoritmasını favorilere eklediniz`}
                            </p>
                            {activity.content && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">&quot;{activity.content}&quot;</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <Clock size={12} className="mr-1" />
                              {getRelativeTime(activity.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Henüz aktivite bulunmuyor.</p>
                      <p className="text-sm text-gray-400 mt-1">Algoritmalara yorum yapın, beğenin veya favorilere ekleyin!</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Favorite Algorithms */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Favori Algoritmalar</h3>
                  </div>

                  {favorites.length > 0 ? (
                    <div className="space-y-3">
                      {favorites.slice(0, 5).map((favorite) => (
                        <div key={favorite.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-800">
                            {algorithmNames[favorite.algorithm_id] || favorite.algorithm_id}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getRelativeTime(favorite.created_at)}
                          </span>
                        </div>
                      ))}
                      {favorites.length > 5 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{favorites.length - 5} tane daha...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Star size={32} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Henüz favori algoritma yok</p>
                    </div>
                  )}
                </motion.div>

                {/* Recent Comments */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    <MessageCircle className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Son Yorumlar</h3>
                  </div>

                  {recentComments.length > 0 ? (
                    <div className="space-y-3">
                      {recentComments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{comment.content}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{algorithmNames[comment.algorithm_id] || comment.algorithm_id}</span>
                            <span>{getRelativeTime(comment.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <MessageCircle size={32} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Henüz yorum yapılmamış</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  )
} 