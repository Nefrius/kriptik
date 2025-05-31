import { useState, useEffect } from 'react'
import { supabase, Comment, AlgorithmStats } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useAlgorithmInteractions(algorithmId: string) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [stats, setStats] = useState<AlgorithmStats | null>(null)
  const [userInteractions, setUserInteractions] = useState({
    hasLiked: false,
    hasFavorited: false
  })
  const [loading, setLoading] = useState(true)

  // Yorumları getir
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('algorithm_id', algorithmId)
        .is('parent_id', null) // Sadece ana yorumları getir
        .order('created_at', { ascending: false })

      if (error) throw error

      // Her yorum için cevapları getir
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(`
              *,
              profiles:user_id (
                id,
                username,
                full_name,
                avatar_url
              )
            `)
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true })

          return {
            ...comment,
            replies: replies || []
          }
        })
      )

      setComments(commentsWithReplies)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  // İstatistikleri getir
  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('algorithm_stats')
        .select('*')
        .eq('algorithm_id', algorithmId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      setStats(data || {
        algorithm_id: algorithmId,
        like_count: 0,
        favorite_count: 0,
        comment_count: 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Kullanıcının etkileşimlerini kontrol et
  const fetchUserInteractions = async () => {
    if (!user) return

    try {
      // Beğeni kontrolü
      const { data: likeData } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('algorithm_id', algorithmId)
        .single()

      // Favori kontrolü
      const { data: favoriteData } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('algorithm_id', algorithmId)
        .single()

      setUserInteractions({
        hasLiked: !!likeData,
        hasFavorited: !!favoriteData
      })
    } catch (error) {
      console.error('Error fetching user interactions:', error)
    }
  }

  // Yorum ekle
  const addComment = async (content: string, parentId?: string) => {
    if (!user) throw new Error('Giriş yapmanız gerekiyor')

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          algorithm_id: algorithmId,
          content,
          parent_id: parentId || null
        })
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      // Yorumları yeniden getir
      await fetchComments()
      await fetchStats()

      return data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  // Yorumu sil
  const deleteComment = async (commentId: string) => {
    if (!user) throw new Error('Giriş yapmanız gerekiyor')

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id)

      if (error) throw error

      // Yorumları yeniden getir
      await fetchComments()
      await fetchStats()
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }

  // Beğeni toggle
  const toggleLike = async () => {
    if (!user) throw new Error('Giriş yapmanız gerekiyor')

    try {
      if (userInteractions.hasLiked) {
        // Beğeniyi kaldır
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('algorithm_id', algorithmId)

        if (error) throw error
      } else {
        // Beğeni ekle
        const { error } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            algorithm_id: algorithmId
          })

        if (error) throw error
      }

      // Durumu güncelle
      setUserInteractions(prev => ({
        ...prev,
        hasLiked: !prev.hasLiked
      }))

      // İstatistikleri yeniden getir
      await fetchStats()
    } catch (error) {
      console.error('Error toggling like:', error)
      throw error
    }
  }

  // Favori toggle
  const toggleFavorite = async () => {
    if (!user) throw new Error('Giriş yapmanız gerekiyor')

    try {
      if (userInteractions.hasFavorited) {
        // Favoriden kaldır
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('algorithm_id', algorithmId)

        if (error) throw error
      } else {
        // Favoriye ekle
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            algorithm_id: algorithmId
          })

        if (error) throw error
      }

      // Durumu güncelle
      setUserInteractions(prev => ({
        ...prev,
        hasFavorited: !prev.hasFavorited
      }))

      // İstatistikleri yeniden getir
      await fetchStats()
    } catch (error) {
      console.error('Error toggling favorite:', error)
      throw error
    }
  }

  // Başlangıçta verileri getir
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchComments(),
        fetchStats(),
        fetchUserInteractions()
      ])
      setLoading(false)
    }

    loadData()
  }, [algorithmId, user])

  return {
    comments,
    stats,
    userInteractions,
    loading,
    addComment,
    deleteComment,
    toggleLike,
    toggleFavorite,
    refreshData: async () => {
      await Promise.all([
        fetchComments(),
        fetchStats(),
        fetchUserInteractions()
      ])
    }
  }
} 