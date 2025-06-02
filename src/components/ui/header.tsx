"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, Menu, X, Shield, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  currentPath: string;
}

export default function Header({ currentPath }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, profile, signOut, loading } = useAuth();

  const navigation = [
    { name: "Ana Sayfa", href: "/", path: "/" },
    { name: "Algoritmalar", href: "/algoritmalar", path: "/algoritmalar" },
    { name: "Kriptik AI", href: "/ai-chat", path: "/ai-chat", icon: Brain, requireAuth: true },
    { name: "Yarışma", href: "/yarisma", path: "/yarisma" },
    { name: "Üyeler", href: "/uyeler", path: "/uyeler" },
    { name: "Hakkında", href: "/hakkinda", path: "/hakkinda" },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-10 h-10"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-0 rounded-full border border-blue-300/50"
                style={{ margin: "-3px" }}
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"
              />
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-9 h-9 rounded-full overflow-hidden"
                >
                  <Image 
                    src="/kriptik.png" 
                    alt="Kriptik Logo" 
                    width={36} 
                    height={36}
                    className="w-full h-full rounded-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
            <span className="text-xl font-bold text-gray-900">Kriptik</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              if (item.requireAuth && !user) {
                return null;
              }
              
              return (
              <Link
                key={item.name}
                href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentPath === item.path
                    ? "text-[#38B6FF] border-b-2 border-[#38B6FF]"
                    : "text-gray-700 hover:text-[#38B6FF]"
                }`}
              >
                  {item.icon && <item.icon className="w-4 h-4" />}
                {item.name}
              </Link>
              );
            })}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : user && profile ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#38B6FF] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{profile.username}</span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                    >
                      <Link
                        href="/profil"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profil
                      </Link>
                      <Link
                        href="/ayarlar"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Ayarlar
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Çıkış Yap
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center space-x-2 px-4 py-2 bg-[#38B6FF] text-white rounded-lg hover:bg-[#0098F7] transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Giriş / Kayıt</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => {
                  if (item.requireAuth && !user) {
                    return null;
                  }
                  
                  return (
                  <Link
                    key={item.name}
                    href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                      currentPath === item.path
                        ? "text-[#38B6FF] bg-blue-50"
                        : "text-gray-700 hover:text-[#38B6FF] hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                      {item.icon && <item.icon className="w-4 h-4" />}
                    {item.name}
                  </Link>
                  );
                })}
                
                <div className="border-t border-gray-200 my-2" />
                
                {user && profile ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-4 py-2">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.username}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-[#38B6FF] rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">{profile.username}</span>
                    </div>
                    <Link
                      href="/profil"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profil
                    </Link>
                    <Link
                      href="/ayarlar"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Ayarlar
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Çıkış Yap
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="flex items-center px-4 py-2 text-sm font-medium text-[#38B6FF] hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4 mr-3" />
                    Giriş / Kayıt
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop for closing user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
} 