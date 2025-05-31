"use client";

import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Logo animated={false} size="lg" className="mb-4" />
            <p className="text-gray-600 max-w-md">
              Kriptografi öğrenmek hiç bu kadar kolay ve eğlenceli olmamıştı. 
              Temel şifreleme algoritmalarını keşfedin ve tarihin derinliklerine yolculuk yapın.
            </p>
          </div>
          
          <div className="md:ml-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Bağlantılar</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-[#38B6FF] transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/algoritmalar" className="text-gray-600 hover:text-[#38B6FF] transition-colors">
                  Algoritmalar
                </Link>
              </li>
              <li>
                <Link href="/hakkinda" className="text-gray-600 hover:text-[#38B6FF] transition-colors">
                  Hakkında
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Kriptik. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
} 