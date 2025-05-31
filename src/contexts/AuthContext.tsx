"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Supabase bağlantısının geçerli olup olmadığını kontrol et
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key'
}

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

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, username: string, fullName?: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Kullanıcı profilini getir
  const fetchProfile = async (userId: string) => {
    if (!isSupabaseConfigured()) return
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  // Profil oluştur
  const createProfile = async (user: User, username: string, fullName?: string) => {
    if (!isSupabaseConfigured()) return
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          username: username,
          full_name: fullName || '',
          avatar_url: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return
      }

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in createProfile:', error)
    }
  }

  // Kayıt ol
  const signUp = async (email: string, password: string, username: string, fullName?: string) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase yapılandırması eksik. Lütfen environment variables ayarlayın.' }
    }
    
    try {
      // Kullanıcı adının benzersiz olup olmadığını kontrol et
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()

      if (existingProfile) {
        return { error: 'Bu kullanıcı adı zaten kullanılıyor.' }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName
          }
        }
      })

      if (error) {
        if (error.message.includes('already registered')) {
          return { error: 'Bu e-posta adresi zaten kayıtlı.' }
        }
        return { error: error.message }
      }

      if (data.user && !data.session) {
        return { error: 'Hesabınızı onaylamak için e-posta adresinizi kontrol edin.' }
      }

      return {}
    } catch (error) {
      console.error('Error signing up:', error)
      return { error: 'Kayıt sırasında bir hata oluştu.' }
    }
  }

  // Giriş yap
  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase yapılandırması eksik. Lütfen environment variables ayarlayın.' }
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'E-posta veya şifre hatalı.' }
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'Lütfen önce e-posta adresinizi onaylayın.' }
        }
        return { error: error.message }
      }

      return {}
    } catch (error) {
      console.error('Error signing in:', error)
      return { error: 'Giriş sırasında bir hata oluştu.' }
    }
  }

  // Çıkış yap
  const signOut = async () => {
    if (!isSupabaseConfigured()) return
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Şifre sıfırlama
  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase yapılandırması eksik. Lütfen environment variables ayarlayın.' }
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      console.error('Error resetting password:', error)
      return { error: 'Şifre sıfırlama sırasında bir hata oluştu.' }
    }
  }

  // Profil güncelle
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !isSupabaseConfigured()) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      if (data) setProfile(data)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  // Auth state değişikliklerini dinle
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }
    
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          if (event === 'SIGNED_IN') {
            // Profil var mı kontrol et, yoksa oluştur
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            
            if (!existingProfile) {
              // Yeni kullanıcı - profil oluştur
              const userData = session.user.user_metadata
              await createProfile(
                session.user, 
                userData.username || session.user.email?.split('@')[0] || '', 
                userData.full_name || ''
              )
            } else {
              setProfile(existingProfile)
            }
          } else {
            // Mevcut kullanıcı - profil getir
            await fetchProfile(session.user.id)
          }
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 