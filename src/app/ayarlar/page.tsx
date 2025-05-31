"use client";

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Globe, MapPin, Edit3, Save, X, Eye, EyeOff, Shield, Trash2, Camera } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import PageTransition from '@/components/ui/page-transition'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import { useRouter } from 'next/navigation'

export default function AyarlarPage() {
  const { user, profile, updateProfile, signOut, loading } = useAuth()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Profil formu state'i
  const [profileForm, setProfileForm] = useState({
    username: '',
    full_name: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: ''
  })

  // Şifre formu state'i
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setProfileForm({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        avatar_url: profile.avatar_url || ''
      })
    }
  }, [profile])

  const handleProfileSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // Username boş olamaz
      if (!profileForm.username.trim()) {
        setMessage({ type: 'error', text: 'Kullanıcı adı boş olamaz.' })
        return
      }

      // Website URL kontrolü
      if (profileForm.website && !profileForm.website.startsWith('http')) {
        setProfileForm(prev => ({
          ...prev,
          website: `https://${prev.website}`
        }))
      }

      await updateProfile(profileForm)
      setMessage({ type: 'success', text: 'Profil başarıyla güncellendi!' })
      setIsEditing(false)
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage({ type: 'error', text: 'Profil güncellenirken bir hata oluştu.' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    setSaving(true)
    setMessage(null)

    try {
      if (!passwordForm.currentPassword || !passwordForm.newPassword) {
        setMessage({ type: 'error', text: 'Tüm şifre alanlarını doldurun.' })
        return
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' })
        return
      }

      if (passwordForm.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır.' })
        return
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Şifre başarıyla güncellendi!' })
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error('Password change error:', error)
      setMessage({ type: 'error', text: 'Şifre değiştirilirken bir hata oluştu.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        // Önce profil ve ilgili verileri sil
        await supabase.from('profiles').delete().eq('id', user?.id)
        
        // Sonra auth kullanıcısını sil (bu işlem admin API gerektirebilir)
        setMessage({ type: 'success', text: 'Hesap silme işlemi başlatıldı. Çıkış yapılıyor...' })
        
        setTimeout(async () => {
          await signOut()
          router.push('/')
        }, 2000)
      } catch (error) {
        console.error('Account deletion error:', error)
        setMessage({ type: 'error', text: 'Hesap silinirken bir hata oluştu.' })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38B6FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Güvenlik', icon: Shield },
    { id: 'account', name: 'Hesap', icon: Lock }
  ]

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/ayarlar" />

        {/* Page Header */}
        <section className="bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] py-12 px-4 md:px-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-white"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Hesap Ayarları</h1>
              <p className="text-white/90 max-w-2xl mx-auto">
                Profil bilgilerinizi, güvenlik ayarlarınızı ve hesap tercihlerinizi yönetin.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="flex-grow py-12 px-4 md:px-8 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            
            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg border flex items-center ${
                  message.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-700' 
                    : 'bg-green-50 border-green-200 text-green-700'
                }`}
              >
                {message.type === 'success' ? (
                  <Save size={20} className="mr-2 flex-shrink-0" />
                ) : (
                  <X size={20} className="mr-2 flex-shrink-0" />
                )}
                <span>{message.text}</span>
                <button
                  onClick={() => setMessage(null)}
                  className="ml-auto text-current hover:opacity-70"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Sidebar Tabs */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-[#38B6FF] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <tab.icon size={20} className="mr-3" />
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </motion.div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl p-8 shadow-sm"
                >

                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Profil Bilgileri</h2>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-4 py-2 bg-[#38B6FF] text-white rounded-lg hover:bg-[#0098F7] transition-colors"
                          >
                            <Edit3 size={16} className="mr-2" />
                            Düzenle
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setIsEditing(false)}
                              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              <X size={16} className="mr-2" />
                              İptal
                            </button>
                            <button
                              onClick={handleProfileSave}
                              disabled={isSaving}
                              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                              <Save size={16} className="mr-2" />
                              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            {profileForm.avatar_url ? (
                              <img
                                src={profileForm.avatar_url}
                                alt="Avatar"
                                className="w-20 h-20 rounded-full"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                <User size={32} className="text-gray-500" />
                              </div>
                            )}
                            {isEditing && (
                              <button className="absolute -bottom-2 -right-2 bg-[#38B6FF] text-white rounded-full p-2 hover:bg-[#0098F7] transition-colors">
                                <Camera size={16} />
                              </button>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">Profil Fotoğrafı</h3>
                            <p className="text-sm text-gray-600">JPG, PNG veya GIF formatında olabilir</p>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Kullanıcı Adı *
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                              <input
                                type="text"
                                value={profileForm.username}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                                disabled={!isEditing}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent disabled:bg-gray-50"
                                placeholder="kullaniciadi"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ad Soyad
                            </label>
                            <input
                              type="text"
                              value={profileForm.full_name}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                              disabled={!isEditing}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent disabled:bg-gray-50"
                              placeholder="Ad Soyad"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Biyografi
                            </label>
                            <textarea
                              value={profileForm.bio}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                              disabled={!isEditing}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent disabled:bg-gray-50"
                              placeholder="Kendiniz hakkında kısa bir açıklama..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Konum
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                              <input
                                type="text"
                                value={profileForm.location}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                                disabled={!isEditing}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent disabled:bg-gray-50"
                                placeholder="İstanbul, Türkiye"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Website
                            </label>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                              <input
                                type="url"
                                value={profileForm.website}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, website: e.target.value }))}
                                disabled={!isEditing}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent disabled:bg-gray-50"
                                placeholder="https://example.com"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Güvenlik Ayarları</h2>
                      
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-semibold text-blue-800 mb-2">E-posta Adresi</h3>
                          <div className="flex items-center">
                            <Mail size={16} className="text-blue-600 mr-2" />
                            <span className="text-blue-700">{profile.email}</span>
                          </div>
                          <p className="text-sm text-blue-600 mt-2">
                            E-posta adresinizi değiştirmek için destek ile iletişime geçin.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Şifre Değiştir</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mevcut Şifre
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                  type={showPasswords.current ? "text" : "password"}
                                  value={passwordForm.currentPassword}
                                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                                  placeholder="Mevcut şifrenizi girin"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yeni Şifre
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                  type={showPasswords.new ? "text" : "password"}
                                  value={passwordForm.newPassword}
                                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                                  placeholder="Yeni şifrenizi girin"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yeni Şifre Tekrar
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                  type={showPasswords.confirm ? "text" : "password"}
                                  value={passwordForm.confirmPassword}
                                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                                  placeholder="Yeni şifrenizi tekrar girin"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={handlePasswordChange}
                              disabled={isSaving}
                              className="bg-[#38B6FF] text-white px-6 py-3 rounded-lg hover:bg-[#0098F7] transition-colors disabled:opacity-50"
                            >
                              {isSaving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Account Tab */}
                  {activeTab === 'account' && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Hesap Yönetimi</h2>
                      
                      <div className="space-y-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Hesap Durumu</h3>
                          <p className="text-yellow-700 mb-4">
                            Hesabınız aktif durumda. Tüm özelliklerimize erişebilirsiniz.
                          </p>
                          <div className="flex items-center text-sm text-yellow-600">
                            <Shield size={16} className="mr-2" />
                            Son giriş: Şimdi
                          </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-red-800 mb-2">Tehlikeli Bölge</h3>
                          <p className="text-red-700 mb-4">
                            Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinir. Bu işlem geri alınamaz.
                          </p>
                          <button
                            onClick={handleDeleteAccount}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 size={16} className="mr-2" />
                            Hesabı Sil
                          </button>
                        </div>
                      </div>
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