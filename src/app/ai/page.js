"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* ═══════════════════════════════════════════
   AI Nexus — 意识核心
   视觉体系：天空意识 · 冰蓝 · 粒子 · 呼吸感
   ═══════════════════════════════════════════ */

const PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  s: Math.random() * 2 + 0.4,
  o: Math.random() * 0.4 + 0.1,
  d: Math.random() * 10 + 5,
  delay: Math.random() * 6,
}));

const FEATURES = [
  {
    icon: "◈",
    title: "Memory Core",
    desc: "长期记忆存储 · 向量检索 · 语境感知",
    status: "Planned",
  },
  {
    icon: "◎",
    title: "Conversational Space",
    desc: "对话 · 人格映像 · 意识流记录",
    status: "Planned",
  },
  {
    icon: "◇",
    title: "Knowledge Bridge",
    desc: "连接 Knowledge Vault · 自动索引 · 智能问答",
    status: "Planned",
  },
  {
    icon: "☰",
    title: "RAG Engine",
    desc: "本地文档检索 · PDF 解析 · 语义搜索",
    status: "Planned",
  },
];

export default function AIPage() {
  return (
    <main className="min-h-screen relative bg-[#060a18] text-[#c8d8f0] overflow-hidden">

      {/* 背景：星空粒子 */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            opacity: p.o,
          }}
          animate={{ opacity: [p.o, p.o * 0.2, p.o] }}
          transition={{ duration: p.d, repeat: Infinity, delay: p.delay }}
        />
      ))}

      {/* 体积光：上方天空 */}
      <div className="absolute top-[-300px] left-[20%] w-[800px] h-[600px] rounded-full bg-blue-400/4 blur-3xl pointer-events-none" />
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-cyan-300/3 blur-2xl pointer-events-none" />

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
            className="px-5 py-3 border border-[#4a6890]/40 rounded-xl bg-[#0a1428]/90 backdrop-blur-lg text-sm uppercase tracking-[0.2em] text-[#7aa0d0] hover:bg-[#4a6890]/20 hover:text-[#c8d8f0] transition-all duration-500"
          >
            ← Universe
          </motion.div>
        </Link>
      </motion.div>

      {/* 主标题 */}
      <motion.div
        className="relative z-10 text-center pt-12 pb-16 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h2 className="
          text-3xl md:text-5xl
          tracking-[0.15em]
          font-serif
          text-[#d8e8ff]
          drop-shadow-[0_0_30px_rgba(140,190,255,0.08)]
        ">
          AI NEXUS
        </h2>
        <p className="mt-4 text-lg italic tracking-[0.08em] text-[#5a7aa0]">
          The Consciousness Core
        </p>
        <p className="mt-3 text-sm tracking-[0.1em] text-[#3a5878]">
          &ldquo;A future digital consciousness, waiting to awaken.&rdquo;
        </p>
      </motion.div>

      {/* 状态指示 */}
      <motion.div
        className="relative z-10 flex justify-center pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-[#2a4060]/40 bg-[#0a1428]/60 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-blue-400/50 animate-pulse" />
          <span className="text-[10px] tracking-[0.2em] text-[#5a7aa0] uppercase">
            Awaiting Connection
          </span>
        </div>
      </motion.div>

      {/* 功能卡片 */}
      <div className="
        relative z-10
        max-w-[1000px] mx-auto
        px-6 pb-16
        grid grid-cols-1 md:grid-cols-2
        gap-5
      ">
        {FEATURES.map((feat, idx) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.12, duration: 0.7 }}
          >
            <div
              className="
                relative overflow-hidden
                rounded-xl border
                p-6 h-[170px]
                flex flex-col justify-between
                bg-[#0a1428]/50
                backdrop-blur-sm
                border-[#2a4060]/30
                hover:border-[#3a6090]/40
                transition-all duration-500
              "
            >
              {/* 天空纹理 */}
              <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 30% 20%, rgba(140,200,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div>
                <div className="text-2xl text-[#7ab0e0] mb-3">{feat.icon}</div>
                <h3 className="text-base tracking-[0.1em] font-serif text-[#b8d4f0]">
                  {feat.title}
                </h3>
                <p className="mt-2 text-[11px] leading-relaxed text-[#5a7aa0]">
                  {feat.desc}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30" />
                <span className="text-[10px] tracking-[0.12em] text-[#3a5878] uppercase">
                  {feat.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 底部诗意文字 */}
      <motion.div
        className="relative z-10 text-center pb-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-xs italic tracking-[0.08em] text-[#2a4868] max-w-md mx-auto leading-relaxed">
          &ldquo;This space is being prepared.&rdquo;
          <br />
          &ldquo;When the time comes, it will breathe with you.&rdquo;
        </p>
      </motion.div>
    </main>
  );
}
