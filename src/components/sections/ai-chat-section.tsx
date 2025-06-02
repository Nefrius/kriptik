"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Brain, 
  Sparkles, 
  Shield, 
  History, 
  Bot, 
  User, 
  Send, 
  ArrowRight, 
  Key, 
  Lock 
} from "lucide-react";

export default function AIChatSection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-xl"
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
          className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500 rounded-full blur-2xl"
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-gradient-to-br from-purple-500 to-blue-500 p-4 rounded-2xl mr-4"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-800">Kriptik AI</h2>
            <motion.div
              animate={{ 
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-4"
            >
              <Sparkles className="w-6 h-6 text-purple-500" />
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-6"
          />
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kişisel kriptografi asistanınız ile şifreleme dünyasını keşfedin. 
            Sorularınızı sorun, algoritmaları öğrenin ve kriptografi bilginizi derinleştirin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Sol taraf - Özellikler */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              {[
                {
                  icon: Brain,
                  title: "Akıllı Kriptografi Asistanı",
                  description: "Tüm şifreleme algoritmaları hakkında detaylı bilgi alın",
                  color: "from-purple-500 to-purple-600"
                },
                {
                  icon: Shield,
                  title: "Güvenlik Uzmanı",
                  description: "Modern güvenlik kavramlarını ve best practice'leri öğrenin",
                  color: "from-blue-500 to-blue-600"
                },
                {
                  icon: History,
                  title: "Tarihsel Perspektif",
                  description: "Kriptografinin tarihçesini ve gelişimini keşfedin",
                  color: "from-indigo-500 to-indigo-600"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-start space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sağ taraf - Chat preview ve CTA */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Chat window mockup */}
            <motion.div 
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4 flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                </div>
                <div className="flex items-center space-x-2 text-white">
                  <Bot className="w-5 h-5" />
                  <span className="font-semibold">Kriptik AI</span>
                </div>
              </div>
              
              {/* Chat content */}
              <div className="p-6 space-y-4 bg-gray-50 min-h-[300px]">
                {/* AI message */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 max-w-sm">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 2, delay: 1 }}
                    >
                      Merhaba! Ben Kriptik AI. Caesar şifresi hakkında ne öğrenmek istersiniz?
                    </motion.div>
                  </div>
                </div>
                
                {/* User message */}
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-2xl shadow-sm max-w-sm">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                    >
                      Caesar şifresi nasıl çalışır?
                    </motion.div>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                
                {/* AI response */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 max-w-sm">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 2, delay: 2 }}
                    >
                      Caesar şifresi alfabedeki her harfi belirli bir sayıda kaydırır. Örneğin 3 kaydırma ile A→D, B→E olur...
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Input area */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-grow bg-gray-100 rounded-xl px-4 py-3">
                    <span className="text-gray-500">Kriptografi hakkında bir soru sorun...</span>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <Link href="/ai-chat" className="group relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Kriptik AI ile Sohbet Et
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.div>
                </motion.div>
              </Link>
              
              <p className="text-sm text-gray-500 mt-3">
                Giriş yaparak kişisel AI asistanınızla sohbet edebilirsiniz
              </p>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              animate={{ 
                y: [-10, 10, -10],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center"
            >
              <Key className="w-4 h-4 text-purple-500" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [15, -15, 15],
                rotate: [360, 180, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center"
            >
              <Lock className="w-3 h-3 text-blue-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 