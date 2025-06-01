"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  User, 
  Users, 
  MessageCircle, 
  Heart, 
  Star, 
  UserPlus, 
  UserMinus, 
  Crown,
  Shield,
  Zap,
  TrendingUp,
  Activity,
  Calendar,
  MapPin,
  Mail,
  Award,
  Database,
  Filter,
  Sparkles,
  UserCheck,
  Globe
} from 'lucide-react'
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
    if (total >= 50) return { 
      level: 'Çok Aktif', 
      color: 'text-emerald-700', 
      bg: 'bg-gradient-to-r from-emerald-100 to-green-100',
      icon: Crown
    }
    if (total >= 20) return { 
      level: 'Aktif', 
      color: 'text-blue-700', 
      bg: 'bg-gradient-to-r from-blue-100 to-cyan-100',
      icon: Shield
    }
    if (total >= 5) return { 
      level: 'Orta', 
      color: 'text-amber-700', 
      bg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
      icon: Star
    }
    return { 
      level: 'Yeni', 
      color: 'text-slate-600', 
      bg: 'bg-gradient-to-r from-slate-100 to-gray-100',
      icon: User
    }
  }

  const getBadgeGradient = (level: string) => {
    switch (level) {
      case 'Çok Aktif':
        return 'from-emerald-500 to-green-600'
      case 'Aktif':
        return 'from-blue-500 to-cyan-600'
      case 'Orta':
        return 'from-amber-500 to-yellow-600'
      default:
        return 'from-slate-500 to-gray-600'
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/uyeler" />

        {/* Enhanced Page Header */}
        <section className="bg-gradient-to-br from-[#38B6FF] via-[#0EA5E9] to-[#0284C7] py-20 px-4 md:px-8 relative overflow-hidden">
          {/* Dynamic Background Effects */}
          <div className="absolute inset-0 z-0">
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute top-16 left-16 w-40 h-40 bg-white/10 rounded-full blur-xl"
            />
            <motion.div 
              animate={{ 
                rotate: -360,
                scale: [1.2, 1, 1.2]
              }}
              transition={{ 
                duration: 25, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute bottom-20 right-20 w-56 h-56 bg-white/5 rounded-full blur-2xl"
            />
            
            {/* Floating Community Icons */}
            <motion.div
              animate={{ 
                y: [-25, 25, -25],
                rotate: [0, 360, 0]
              }}
              transition={{ 
                duration: 12, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-20 right-1/4 text-white/20"
            >
              <Users className="w-16 h-16" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [30, -30, 30],
                x: [-15, 15, -15]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute bottom-32 left-1/4 text-white/20"
            >
              <UserPlus className="w-12 h-12" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [-20, 20, -20],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-1/2 right-20 text-white/20"
            >
              <Heart className="w-10 h-10" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [25, -25, 25],
                rotate: [360, 180, 0]
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute bottom-28 right-1/3 text-white/20"
            >
              <Star className="w-11 h-11" />
            </motion.div>
          </div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Globe className="w-5 h-5 text-cyan-200 mr-3" />
                </motion.div>
                <span className="text-white text-sm font-medium">
                  {users.length} Aktif Kriptografi Meraklısı
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold mb-6"
              >
                <span className="block">Kriptik</span>
                <span className="block bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                  Topluluğu
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl max-w-4xl mx-auto text-white/95 mb-12 leading-relaxed"
              >
                Kriptografi tutkunları ile tanışın, <strong>bilgi paylaşın</strong> ve birlikte öğrenin. 
                Güçlü bir topluluk oluşturalım!
              </motion.p>

              {/* Enhanced Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {[
                  { 
                    value: users.length, 
                    label: "Toplam Üye", 
                    icon: Users,
                    color: "from-cyan-400 to-blue-600"
                  },
                  { 
                    value: users.filter(u => {
                      const total = u.comment_count + u.like_count + u.favorite_count
                      return total >= 20
                    }).length, 
                    label: "Aktif Üye", 
                    icon: Activity,
                    color: "from-green-400 to-emerald-600"
                  },
                  { 
                    value: users.reduce((sum, u) => sum + u.follower_count, 0), 
                    label: "Toplam Bağlantı", 
                    icon: TrendingUp,
                    color: "from-purple-400 to-pink-600"
                  },
                  { 
                    value: users.reduce((sum, u) => sum + u.comment_count + u.like_count, 0), 
                    label: "Toplam Etkileşim", 
                    icon: Zap,
                    color: "from-amber-400 to-orange-600"
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <motion.div 
                      initial={{ scale: 1 }}
                      whileInView={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="text-3xl font-bold mb-2"
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Search Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="max-w-md mx-auto"
              >
                <div className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="Üye ara... (kullanıcı adı, ad soyad)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/15 transition-all duration-300"
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: searchTerm ? 1 : 0 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <button
                        onClick={() => setSearchTerm('')}
                        className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <span className="text-white text-sm">✕</span>
                      </button>
                    </motion.div>
                  </motion.div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Controls */}
        <section className="py-8 px-4 md:px-8 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Enhanced Stats */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                  <Database className="w-4 h-4 text-[#38B6FF]" />
                  <span className="text-sm text-gray-600">
                    <span className="font-bold text-[#38B6FF]">{filteredUsers.length}</span> üye bulundu
                  </span>
                </div>
                {searchTerm && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 bg-blue-100 rounded-lg px-3 py-2"
                  >
                    <Search className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">&quot;{searchTerm}&quot;</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Enhanced Sort Controls */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">Sırala:</span>
                </div>
                <motion.select
                  whileHover={{ scale: 1.02 }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'most_active' | 'alphabetical')}
                  className="px-4 py-3 border border-gray-300 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-[#38B6FF] transition-all duration-200"
                >
                  <option value="newest">🆕 En Yeni Üyeler</option>
                  <option value="oldest">👴 En Eski Üyeler</option>
                  <option value="most_active">⚡ En Aktif Üyeler</option>
                  <option value="alphabetical">🔤 Alfabetik Sıralama</option>
                </motion.select>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced Users Grid */}
        <section className="flex-grow py-12 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-[#38B6FF] border-t-transparent rounded-full mx-auto mb-6"
                />
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Topluluk Yükleniyor...</h3>
                  <p className="text-gray-500">Harika üyelerimizi getiriyoruz</p>
                </motion.div>
              </motion.div>
            ) : filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredUsers.map((userProfile, index) => {
                  const activityLevel = getUserActivityLevel(userProfile)
                  const isFollowing = followingMap.get(userProfile.id)
                  const isOwnProfile = user?.id === userProfile.id
                  const ActivityIcon = activityLevel.icon

                  return (
                    <motion.div
                      key={userProfile.id}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ 
                        y: -8, 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      className="group"
                    >
                      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative">
                        {/* Card Background Gradient */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 0.05 }}
                          className={`absolute inset-0 bg-gradient-to-br ${getBadgeGradient(activityLevel.level)}`}
                        />
                        
                        {/* Animated border */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#38B6FF]/20 via-transparent to-[#38B6FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Card Header */}
                        <div className="relative z-10 p-8 text-center">
                          {/* Enhanced Avatar */}
                          <div className="relative mx-auto mb-6">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.3 }}
                              className="relative"
                            >
                              {userProfile.avatar_url ? (
                                <img
                                  src={userProfile.avatar_url}
                                  alt={userProfile.username}
                                  className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                                  <User size={28} className="text-gray-600" />
                                </div>
                              )}
                              
                              {/* Glow effect */}
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#38B6FF]/30 to-cyan-400/30 blur opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10" />
                            </motion.div>
                            
                            {/* Enhanced Activity Badge */}
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring" }}
                              whileHover={{ scale: 1.1 }}
                              className={`absolute -bottom-2 -right-2 ${activityLevel.bg} rounded-full p-2 shadow-lg border-2 border-white`}
                            >
                              <ActivityIcon className={`w-4 h-4 ${activityLevel.color}`} />
                            </motion.div>
                          </div>

                          {/* Enhanced User Info */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#38B6FF] transition-colors">
                              {userProfile.full_name || userProfile.username}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3 flex items-center justify-center gap-1">
                              <Mail className="w-3 h-3" />
                              @{userProfile.username}
                            </p>
                          </motion.div>
                          
                          {/* Activity Level Badge */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${activityLevel.bg} ${activityLevel.color}`}
                          >
                            <ActivityIcon className="w-3 h-3" />
                            {activityLevel.level}
                          </motion.div>
                          
                          {userProfile.bio && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed"
                            >
                              {userProfile.bio}
                            </motion.p>
                          )}

                          {userProfile.location && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="text-xs text-gray-500 mb-4 flex items-center justify-center gap-1"
                            >
                              <MapPin className="w-3 h-3" />
                              {userProfile.location}
                            </motion.p>
                          )}

                          {/* Enhanced Action Button */}
                          {!isOwnProfile && user && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleFollow(userProfile.id)}
                              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium shadow-md ${
                                isFollowing
                                  ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                                  : 'bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] text-white hover:from-[#0EA5E9] hover:to-[#0284C7] shadow-blue-200'
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
                            </motion.button>
                          )}

                          {isOwnProfile && (
                            <Link href="/profil">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-xl hover:from-emerald-200 hover:to-green-200 transition-all duration-300 font-medium shadow-md"
                              >
                                <UserCheck size={16} />
                                Profilim
                              </motion.div>
                            </Link>
                          )}

                          {!user && (
                            <Link href="/auth">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-xl hover:from-amber-200 hover:to-yellow-200 transition-all duration-300 font-medium shadow-md"
                              >
                                <User size={16} />
                                Giriş Yapın
                              </motion.div>
                            </Link>
                          )}
                        </div>

                        {/* Enhanced Stats */}
                        <div className="relative z-10 px-8 pb-6">
                          <div className="grid grid-cols-4 gap-3 text-center">
                            {[
                              { icon: MessageCircle, value: userProfile.comment_count, label: 'Yorum', color: 'text-blue-500' },
                              { icon: Heart, value: userProfile.like_count, label: 'Beğeni', color: 'text-red-500' },
                              { icon: Star, value: userProfile.favorite_count, label: 'Favori', color: 'text-yellow-500' },
                              { icon: Users, value: userProfile.follower_count, label: 'Takipçi', color: 'text-green-500' }
                            ].map((stat, statIndex) => (
                              <motion.div
                                key={statIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + statIndex * 0.1 }}
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all duration-200 group/stat"
                              >
                                <div className="flex items-center justify-center mb-2">
                                  <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    <stat.icon size={16} className={`${stat.color} group-hover/stat:scale-110 transition-transform`} />
                                  </motion.div>
                                </div>
                                <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                                <div className="text-xs text-gray-500">{stat.label}</div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Join Date */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-6 pt-4 border-t border-gray-100 text-center"
                          >
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {formatDate(userProfile.created_at)} tarihinde katıldı
                            </div>
                          </motion.div>
                        </div>

                        {/* Shine effect */}
                        <motion.div
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6"
                >
                  <Users className="w-12 h-12 text-gray-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-600 mb-3">
                  {searchTerm ? 'Aradığınız kriterlere uygun üye bulunamadı' : 'Henüz üye bulunmuyor'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? 'Farklı arama terimleri deneyin' : 'İlk üye olmak için kayıt olun!'}
                </p>
                {searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] text-white rounded-xl hover:from-[#0EA5E9] hover:to-[#0284C7] transition-all duration-300 font-medium shadow-lg"
                  >
                    <Search className="w-4 h-4" />
                    Aramayı Temizle
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* Enhanced CTA Section */}
        {!user && (
          <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute top-10 right-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"
              />
              <motion.div 
                animate={{ 
                  scale: [1.1, 1, 1.1],
                  rotate: [360, 180, 0]
                }}
                transition={{ 
                  duration: 25, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-200/20 rounded-full blur-2xl"
              />
            </div>
            
            <div className="container mx-auto max-w-4xl text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <motion.div
                  animate={{ 
                    y: [-5, 5, -5]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#38B6FF] to-[#0EA5E9] mb-8 shadow-xl"
                >
                  <UserPlus className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Kriptik Topluluğuna <span className="text-[#38B6FF]">Katılın!</span>
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                  Diğer kriptografi meraklılarıyla bağlantı kurun, bilgilerinizi paylaşın ve birlikte öğrenin.
                  <strong> Hesap oluşturmak sadece birkaç dakika sürer.</strong>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/auth">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] text-white rounded-xl hover:from-[#0EA5E9] hover:to-[#0284C7] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <UserPlus size={20} className="mr-2" />
                      Hemen Kayıt Ol
                    </motion.div>
                  </Link>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4 text-sm text-gray-500"
                  >
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span>Ücretsiz</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-blue-500" />
                      <span>Hızlı Kayıt</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </PageTransition>
  )
} 