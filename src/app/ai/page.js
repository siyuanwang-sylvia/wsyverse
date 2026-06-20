"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ══════ 主页面 ══════ */

export default function AINexus() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <main className="relative min-h-screen scrollable-page bg-[#020510] text-[#b8c8d8]">

      {/* 返回键 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link href="/">
          <motion.div
            whileHover={{ x: -4 }}
            className="px-5 py-3 border border-[#4a3a7a]/40 rounded-xl bg-[#0b1020]/90 backdrop-blur-lg text-sm uppercase tracking-[0.2em] text-[#8b7aad] hover:bg-[#4a3a7a]/20 hover:text-[#d8c8f0] transition-all duration-500"
          >
            ← Universe
          </motion.div>
        </Link>
      </motion.div>

      {/* 背景：深空渐变 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0a0628_0%,#020510_100%)]" />

      {/* 标题区 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center px-6"
      >
        <p className="mb-4 text-xs uppercase tracking-[0.6em] text-[#4a3a7a]">
          AI Nexus — Consciousness Interface
        </p>
        <h1 className="font-serif text-4xl md:text-6xl tracking-[0.18em] text-[#d8c8f0]">
          AI NEXUS
        </h1>
        <div className="mx-auto mt-5 h-px w-32 bg-gradient-to-r from-transparent via-[#4a3a7a]/50 to-transparent" />
        <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#7a6a9a]">
          The future interface where your consciousness meets artificial intelligence.
          <br />
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#3a2a5a]">
            Under construction — coming soon
          </span>
        </p>
      </motion.div>

      {/* 底部署名 */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] text-[#1a1a2a]">
          Where awareness begins to recognize itself
        </p>
      </div>

    </main>
  );
}
