"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, User, Users, MessageCircle, Heart, Star, UserPlus, UserMinus, SortAsc } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, UserStats } from '@/lib/supabase'
import PageTransition from '@/components/ui/page-transition'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import Link from 'next/link'

interface UserProfile extends UserStats {
  bio?: string
  location?: string
  created_at: string
  isFollowing?: boolean
}

export default function UyelerPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most_active' | 'alphabetical'>('newest')
  const [followingMap, setFollowingMap] = useState<Map<string, boolean>>(new Map())

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (user) {
      fetchFollowingStatus()
    }
  }, [user, users])

  useEffect(() => {
    filterAndSortUsers()
  }, [users, searchTerm, sortBy, followingMap])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Kullanıcı istatistikleri ile beraber profilleri getir
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          avatar_url,
          bio,
          location,
          created_at
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Her kullanıcı için istatistikleri getir
      const usersWithStats = await Promise.all(
        (data || []).map(async (profile) => {
          const { data: statsData } = await supabase
            .from('user_stats')
            .select('*')
            .eq('id', profile.id)
            .single()

          return {
            ...profile,
            comment_count: statsData?.comment_count || 0,
            like_count: statsData?.like_count || 0,
            favorite_count: statsData?.favorite_count || 0,
            follower_count: statsData?.follower_count || 0,
            following_count: statsData?.following_count || 0
          }
        })
      )

      setUsers(usersWithStats)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFollowingStatus = async () => {
    if (!user || users.length === 0) return

    try {
      const { data } = await supabase
        .from('user_followers')
        .select('following_id')
        .eq('follower_id', user.id)

      const followingSet = new Map<string, boolean>()
      data?.forEach(follow => {
        followingSet.set(follow.following_id, true)
      })
      setFollowingMap(followingSet)
    } catch (error) {
      console.error('Error fetching following status:', error)
    }
  }

  const filterAndSortUsers = () => {
    let filtered = users

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'most_active':
          const aActivity = a.comment_count + a.like_count + a.favorite_count
          const bActivity = b.comment_count + b.like_count + b.favorite_count
          return bActivity - aActivity
        case 'alphabetical':
          return a.username.localeCompare(b.username, 'tr')
        default:
          return 0
      }
    })

    setFilteredUsers(filtered)
  }

  const toggleFollow = async (targetUserId: string) => {
    if (!user) {
      alert('Takip etmek için giriş yapmanız gerekiyor.')
      return
    }

    try {
      const isCurrentlyFollowing = followingMap.get(targetUserId)

      if (isCurrentlyFollowing) {
        // Takibi bırak
        await supabase
          .from('user_followers')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId)
      } else {
        // Takip et
        await supabase
          .from('user_followers')
          .insert({
            follower_id: user.id,
            following_id: targetUserId
          })
      }

      // Lokal state'i güncelle
      const newFollowingMap = new Map(followingMap)
      newFollowingMap.set(targetUserId, !isCurrentlyFollowing)
      setFollowingMap(newFollowingMap)

      // Kullanıcı listesini yenile
      await fetchUsers()
    } catch (error) {
      console.error('Error toggling follow:', error)
      alert('Takip işlemi sırasında bir hata oluştu.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUserActivityLevel = (user: UserProfile) => {
    const total = user.comment_count + user.like_count + user.favorite_count
    if (total >= 50) return { level: 'Çok Aktif', color: 'text-green-600', bg: 'bg-green-100' }
    if (total >= 20) return { level: 'Aktif', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (total >= 5) return { level: 'Orta', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'Yeni', color: 'text-gray-600', bg: 'bg-gray-100' }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/uyeler" />

        {/* Page Header */}
        <section className="bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] py-16 px-4 md:px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-white"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Kriptik Topluluğu</h1>
              <p className="text-white/90 max-w-2xl mx-auto mb-8">
                Kriptografi meraklısı diğer üyelerle tanışın, profillerini inceleyin ve birlikte öğrenin.
              </p>

              {/* Search Bar */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type="text"
                    placeholder="Üye ara... (kullanıcı adı, ad soyad)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Controls */}
        <section className="py-6 px-4 md:px-8 bg-gray-50 border-b">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Stats */}
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredUsers.length}</span> üye bulundu
                {searchTerm && (
                  <span> &quot;{searchTerm}&quot; araması için</span>
                )}
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <SortAsc size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Sırala:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'most_active' | 'alphabetical')}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                >
                  <option value="newest">En Yeni Üyeler</option>
                  <option value="oldest">En Eski Üyeler</option>
                  <option value="most_active">En Aktif Üyeler</option>
                  <option value="alphabetical">Alfabetik Sıralama</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Users Grid */}
        <section className="flex-grow py-12 px-4 md:px-8">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38B6FF] mx-auto mb-4"></div>
                <p className="text-gray-600">Üyeler yükleniyor...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((userProfile, index) => {
                  const activityLevel = getUserActivityLevel(userProfile)
                  const isFollowing = followingMap.get(userProfile.id)
                  const isOwnProfile = user?.id === userProfile.id

                  return (
                    <motion.div
                      key={userProfile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Card Header */}
                      <div className="p-6 text-center">
                        {/* Avatar */}
                        <div className="relative mx-auto mb-4">
                          {userProfile.avatar_url ? (
                            <img
                              src={userProfile.avatar_url}
                              alt={userProfile.username}
                              className="w-16 h-16 rounded-full mx-auto"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                              <User size={24} className="text-gray-600" />
                            </div>
                          )}
                          
                          {/* Activity Badge */}
                          <div className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-medium ${activityLevel.bg} ${activityLevel.color}`}>
                            {activityLevel.level}
                          </div>
                        </div>

                        {/* User Info */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {userProfile.full_name || userProfile.username}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">@{userProfile.username}</p>
                        
                        {userProfile.bio && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{userProfile.bio}</p>
                        )}

                        {userProfile.location && (
                          <p className="text-xs text-gray-500 mb-3">📍 {userProfile.location}</p>
                        )}

                        {/* Follow Button */}
                        {!isOwnProfile && user && (
                          <button
                            onClick={() => toggleFollow(userProfile.id)}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                              isFollowing
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-[#38B6FF] text-white hover:bg-[#0098F7]'
                            }`}
                          >
                            {isFollowing ? (
                              <>
                                <UserMinus size={16} />
                                Takibi Bırak
                              </>
                            ) : (
                              <>
                                <UserPlus size={16} />
                                Takip Et
                              </>
                            )}
                          </button>
                        )}

                        {isOwnProfile && (
                          <Link
                            href="/profil"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <User size={16} />
                            Profilim
                          </Link>
                        )}

                        {!user && (
                          <Link
                            href="/auth"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Giriş Yapın
                          </Link>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-4 gap-3 text-center">
                          <div>
                            <div className="flex items-center justify-center mb-1">
                              <MessageCircle size={16} className="text-blue-500" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">{userProfile.comment_count}</div>
                            <div className="text-xs text-gray-500">Yorum</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center mb-1">
                              <Heart size={16} className="text-red-500" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">{userProfile.like_count}</div>
                            <div className="text-xs text-gray-500">Beğeni</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center mb-1">
                              <Star size={16} className="text-yellow-500" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">{userProfile.favorite_count}</div>
                            <div className="text-xs text-gray-500">Favori</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center mb-1">
                              <Users size={16} className="text-green-500" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">{userProfile.follower_count}</div>
                            <div className="text-xs text-gray-500">Takipçi</div>
                          </div>
                        </div>

                        {/* Join Date */}
                        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                          <p className="text-xs text-gray-500">
                            {formatDate(userProfile.created_at)} tarihinde katıldı
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchTerm ? 'Aradığınız kriterlere uygun üye bulunamadı' : 'Henüz üye bulunmuyor'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Farklı arama terimleri deneyin' : 'İlk üye olmak için kayıt olun!'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-4 py-2 bg-[#38B6FF] text-white rounded-lg hover:bg-[#0098F7] transition-colors"
                  >
                    Aramayı Temizle
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="container mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Kriptik Topluluğuna Katılın!
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Diğer kriptografi meraklılarıyla bağlantı kurun, bilgilerinizi paylaşın ve birlikte öğrenin.
                  Hesap oluşturmak sadece birkaç dakika sürer.
                </p>
                <Link
                  href="/auth"
                  className="inline-flex items-center px-6 py-3 bg-[#38B6FF] text-white rounded-lg hover:bg-[#0098F7] transition-colors font-medium"
                >
                  <UserPlus size={20} className="mr-2" />
                  Hemen Kayıt Ol
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </PageTransition>
  )
} 