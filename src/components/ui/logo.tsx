"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
  href?: string;
};

export default function Logo({
  size = "md",
  animated = true,
  className = "",
  href = "/",
}: LogoProps) {
  const sizes = {
    sm: "text-xl md:text-2xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
    xl: "text-4xl md:text-5xl",
  };

  const sizeClass = sizes[size];
  const LogoContent = () => (
    <div className={`font-bold ${sizeClass} ${className}`}>
      {animated ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ 
            color: "#38B6FF",
            textShadow: "0 0 15px rgba(56, 182, 255, 0.5)" 
          }}
        >
          Kriptik
        </motion.span>
      ) : (
        <span style={{ color: "#38B6FF" }}>Kriptik</span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
} 