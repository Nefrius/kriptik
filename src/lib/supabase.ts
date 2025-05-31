import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Profile {
  id: string
  email: string
  username: string
  full_name?: string
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  user_id: string
  algorithm_id: string
  content: string
  parent_id?: string
  created_at: string
  updated_at: string
  profiles?: Profile
  replies?: Comment[]
}

export interface Like {
  id: string
  user_id: string
  algorithm_id: string
  created_at: string
  profiles?: Profile
}

export interface Favorite {
  id: string
  user_id: string
  algorithm_id: string
  created_at: string
  profiles?: Profile
}

export interface UserFollower {
  id: string
  follower_id: string
  following_id: string
  created_at: string
  follower_profile?: Profile
  following_profile?: Profile
}

export interface AlgorithmStats {
  algorithm_id: string
  like_count: number
  favorite_count: number
  comment_count: number
}

export interface UserStats {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  comment_count: number
  like_count: number
  favorite_count: number
  follower_count: number
  following_count: number
} 