"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PageTransition from '@/components/ui/page-transition'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isTokenValid, setIsTokenValid] = useState(false)

  useEffect(() => {
    // URL'den token'ı kontrol et
    const hashFragment = window.location.hash
    if (hashFragment) {
      const params = new URLSearchParams(hashFragment.substring(1))
      const accessToken = params.get('access_token')
      const type = params.get('type')
      
      if (accessToken && type === 'recovery') {
        setIsTokenValid(true)
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı.' 
        })
      }
    } else {
      setMessage({ 
        type: 'error', 
        text: 'Şifre sıfırlama bağlantısı bulunamadı.' 
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    if (!password || password.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır.' })
      setIsSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Şifreler eşleşmiyor.' })
      setIsSubmitting(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi!' })
        setTimeout(() => {
          router.push('/auth')
        }, 2000)
      }
    } catch {
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/auth" />

        {/* Main Content */}
        <section className="flex-grow flex items-center justify-center py-16 px-4 md:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto max-w-md">
            
            {/* Reset Password Card */}
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
                <h1 className="text-2xl font-bold mb-2">Şifre Sıfırlama</h1>
                <p className="text-white/90 text-sm">
                  Yeni şifrenizi belirleyin
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                {message && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-6 p-4 rounded-lg border flex items-center ${
                      message.type === 'error'
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : 'bg-green-50 border-green-200 text-green-700'
                    }`}
                  >
                    {message.type === 'success' ? (
                      <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                    ) : (
                      <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
                    )}
                    <span className="text-sm">{message.text}</span>
                  </motion.div>
                )}

                {isTokenValid ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Yeni Şifre
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                          placeholder="En az 6 karakter"
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

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Şifre Tekrar
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                          placeholder="Şifrenizi tekrar girin"
                          required
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
                      {isSubmitting ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                    </motion.button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                      Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.
                    </p>
                    <button
                      onClick={() => router.push('/auth')}
                      className="inline-flex items-center px-6 py-3 bg-[#38B6FF] text-white rounded-lg hover:bg-[#0098F7] transition-colors"
                    >
                      <Shield size={20} className="mr-2" />
                      Giriş Sayfasına Dön
                    </button>
                  </div>
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
              <h3 className="font-semibold text-gray-800 mb-2">🔒 Güvenlik İpucu</h3>
              <p className="text-gray-600 text-sm">
                Güçlü bir şifre için büyük/küçük harf, sayı ve özel karakterler kullanın.
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  )
} 