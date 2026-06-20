"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   背景星空粒子（客户端生成，避免 SSR hydration 不匹配）
   ═══════════════════════════════════════════════════ */
function generateParticles(count = 60) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 1.5 + 0.3,
    o: Math.random() * 0.5 + 0.1,
    d: Math.random() * 8 + 4,
    delay: Math.random() * 5,
  }));
}

/* ═══════════════════════════════════════════════════
   四道世界之门 — 数据
   ═══════════════════════════════════════════════════ */
const GATES = [
  {
    id: "soul",
    title: "SOUL REALM",
    subtitle: "灵魂领域",
    desc: "记忆 · 情绪 · 梦境 · 自我",
    href: "/soul",
    system: "A", // 禁书馆
    icon: "✦",
    color: "#f4e6c3",
    glow: "rgba(255,220,140,0.12)",
    bg: "rgba(20,18,12,0.9)",
    border: "rgba(180,155,90,0.25)",
    preview: "禁书馆 · 暗金 · 尘埃 · 烛光",
  },
  {
    id: "vault",
    title: "KNOWLEDGE VAULT",
    subtitle: "知识圣殿",
    desc: "书籍 · 论文 · 笔记 · 档案",
    href: "/vault",
    system: "A",
    icon: "⬡",
    color: "#e8d5a8",
    glow: "rgba(255,210,120,0.10)",
    bg: "rgba(18,16,10,0.9)",
    border: "rgba(170,145,80,0.22)",
    preview: "无限书架 · 自动生长 · 知识宇宙",
  },
  {
    id: "passion",
    title: "THE ARCHIPELAGO",
    subtitle: "热爱群岛",
    desc: "天文 · 音乐 · 艺术 · 运动",
    href: "/passion",
    system: "B", // 天空意识
    icon: "◎",
    color: "#b4d4f0",
    glow: "rgba(140,190,255,0.10)",
    bg: "rgba(8,14,24,0.9)",
    border: "rgba(100,170,255,0.18)",
    preview: "海洋 · 星轨 · 极光 · 漂浮岛屿",
  },
  {
    id: "ai",
    title: "AI NEXUS",
    subtitle: "意识核心",
    desc: "未来 · 记忆 · 对话 · 共生",
    href: "/ai",
    system: "B",
    icon: "◇",
    color: "#c8d8f0",
    glow: "rgba(160,200,255,0.10)",
    bg: "rgba(10,16,28,0.9)",
    border: "rgba(120,180,255,0.18)",
    preview: "天空 · 水晶 · 粒子 · 呼吸 · 光",
  },
];

/* ═══════════════════════════════════════════════════
   主页面
   ═══════════════════════════════════════════════════ */
