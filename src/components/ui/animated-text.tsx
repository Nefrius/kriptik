"use client";

import { motion } from "framer-motion";
import React from "react";

type AnimatedTextProps = {
  text: string;
  className?: string;
  once?: boolean;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  animationType?: "bounce" | "fade" | "typewriter" | "scramble";
  textStyles?: string;
};

export function AnimatedText({
  text,
  className = "",
  once = false,
  delay = 0,
  duration = 0.05,
  staggerChildren = 0.03,
  animationType = "typewriter",
  textStyles = "",
}: AnimatedTextProps) {
  const letters = Array.from(text);

  // Animasyon varyantları
  const variants = {
    bounce: {
      hidden: { opacity: 0, y: 20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * staggerChildren + delay,
          duration: 0.5,
          type: "spring",
          stiffness: 200,
          damping: 10,
        },
      }),
    },
    fade: {
      hidden: { opacity: 0 },
      visible: (i: number) => ({
        opacity: 1,
        transition: {
          delay: i * staggerChildren + delay,
          duration,
        },
      }),
    },
    typewriter: {
      hidden: { opacity: 0, display: "none" },
      visible: (i: number) => ({
        opacity: 1,
        display: "inline-block",
        transition: {
          delay: i * staggerChildren + delay,
          duration: 0.01,
        },
      }),
    },
    scramble: {
      hidden: { opacity: 0, scale: 1.5, filter: "blur(10px)" },
      visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          delay: i * staggerChildren + delay,
          duration: 0.5,
          ease: "easeOut",
        },
      }),
    },
  };

  const selectedVariant = variants[animationType];

  // Framer Motion'un container varyantı
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className={`inline-block ${letter === " " ? "mr-1" : ""} ${textStyles}`}
          variants={selectedVariant}
          custom={index}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default AnimatedText; 