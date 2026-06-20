"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════
   固定粒子（SSR 安全）
   ═══════════════════════════════════════════ */

const PARTICLES = [
  { x: 12, y:  8, s: 1.5, o: 0.06, d: 20 },
  { x: 78, y: 34, s: 1.0, o: 0.09, d: 24 },
  { x: 42, y: 65, s: 2.0, o: 0.05, d: 18 },
  { x: 56, y: 41, s: 1.2, o: 0.10, d: 22 },
  { x: 72, y: 79, s: 1.8, o: 0.04, d: 25 },
  { x: 20, y: 88, s: 1.0, o: 0.07, d: 19 },
  { x: 93, y: 55, s: 1.5, o: 0.06, d: 21 },
  { x: 45, y: 18, s: 1.2, o: 0.08, d: 23 },
  { x: 68, y: 92, s: 2.0, o: 0.07, d: 17 },
  { x:  8, y: 48, s: 1.0, o: 0.13, d: 26 },
  { x: 29, y: 34, s: 1.5, o: 0.09, d: 16 },
  { x: 81, y: 14, s: 1.2, o: 0.10, d: 24 },
  { x: 53, y: 71, s: 1.8, o: 0.06, d: 20 },
  { x: 16, y: 57, s: 1.0, o: 0.12, d: 22 },
  { x: 76, y: 38, s: 1.5, o: 0.08, d: 18 },
  { x: 40, y: 82, s: 1.2, o: 0.11, d: 19 },
  { x: 62, y: 25, s: 2.0, o: 0.07, d: 21 },
  { x:  5, y: 73, s: 1.0, o: 0.09, d: 15 },
  { x: 91, y: 86, s: 1.5, o: 0.05, d: 23 },
  { x: 38, y:  5, s: 1.2, o: 0.10, d: 17 },
];

/* ═══════════════════════════════════════════
   Persona Chamber
   ═══════════════════════════════════════════ */

export default function Persona() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-[#e8d7b5]">

      {/* 返回键 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link href="/soul">
          <motion.div
            whileHover={{ x: -4 }}
            className="px-5 py-3 border border-[#8d7753]/40 rounded-xl bg-[#0b1020]/90 backdrop-blur-lg text-sm uppercase tracking-[0.2em] text-[#d6b77a] hover:bg-[#8d7753]/20 hover:text-[#ffe7b0] transition-all duration-500"
          >
            ← Soul
          </motion.div>
        </Link>
      </motion.div>

      {/* ── 背景层 ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#161b2e_0%,#090b14_50%,#050816_100%)]" />
      <div className="absolute top-[-10%] right-[15%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#d6b77a]/3 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-[#1a1410]/80 blur-3xl" />

      {/* ── 漂浮灰尘 ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
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
              y: [0, -25, 0],
              opacity: [p.o * 0.3, p.o, p.o * 0.3],
            }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* ── 返回按钮 ── */}
      <Link
        href="/soul"
        className="absolute left-8 top-8 z-20 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#6f6249] transition-colors duration-500 hover:text-[#d6b77a]"
      >
        <span className="text-base">←</span>
        <span>Soul Realm</span>
      </Link>

      {/* ── 主内容 ── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">

        {/* 镜面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="text-center"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.65em] text-[#8d7753]">
            Mirror of the Self
          </p>

          <h1 className="font-serif text-4xl tracking-[0.22em] text-[#ffe7b0] md:text-6xl">
            PERSONA
          </h1>

          <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-[#8d7753]/60 to-transparent" />
        </motion.div>

        {/* 镜子空间 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 2, ease: "easeOut" }}
          className="mt-16 flex flex-col items-center"
        >
          {/* 镜框 */}
          <div className="relative w-[200px] h-[280px] md:w-[260px] md:h-[360px] rounded-2xl border border-[#8d7753]/20 bg-[#0b1020]/80 backdrop-blur-md overflow-hidden">
            {/* 内光 */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#d6b77a08_0%,transparent_70%)]" />
            {/* 镜面反射线 */}
            <div className="absolute top-[20%] left-[15%] right-[40%] h-px bg-gradient-to-r from-[#d6b77a]/10 to-transparent rotate-[-15deg]" />
            <div className="absolute top-[35%] left-[10%] right-[50%] h-px bg-gradient-to-r from-[#d6b77a]/5 to-transparent rotate-[-20deg]" />
            {/* 中心符文 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  opacity: [0.15, 0.4, 0.15],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl text-[#d6b77a]/20"
              >
                🜂
              </motion.div>
            </div>
            {/* 四角装饰 */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#8d7753]/20" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#8d7753]/20" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#8d7753]/20" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#8d7753]/20" />
          </div>

          {/* 镜下文字 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 2 }}
            className="mt-10 text-center"
          >
            <p className="text-xs tracking-[0.3em] text-[#5e5442] mb-3 uppercase">
              The Chamber is Sealed
            </p>
            <p className="max-w-sm text-sm leading-8 text-[#6f6249]">
              你还没有准备好面对镜中的自己。<br />
              当你准备好时，这里会自动开启。
            </p>

            <div className="mt-6 mx-auto h-px w-16 bg-[#8d7753]/20" />

            <p className="mt-6 text-[10px] uppercase tracking-[0.45em] text-[#3d3529]">
              Construction in progress
            </p>
          </motion.div>
        </motion.div>

      </section>

      {/* 底部低语 */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-[#3d3328]">
          To know thyself is the beginning of all wisdom
        </p>
      </div>

    </main>
  );
}
