"use client";

import { motion } from "framer-motion";
import React, { ReactNode } from "react";

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
  highlightColor?: string;
  onClick?: () => void;
};

export default function AnimatedCard({
  children,
  className = "",
  hoverEffect = true,
  delay = 0,
  highlightColor = "before:bg-primary-500/10",
  onClick,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md ${
        hoverEffect
          ? `hover:shadow-xl transition-all duration-300 ${highlightColor} before:absolute before:inset-0 before:z-0 before:opacity-0 before:transition-opacity hover:before:opacity-100 before:pointer-events-none`
          : ""
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        transition: { 
          duration: 0.5, 
          delay, 
          ease: "easeOut" 
        } 
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={
        hoverEffect
          ? { scale: 1.02, transition: { duration: 0.2 } }
          : undefined
      }
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
} 