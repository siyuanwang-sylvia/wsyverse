"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const gates = [
  {
    title: "ARCHIVE",
    subtitle: "心理档案馆",
    desc: "荣格 · 潜意识 · 禁书区",
    href: "/soul/archive",
    symbol: "✦",
    label: "Psychological Archive",
  },
  {
    title: "DRIFT STREAM",
    subtitle: "意识漂流",
    desc: "深夜漂流瓶 · 匿名树洞",
    href: "/soul/drift",
    symbol: "☽",
    label: "Drift & Release",
  },
  {
    title: "TEST BASE",
    subtitle: "灵魂测验台",
    desc: "MBTI · 九型 · 心理探索",
    href: "/soul/tests",
    symbol: "⟁",
    label: "Psychological Tests",
  },
  {
    title: "PERSONA",
    subtitle: "人格镜像室",
    desc: "解密 · Shadow · 自我原型",
    href: "/soul/persona",
    symbol: "🜂",
    label: "Persona Chamber",
  },
];

export default function Soul() {
  // 粒子位置固定化，避免 SSR/hydration 警告
  const particles = [
    { x: 12, y: 8, s: 1.5, o: 0.08, d: 18 },
    { x: 87, y: 22, s: 1, o: 0.12, d: 22 },
    { x: 34, y: 65, s: 2, o: 0.07, d: 16 },
    { x: 56, y: 41, s: 1.2, o: 0.10, d: 20 },
    { x: 72, y: 79, s: 1.8, o: 0.06, d: 25 },
    { x: 20, y: 88, s: 1, o: 0.09, d: 19 },
    { x: 93, y: 55, s: 1.5, o: 0.11, d: 17 },
    { x: 45, y: 18, s: 1.2, o: 0.08, d: 23 },
    { x: 68, y: 92, s: 2, o: 0.07, d: 21 },
    { x: 8, y: 48, s: 1, o: 0.13, d: 15 },
    { x: 29, y: 34, s: 1.5, o: 0.09, d: 18 },
    { x: 81, y: 14, s: 1.2, o: 0.10, d: 24 },
    { x: 53, y: 71, s: 1.8, o: 0.06, d: 20 },
    { x: 16, y: 57, s: 1, o: 0.12, d: 17 },
    { x: 76, y: 38, s: 1.5, o: 0.08, d: 22 },
    { x: 40, y: 82, s: 1.2, o: 0.11, d: 19 },
    { x: 62, y: 25, s: 2, o: 0.07, d: 16 },
    { x: 5, y: 73, s: 1, o: 0.09, d: 26 },
    { x: 91, y: 86, s: 1.5, o: 0.08, d: 21 },
    { x: 38, y: 5, s: 1.2, o: 0.10, d: 18 },
    { x: 24, y: 95, s: 1.8, o: 0.06, d: 23 },
    { x: 78, y: 62, s: 1, o: 0.13, d: 20 },
    { x: 50, y: 48, s: 1.5, o: 0.07, d: 15 },
    { x: 14, y: 29, s: 1.2, o: 0.11, d: 24 },
    { x: 97, y: 44, s: 2, o: 0.08, d: 17 },
    { x: 61, y: 11, s: 1, o: 0.09, d: 22 },
    { x: 33, y: 76, s: 1.5, o: 0.10, d: 19 },
    { x: 85, y: 31, s: 1.2, o: 0.07, d: 25 },
    { x: 47, y: 58, s: 1.8, o: 0.12, d: 16 },
    { x: 3, y: 16, s: 1, o: 0.08, d: 21 },
  ];

  return (
    <main className="relative h-screen overflow-hidden bg-[#050816] text-[#e8d7b5]">

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
            className="px-5 py-3 border border-[#8d7753]/40 rounded-xl bg-[#0b1020]/90 backdrop-blur-lg text-sm uppercase tracking-[0.2em] text-[#d6b77a] hover:bg-[#8d7753]/20 hover:text-[#ffe7b0] transition-all duration-500"
          >
            ← Universe
          </motion.div>
        </Link>
      </motion.div>

      {/* 深层空间背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#161b2e_0%,#090b14_45%,#050816_100%)]" />

      {/* 顶部体积光晕 */}
      <div className="absolute top-[-10%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#d6b77a]/4 blur-3xl" />

      {/* 左下暗部 */}
      <div className="absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-[#1a1410] blur-3xl opacity-70" />

      {/* 漂浮灰尘 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#ffe7b0]"
            style={{
              width: p.s,
              height: p.s,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.o,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [p.o * 0.4, p.o, p.o * 0.4],
            }}
            transition={{
              duration: p.d,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* 主空间：撑满视口，flex 垂直居中 */}
      <section className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-10">

        {/* 标题区 — 紧凑版 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-[10px] uppercase tracking-[0.6em] text-[#8d7753]">
            Hidden Consciousness Archive
          </p>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-[0.18em] text-[#ffe7b0]">
            SOUL REALM
          </h1>

          <div className="mt-4 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#8d7753]/50 to-transparent" />

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#9e9278]">
            A silent archive hidden beneath time — where memory, dreams,
            and fragmented selves breathe in the dark.
          </p>
        </motion.div>

        {/* 四道门 — 横排四列 */}
        <div className="grid w-full max-w-5xl grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {gates.map((gate, index) => (
            <motion.div
              key={gate.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + index * 0.15,
                duration: 1.4,
              }}
            >
              <Link href={gate.href}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                  className="group relative overflow-hidden rounded-2xl border border-[#8d7753]/25 bg-[#0b1020]/80 backdrop-blur-md cursor-pointer"
                  style={{ height: "clamp(200px, 28vh, 280px)" }}
                >
                  {/* hover 内光 */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#d6b77a0d_0%,transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                  {/* 金色流光 */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-16 top-0 h-full w-16 rotate-12 bg-gradient-to-r from-transparent via-[#ffe7b018] to-transparent blur-xl transition-all duration-[2500ms] group-hover:left-[120%]" />
                  </div>

                  {/* 底部光晕 */}
                  <div className="absolute bottom-[-20%] left-1/2 h-[150px] w-[150px] -translate-x-1/2 rounded-full bg-[#d6b77a]/8 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                  {/* 内门框 */}
                  <div className="absolute inset-3 rounded-xl border border-[#8d7753]/15" />

                  {/* 内容 */}
                  <div className="relative z-10 flex h-full flex-col justify-between p-5">

                    {/* 顶部 — 符号 + 小标签 */}
                    <div className="flex items-start justify-between">
                      <span className="text-2xl text-[#d6b77a]/70 leading-none">
                        {gate.symbol}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#5e5442]">
                        {gate.label}
                      </span>
                    </div>

                    {/* 底部 — 标题区 */}
                    <div>
                      <div className="mb-3 h-px w-10 bg-[#8d7753]/35" />

                      <h2 className="font-serif text-base md:text-lg tracking-[0.08em] text-[#ffe7b0] leading-tight">
                        {gate.title}
                      </h2>

                      <p className="mt-1.5 text-xs text-[#c8b48a]/80">
                        {gate.subtitle}
                      </p>

                      <p className="mt-2 text-[10px] leading-5 text-[#7a6d57]">
                        {gate.desc}
                      </p>

                      <div className="mt-3 text-[9px] uppercase tracking-[0.4em] text-[#4a3f30] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        Enter ›
                      </div>
                    </div>

                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 底部低语 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 2 }}
          className="mt-8 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-[#3d3529]">
            Some memories were never meant to disappear
          </p>
        </motion.div>

      </section>
    </main>
  );
}