export default function Home() {
  const [hoveredGate, setHoveredGate] = useState(null);
  const [entering, setEntering] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(generateParticles(60));
  }, []);

  const handleEnter = useCallback((gateId) => {
    setEntering(gateId);
    // 800ms 后跳转，让推进动画播放完
    setTimeout(() => {
      window.location.href = `/${gateId}`;
    }, 900);
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden relative bg-[#05060a] text-[#f4e6c3] select-none">

      {/* ── 背景星空 ── */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            opacity: p.o,
          }}
          animate={{ opacity: [p.o, p.o * 0.3, p.o] }}
          transition={{ duration: p.d, repeat: Infinity, delay: p.delay }}
        />
      ))}

      {/* ── 体积光：左上 ── */}
      <div className="absolute -top-[300px] -left-[200px] w-[800px] h-[800px] rounded-full bg-amber-500/4 blur-3xl pointer-events-none" />
      {/* ── 体积光：右下 ── */}
      <div className="absolute -bottom-[300px] -right-[200px] w-[700px] h-[700px] rounded-full bg-yellow-500/3 blur-3xl pointer-events-none" />

      {/* ── 推进动画遮罩 ── */}
      <AnimatePresence>
        {entering && (
          <motion.div
            key="enter-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "#05060a" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div
                className="text-4xl md:text-6xl tracking-[0.2em] font-serif"
                style={{ color: GATES.find(g => g.id === entering)?.color }}
              >
                {GATES.find(g => g.id === entering)?.title}
              </div>
              <div className="mt-4 text-sm tracking-[0.15em] text-[#aa9a76] italic">
                {GATES.find(g => g.id === entering)?.preview}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 中央内容 ── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">

        {/* 标题区 */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1
            className="
              text-4xl md:text-6xl lg:text-7xl
              leading-tight
              tracking-[0.18em]
              font-serif
              text-[#f5e8c8]
              drop-shadow-[0_0_30px_rgba(255,215,100,0.08)]
            "
          >
            SYLVIA&apos;S
            <br />
            PERSONAL UNIVERSE
          </h1>

          <motion.p
            className="
              mt-6
              text-base md:text-lg
              italic
              tracking-[0.1em]
              text-[#9a8a66]
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            &ldquo;Guess what? I&rsquo;m still discovering who I am.&rdquo;
          </motion.p>

          {/* 副标题引导 */}
          <motion.p
            className="mt-4 text-xs tracking-[0.25em] text-[#6b5e42] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            Choose a world to enter
          </motion.p>
        </motion.div>

        {/* ── 四道门 ── */}
        <div
          className="
            relative
            w-full
            max-w-[1100px]
            grid grid-cols-2 md:grid-cols-4
            gap-4 md:gap-6
          "
        >
          {GATES.map((gate, idx) => {
            const isHovered = hoveredGate === gate.id;
            const isOtherHovered = hoveredGate && hoveredGate !== gate.id;

            return (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.15, duration: 0.8, ease: "easeOut" }}
                onHoverStart={() => setHoveredGate(gate.id)}
                onHoverEnd={() => setHoveredGate(null)}
                className="relative"
              >
                <Link
                  href={gate.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleEnter(gate.id);
                  }}
                  className="group relative block w-full aspect-[3/4] md:aspect-[4/5]"
                >
                  {/* 门的光晕背景 */}
                  <motion.div
                    className="absolute inset-[-20px] rounded-2xl blur-2xl pointer-events-none"
                    style={{ backgroundColor: gate.glow }}
                    animate={{
                      opacity: isHovered ? 0.6 : 0,
                      scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* 门本体 */}
                  <motion.div
                    className="
                      relative w-full h-full overflow-hidden rounded-xl
                      border backdrop-blur-sm
                    "
                    style={{
                      backgroundColor: gate.bg,
                      borderColor: gate.border,
                    }}
                    animate={{
                      scale: isHovered ? 1.05 : (isOtherHovered ? 0.95 : 1),
                      opacity: isOtherHovered ? 0.4 : 1,
                      y: isHovered ? -12 : 0,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {/* 门内微光纹理 */}
                    <div
                      className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, ${gate.color} 1px, transparent 1px)`,
                        backgroundSize: "18px 18px",
                      }}
                    />

                    {/* 门框金线（System A 禁书馆） */}
                    {gate.system === "A" && (
                      <>
                        <div className="absolute top-4 left-4 right-4 h-px" style={{ backgroundColor: `${gate.color}20` }} />
                        <div className="absolute bottom-4 left-4 right-4 h-px" style={{ backgroundColor: `${gate.color}20` }} />
                        <div className="absolute left-4 top-4 bottom-4 w-px" style={{ backgroundColor: `${gate.color}15` }} />
                        <div className="absolute right-4 top-4 bottom-4 w-px" style={{ backgroundColor: `${gate.color}15` }} />
                      </>
                    )}

                    {/* 天空纹理（System B 天空意识） */}
                    {gate.system === "B" && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* 微弱极光 */}
                        <div
                          className="absolute top-0 left-0 w-full h-[40%] opacity-5 blur-xl"
                          style={{
                            background: `linear-gradient(180deg, ${gate.color}20, transparent)`,
                          }}
                        />
                      </div>
                    )}

                    {/* 门中央图标 */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center gap-3 px-3">

                      {/* 主图标 */}
                      <motion.div
                        className="text-3xl md:text-4xl"
                        style={{ color: gate.color }}
                        animate={{
                          textShadow: isHovered
                            ? `0 0 30px ${gate.glow}, 0 0 60px ${gate.glow}`
                            : "none",
                          scale: isHovered ? 1.15 : 1,
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {gate.icon}
                      </motion.div>

                      {/* 标题 */}
                      <h2
                        className="
                          text-center text-xs md:text-sm
                          leading-tight tracking-[0.12em] font-serif
                        "
                        style={{ color: gate.color }}
                      >
                        {gate.title.split(" ").map((w, i) => (
                          <span key={i} className="block">{w}</span>
                        ))}
                      </h2>

                      {/* 中文副标题 */}
                      <p
                        className="text-center text-[10px] tracking-[0.1em] opacity-40"
                        style={{ color: gate.color }}
                      >
                        {gate.subtitle}
                      </p>

                      {/* hover 时显示的描述 */}
                      <motion.p
                        className="text-center text-[9px] tracking-[0.08em] leading-relaxed mt-1"
                        style={{ color: `${gate.color}99` }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{
                          opacity: isHovered ? 0.7 : 0,
                          y: isHovered ? 0 : 8,
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {gate.desc}
                      </motion.p>
                    </div>

                    {/* Hover 粒子效果 */}
                    <AnimatePresence>
                      {isHovered && (
                        <>
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 rounded-full pointer-events-none"
                              style={{ backgroundColor: gate.color }}
                              initial={{
                                x: `${30 + Math.random() * 40}%`,
                                y: `${30 + Math.random() * 40}%`,
                                opacity: 0.8,
                                scale: 1,
                              }}
                              animate={{
                                y: `-=${40 + Math.random() * 60}`,
                                x: `${Math.random() * 30 - 15}%`,
                                opacity: 0,
                                scale: 0,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>

                    {/* 底部进入提示 */}
                    <motion.div
                      className="absolute bottom-3 left-0 right-0 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 0.5 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span
                        className="text-[9px] tracking-[0.2em] uppercase"
                        style={{ color: gate.color }}
                      >
                        Enter →
                      </span>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* 底部提示 */}
        <motion.p
          className="mt-12 text-[10px] tracking-[0.3em] text-[#4a3e28] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          Hover to glimpse · Click to enter
        </motion.p>
      </div>
    </main>
  );
}
