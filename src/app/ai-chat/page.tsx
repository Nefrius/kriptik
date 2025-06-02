"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import PageTransition from "@/components/ui/page-transition";
import Link from "next/link";
import Image from "next/image";
import { 
  Send, 
  User, 
  Loader, 
  Shield, 
  Key, 
  Brain,
  Sparkles,
  Lock,
  BookOpen,
  HelpCircle,
  History,
  Lightbulb,
  Zap,
  Clock,
  X,
  Copy,
  CheckCircle
} from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatPage() {
  const { user, session, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [expandedHeader, setExpandedHeader] = useState(false);

  // Sayfa yüklendiğinde hoş geldin mesajı
  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Merhaba ${user.email?.split('@')[0]}! Ben Kriptik AI, senin kişisel kriptografi asistanınım. 🔐\n\nSana şu konularda yardımcı olabilirim:\n• Şifreleme algoritmaları hakkında sorular\n• Caesar, Vigenère, RSA, AES gibi algoritmalar\n• Kriptografi tarihçesi\n• Güvenlik kavramları\n• Pratik örnekler ve açıklamalar\n\nBana kriptografi hakkında merak ettiğin herhangi bir soruyu sorabilirsin!`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [user, messages.length]);

  // Mesajları alt kısma kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Copied message timeout
  useEffect(() => {
    if (copiedMessage) {
      const timeout = setTimeout(() => {
        setCopiedMessage(null);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copiedMessage]);

  // Giriş yapmamış kullanıcılar için
  if (!loading && !session) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
          <Header currentPath="/ai-chat" />
          
          <div className="flex-grow flex items-center justify-center px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md bg-white p-8 rounded-2xl shadow-xl border border-blue-100"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8"
              >
                <div className="mx-auto w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Lock className="w-12 h-12 text-blue-500" />
                </div>
              </motion.div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Kriptik AI&apos;ya Erişim
              </h1>
              <p className="text-gray-600 mb-8">
                Kriptik AI asistanını kullanmak için giriş yapmanız gerekiyor. 
                Ücretsiz bir hesap oluşturun ve hemen başlayın!
              </p>
              
              <div className="space-y-4">
                <Link href="/auth?tab=signin" className="block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md"
                  >
                    Giriş Yap
                  </motion.button>
                </Link>
                
                <Link href="/auth?tab=signup" className="block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-white border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
                  >
                    Hesap Oluştur
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
          
          <Footer />
        </div>
      </PageTransition>
    );
  }

  // Loading durumu
  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
          <Header currentPath="/ai-chat" />
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
              <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Yükleniyor...</p>
            </div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Yanıt alınamadı');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Stream reader bulunamadı');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMessage.content += parsed.content;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: assistantMessage.content }
                      : msg
                  )
                );
              }
            } catch {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessageToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessage(content);
  };

  const renderSuggestions = () => {
    const suggestions = [
      "Caesar şifresi nasıl çalışır?",
      "RSA ve AES arasındaki farklar nelerdir?",
      "Kriptografinin tarihçesi nedir?",
      "Simetrik ve asimetrik şifreleme arasındaki fark nedir?"
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02, backgroundColor: "#EBF5FF" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setInputMessage(suggestion)}
            className="p-3 text-sm text-left bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:shadow-md text-blue-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Lightbulb className="w-4 h-4 flex-shrink-0 text-blue-500" />
            <span className="line-clamp-1">{suggestion}</span>
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header currentPath="/ai-chat" />

        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 md:py-12 px-4 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-300/10 rounded-full blur-3xl"></div>
            
            {/* Decorative elements */}
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-12 h-12 bg-white/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-purple-300/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                x: [0, 20, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 right-1/4 w-20 h-20 bg-blue-300/10 rounded-full blur-xl"
            />
          </div>
          
          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex flex-col items-center justify-center mb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                  className="relative mb-4"
                >
                  {/* Animasyonlu halkalar */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 0.3, 0.7],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/50 to-indigo-500/50 blur-md"
                    style={{ margin: "-8px" }}
                  />
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-white/20"
                    style={{ margin: "-15px" }}
                  />
                  <motion.div
                    animate={{ 
                      rotate: -360,
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-indigo-300/30"
                    style={{ margin: "-25px" }}
                  />
                  
                  {/* Logo container */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-400/80 to-indigo-500/80 shadow-lg shadow-indigo-500/30 flex items-center justify-center z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-14 h-14 md:w-18 md:h-18 rounded-full overflow-hidden"
                    >
                      <Image 
                        src="/kriptik.png" 
                        alt="Kriptik AI Logo" 
                        width={72} 
                        height={72}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Parıltı efektleri */}
                  <motion.div
                    animate={{ 
                      opacity: [0, 1, 0],
                      x: [10, 30, 10],
                      y: [-10, -30, -10]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full blur-sm"
                  />
                  <motion.div
                    animate={{ 
                      opacity: [0, 0.8, 0],
                      x: [-5, -15, -5],
                      y: [5, 15, 5]
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-200 rounded-full blur-sm"
                  />
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100"
                >
                  Kriptik AI
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-2"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                  </motion.div>
                </motion.div>
              </div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-lg text-white/90 max-w-2xl mx-auto"
              >
                Kişisel kriptografi asistanınız. Şifreleme ve güvenlik konularında uzman yardımcınız.
              </motion.p>
              
              {!expandedHeader && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExpandedHeader(true)}
                  className="mt-4 px-4 py-2 bg-white/10 rounded-full text-sm flex items-center mx-auto transition-all duration-300"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Kriptik AI hakkında daha fazla bilgi
                </motion.button>
              )}
              
              <AnimatePresence>
                {expandedHeader && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left max-w-4xl mx-auto"
                  >
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold mb-4">Kriptik AI Nedir?</h2>
                      <button 
                        onClick={() => setExpandedHeader(false)}
                        className="p-1 hover:bg-white/10 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="bg-blue-500/20 p-2 rounded-lg">
                            <Brain className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Kriptografi Uzmanı</h3>
                            <p className="text-sm text-white/80">Şifreleme algoritmaları ve güvenlik konularında uzman yardım</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-blue-500/20 p-2 rounded-lg">
                            <History className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Tarihsel Bilgi</h3>
                            <p className="text-sm text-white/80">Kriptografi tarihçesi ve gelişim süreci hakkında detaylı bilgi</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="bg-blue-500/20 p-2 rounded-lg">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Öğrenme Asistanı</h3>
                            <p className="text-sm text-white/80">Karmaşık kriptografi konularını basit şekilde anlamanıza yardımcı olur</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-blue-500/20 p-2 rounded-lg">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Hızlı Yanıtlar</h3>
                            <p className="text-sm text-white/80">Sorularınıza anında ve doğru yanıtlar sunar</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-grow flex flex-col max-w-5xl mx-auto w-full px-4 py-6">
          {/* Messages */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-grow bg-white rounded-2xl shadow-xl border border-blue-100 mb-4 flex flex-col relative overflow-hidden"
          >
            {/* Fancy gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/40 pointer-events-none"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
            
            {/* Chat header */}
            <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl relative z-10 flex items-center">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center"
                >
                  <Image 
                    src="/kriptik.png" 
                    alt="Kriptik AI" 
                    width={32} 
                    height={32}
                    className="w-full h-full rounded-full object-cover"
                  />
                </motion.div>
                <div>
                  <h3 className="font-medium text-gray-800">Kriptik AI Sohbeti</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Çevrimiçi</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-6 relative z-10" style={{ maxHeight: 'calc(100vh - 340px)' }}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-6 flex items-center justify-center shadow-lg shadow-blue-300/20"
                  >
                    <Brain className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Kriptik AI ile Sohbete Başla</h3>
                  <p className="text-gray-600 max-w-md mb-8">
                    Kriptografi ve şifreleme hakkında sorularınızı sorun. Algoritmaları öğrenin, 
                    güvenlik kavramlarını keşfedin veya tarihsel bilgilere ulaşın.
                  </p>
                  
                  {renderSuggestions()}
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-300/20' 
                            : 'bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-lg shadow-indigo-300/20'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-5 h-5" />
                          ) : (
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              className="w-6 h-6 rounded-full overflow-hidden"
                            >
                              <Image 
                                src="/kriptik.png" 
                                alt="Kriptik AI" 
                                width={24} 
                                height={24}
                                className="w-full h-full rounded-full object-cover"
                              />
                            </motion.div>
                          )}
                        </div>
                        
                        <div className={`flex-grow ${message.role === 'user' ? 'text-right' : ''}`}>
                          <div className="group relative">
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0.5 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className={`inline-block px-6 py-3.5 rounded-2xl ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-300/10'
                                  : 'bg-white border border-blue-100 text-gray-800 shadow-lg shadow-blue-100/5'
                              }`}
                            >
                              <div className="whitespace-pre-wrap">{message.content}</div>
                            </motion.div>
                            
                            {message.content.length > 20 && (
                              <button 
                                onClick={() => copyMessageToClipboard(message.content)}
                                className={`absolute top-2 ${message.role === 'user' ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} 
                                opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-full shadow-md text-gray-500 hover:text-blue-500 hover:bg-blue-50`}
                                title="Mesajı kopyala"
                              >
                                {copiedMessage === message.content ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                          
                          <div className={`flex items-center text-xs text-gray-500 mt-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <Clock className="w-3 h-3 mr-1" />
                            {message.timestamp.toLocaleTimeString('tr-TR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3 max-w-3xl">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-lg shadow-indigo-300/20 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="w-6 h-6 rounded-full overflow-hidden"
                      >
                        <Image 
                          src="/kriptik.png" 
                          alt="Kriptik AI" 
                          width={24} 
                          height={24}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </motion.div>
                    </div>
                    <div className="bg-white border border-blue-100 px-5 py-3 rounded-2xl shadow-md">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1.5">
                          <motion.div 
                            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                            className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                          />
                          <motion.div 
                            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                            className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                          />
                          <motion.div 
                            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                            className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                          />
                        </div>
                        <span className="text-gray-600 text-sm font-medium">Yanıt yazılıyor...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-2xl relative z-10">
              <div className="flex items-end space-x-3">
                <div className="flex-grow relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Kriptografi hakkında bir soru sorun..."
                    className="w-full px-4 py-3.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-md bg-white"
                    rows={1}
                    style={{ maxHeight: '120px' }}
                    disabled={isLoading}
                  />
                  
                  {messages.length === 0 && inputMessage.length === 0 && renderSuggestions()}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3.5 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between mt-3 text-xs text-gray-500">
                <div className="flex items-center space-x-4 mb-2 md:mb-0">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-blue-500" />
                    <span>Güvenli AI Chat</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Key className="w-3 h-3 text-blue-500" />
                    <span>Kriptografi Uzmanı</span>
                  </div>
                </div>
                <div>
                  <span className="text-blue-500 font-medium">Enter</span> ile gönder, <span className="text-blue-500 font-medium">Shift+Enter</span> ile yeni satır
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
} 