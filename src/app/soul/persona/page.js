"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

/* ═════════════════════════════════════════
   固定粒子（SSR 安全）
   ═════════════════════════════════════════ */

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

const CORRECT_PASSWORD = "Be yourself";

/* ═════════════════════════════════════════
   Persona Chamber — 密码保护版
   ═════════════════════════════════════════ */

export default function Persona() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [entering, setEntering] = useState(false);

  // 页面加载时检查 sessionStorage 是否已认证过
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("persona_auth");
      if (saved === "ok") setIsAuthenticated(true);
    } catch {}
  }, []);

  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    setEntering(true);
    setTimeout(() => {
      if (password.trim() === CORRECT_PASSWORD) {
        setIsAuthenticated(true);
        try { sessionStorage.setItem("persona_auth", "ok"); } catch {}
      } else {
        setError(true);
        setPassword("");
      }
      setEntering(false);
    }, 800);
  }, [password]);

  /* ── 未认证：密码输入页 ─────────────────────────── */
  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050816] text-[#e8d7b5]">
        {/* 背景层 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#161b2e_0%,#090b14_50%,#050816_100%)]" />
        <div className="absolute top-[-10%] right-[15%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#d6b77a]/3 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-[#1a1410]/80 blur-3xl" />

        {/* 漂浮灰尘 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#ffe7b0]"
              style={{ width: p.s, height: p.s, left: `${p.x}%`, top: `${p.y}%`, opacity: p.o }}
              animate={{ y: [0, -25, 0], opacity: [p.o * 0.3, p.o, p.o * 0.3] }}
              transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
          ))}
        </div>

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

        {/* 密码输入区 */}
        <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full max-w-sm text-center"
          >
            {/* 镜框图标 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-10 inline-block"
            >
              <div className="relative w-24 h-32 rounded-2xl border border-[#8d7753]/25 bg-[#0b1020]/80 backdrop-blur-md overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#d6b77a08_0%,transparent_70%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-4xl text-[#d6b77a]/20"
                  >
                    &#x25C7;
                  </motion.div>
                </div>
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#8d7753]/20" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#8d7753]/20" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#8d7753]/20" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#8d7753]/20" />
              </div>
            </motion.div>

            {/* 标题 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.2 }}
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.5em] text-[#5e5442]">
                Persona Chamber
              </p>
              <h1 className="font-serif text-2xl tracking-[0.15em] text-[#d6b77a]">
                PERSONA
              </h1>
              <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-[#8d7753]/50 to-transparent" />
            </motion.div>

            {/* 提示语 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-sm leading-8 text-[#7a6e5e]"
            >
              这面镜子只映照愿意坦白的人。
              <br />
              <span className="text-[#5e5442] text-xs">Tell me who you are.</span>
            </motion.p>

            {/* 密码输入框 */}
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 1 }}
              onSubmit={handleSubmit}
              className="mt-8 relative"
            >
              <input
                type="text"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="enter the password..."
                className={`w-full px-5 py-3 rounded-xl bg-[#0b1020]/80 border text-center text-sm tracking-[0.15em] uppercase font-serif transition-all duration-500 focus:outline-none ${
                  error
                    ? "border-red-700/50 text-red-400/80 placeholder:text-red-700/30"
                    : "border-[#8d7753]/30 text-[#d6b77a] placeholder:text-[#5e5442] focus:border-[#d6b77a]/50 focus:bg-[#0b1020]"
                }`}
                style={{ fontFamily: "serif" }}
                autoFocus
              />
              <button
                type="submit"
                disabled={entering || !password.trim()}
                className="mt-4 px-8 py-2.5 rounded-xl border border-[#8d7753]/35 text-[10px] uppercase tracking-[0.35em] text-[#8d7753] hover:bg-[#d6b77a]/10 hover:text-[#d6b77a] hover:border-[#d6b77a]/50 transition-all duration-500 disabled:opacity-30"
              >
                {entering ? "⋯" : "Enter the Mirror"}
              </button>

              {/* 错误提示 */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-0 right-0 top-[calc(100%+8px)] text-[10px] uppercase tracking-[0.3em] text-red-400/60"
                  >
                    wrong answer. try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>

            {/* 底部低语 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="mt-10 text-[9px] uppercase tracking-[0.4em] text-[#3d3529]"
            >
              hint: who are you when no one is watching?
            </motion.p>
          </motion.div>
        </section>
      </main>
    );
  }

  /* ── 已认证：镜面内容 ─────────────────────────────── */
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
            style={{ width: p.s, height: p.s, left: `${p.x}%`, top: `${p.y}%`, opacity: p.o }}
            animate={{ y: [0, -25, 0], opacity: [p.o * 0.3, p.o, p.o * 0.3] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>

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
                animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl text-[#d6b77a]/20"
              >
                &#x25C7;
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
              The Chamber is Open
            </p>
            <p className="max-w-sm text-sm leading-8 text-[#6f6249]">
              你已通过镜面。<br />
              现在，面对你自己。
            </p>

            <div className="mt-6 mx-auto h-px w-16 bg-[#8d7753]/20" />

            {/* 登出按钮 */}
            <button
              onClick={() => {
                setIsAuthenticated(false);
                try { sessionStorage.removeItem("persona_auth"); } catch {}
              }}
              className="mt-6 text-[10px] uppercase tracking-[0.4em] text-[#3d3529] hover:text-[#5e5442] transition-colors"
            >
              ← leave the mirror
            </button>
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
