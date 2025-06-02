"use client";

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, User, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import PageTransition from '@/components/ui/page-transition'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'

// AuthContent component - useSearchParams kullanımı içeren kısım
function AuthContent() {
  const { user, signUp, signIn, resetPassword, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const tab = searchParams.get('tab')

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [forceShowContent, setForceShowContent] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: ''
  })

  // Loading timeout - 3 saniye sonra zorla içeriği göster
  useEffect(() => {
    const timeout = setTimeout(() => {
      setForceShowContent(true)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  // Tab parametresine göre otomatik mod belirleme
  useEffect(() => {
    if (tab === 'signup') {
      setIsLogin(false)
    } else if (tab === 'signin') {
      setIsLogin(true)
    }
  }, [tab])

  useEffect(() => {
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'E-posta ve şifre gereklidir.' })
      return false
    }

    if (!isLogin) {
      if (!formData.username) {
        setMessage({ type: 'error', text: 'Kullanıcı adı gereklidir.' })
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Şifreler eşleşmiyor.' })
        return false
      }
      if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır.' })
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      if (isLogin) {
        const result = await signIn(formData.email, formData.password)
        if (result.error) {
          setMessage({ type: 'error', text: result.error })
        } else {
          setMessage({ type: 'success', text: 'Giriş başarılı! Yönlendiriliyorsunuz...' })
          setTimeout(() => router.push('/'), 1000)
        }
      } else {
        const result = await signUp(formData.email, formData.password, formData.username, formData.fullName)
        if (result.error) {
          setMessage({ type: 'error', text: result.error })
        } else {
          setMessage({ type: 'success', text: 'Kayıt başarılı! E-posta adresinizi kontrol edin.' })
          setIsLogin(true)
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            username: '',
            fullName: ''
          })
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setMessage({ type: 'error', text: 'Lütfen e-posta adresinizi girin.' })
      return
    }

    const result = await resetPassword(formData.email)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Şifre sıfırlama e-postası gönderildi.' })
    }
  }

  if (loading && !forceShowContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38B6FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
          <p className="text-gray-500 text-sm mt-2">
            Çok uzun sürüyorsa sayfayı yenileyin
          </p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Redirect edilecek
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header currentPath="/auth" />

      {/* Main Content */}
      <section className="flex-grow flex items-center justify-center py-16 px-4 md:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto max-w-md">
          
          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#38B6FF] to-[#0EA5E9] p-8 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
              >
                <Shield size={32} />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? 'Tekrar Hoş Geldiniz!' : 'Kriptik\'e Katılın!'}
              </h1>
              <p className="text-white/90 text-sm">
                {isLogin 
                  ? 'Hesabınıza giriş yapın ve şifreleme dünyasını keşfedin'
                  : 'Hesap oluşturun ve premium şifreleme algoritmalarına erişin'
                }
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Tab Buttons */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setIsLogin(true)
                    setMessage(null)
                    setFormData({
                      email: '',
                      password: '',
                      confirmPassword: '',
                      username: '',
                      fullName: ''
                    })
                  }}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    isLogin 
                      ? 'bg-white text-[#38B6FF] shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false)
                    setMessage(null)
                    setFormData({
                      email: '',
                      password: '',
                      confirmPassword: '',
                      username: '',
                      fullName: ''
                    })
                  }}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    !isLogin 
                      ? 'bg-white text-[#38B6FF] shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Kayıt Ol
                </button>
              </div>

              {(error || message) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-6 p-4 rounded-lg border flex items-center ${
                    (error || message?.type === 'error')
                      ? 'bg-red-50 border-red-200 text-red-700' 
                      : 'bg-green-50 border-green-200 text-green-700'
                  }`}
                >
                  <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
                  <span className="text-sm">
                    {error === 'auth_failed' && 'Giriş yapılırken bir hata oluştu.'}
                    {error === 'callback_failed' && 'Oturum açılırken bir hata oluştu.'}
                    {error && !['auth_failed', 'callback_failed'].includes(error) && 'Bilinmeyen bir hata oluştu.'}
                    {message && message.text}
                  </span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Username (sadece kayıt için) */}
                {!isLogin && (
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Kullanıcı Adı
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                        placeholder="kullaniciadi"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {/* Full Name (sadece kayıt için) */}
                {!isLogin && (
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad (Opsiyonel)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                        placeholder="Ad Soyad"
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                      placeholder={isLogin ? "Şifrenizi girin" : "En az 6 karakter"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (sadece kayıt için) */}
                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre Tekrar
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                        placeholder="Şifrenizi tekrar girin"
                        required={!isLogin}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#38B6FF] hover:bg-[#0098F7]'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Shield size={20} className="mr-2" />
                  )}
                  {isSubmitting 
                    ? (isLogin ? 'Giriş yapılıyor...' : 'Kayıt olunuyor...') 
                    : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')
                  }
                </motion.button>
              </form>

              {/* Forgot Password */}
              {isLogin && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleForgotPassword}
                    className="text-[#38B6FF] hover:text-[#0098F7] text-sm font-medium transition-colors"
                  >
                    Şifremi Unuttum
                  </button>
                </div>
              )}

              {/* Alternative Access */}
              {isLogin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="mt-6 pt-6 border-t border-gray-200 text-center"
                >
                  <p className="text-gray-600 text-sm mb-3">
                    Giriş yapmadan devam etmek istiyorsanız:
                  </p>
                  <button
                    onClick={() => router.push('/algoritmalar')}
                    className="inline-flex items-center text-[#38B6FF] hover:text-[#0098F7] transition-colors text-sm font-medium"
                  >
                    <Shield size={16} className="mr-1" />
                    Sınırlı Erişimle Devam Et
                  </button>
                  <p className="text-gray-500 text-xs mt-2">
                    (Sadece 3 temel algoritma erişilebilir)
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl p-6 text-center"
          >
            <h3 className="font-semibold text-gray-800 mb-2">🔒 Demo Modu</h3>
            <p className="text-gray-600 text-sm">
              Bu demo versiyonunda herhangi bir e-posta/şifre ile giriş yapabilirsiniz. 
              Veriler sadece tarayıcınızda saklanır.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Loading component
function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38B6FF] mx-auto mb-4"></div>
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    </div>
  )
}

// Ana AuthPage component
export default function AuthPage() {
  return (
    <PageTransition>
      <Suspense fallback={<AuthLoading />}>
        <AuthContent />
      </Suspense>
    </PageTransition>
  )
} 