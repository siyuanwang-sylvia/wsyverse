"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ═══════════════════ 宇宙语言 ═══════════════════ */
const TYPE_CONFIG = {
  image: { en: "Echoes", cn: "回响", icon: "\u25C7", desc: "Visual memories frozen in time" },
  video: { en: "Fragments", cn: "碎片", icon: "\u25B3", desc: "Moving pieces of your expedition" },
  pdf: { en: "Archives", cn: "档案", icon: "\u25A1", desc: "Preserved documents and records" },
  text: { en: "Field Notes", cn: "野记", icon: "\u25BD", desc: "Thoughts and observations from the journey" },
  audio: { en: "Signals", cn: "信号", icon: "\u25CB", desc: "Resonant frequencies captured" },
  doc: { en: "Archives", cn: "档案", icon: "\u25A1", desc: "Preserved documents and records" },
  other: { en: "Relics", cn: "遗物", icon: "\u2606", desc: "Mysterious artifacts collected" },
};

const EVO_NAMES = {
  0: { en: "UNCHARTED", cn: "未发现" },
  1: { en: "DISCOVERED", cn: "初现" },
  2: { en: "SETTLING", cn: "定居" },
  3: { en: "THRIVING", cn: "繁盛" },
  4: { en: "CIVILIZATION", cn: "文明" },
};

/* ═══════════════════ 主题粒子生成器 ═══════════════════ */
function generateParticles(count, color) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 1.8 + 0.5,
    o: Math.random() * 0.5 + 0.2,
    d: Math.random() * 6 + 3,
    color,
  }));
}

/* ═══════════════════ 主题配置 ═══════════════════ */
const THEME_CONFIGS = {
  "deep-cosmos": {
    bg: "#020818",
    particleColor: "rgba(120,180,220,0.4)",
    nebulaColor: "rgba(40,80,160,0.04)",
    auroraGradient: "from-blue-400/4 via-cyan-400/3 to-transparent",
    arrivalText: "Entering the quiet orbit...",
    accentGlow: "#4a8aaa",
  },
  "ocean-cave": {
    bg: "#020d18",
    particleColor: "rgba(80,180,200,0.4)",
    nebulaColor: "rgba(20,100,140,0.04)",
    auroraGradient: "from-teal-400/4 via-cyan-400/3 to-transparent",
    arrivalText: "Descending into the sound reef...",
    accentGlow: "#4a8a9a",
  },
  "dream-garden": {
    bg: "#020a18",
    particleColor: "rgba(160,120,200,0.4)",
    nebulaColor: "rgba(80,40,120,0.04)",
    auroraGradient: "from-purple-400/4 via-pink-400/3 to-transparent",
    arrivalText: "The garden stirs in recognition...",
    accentGlow: "#7a4a9a",
  },
  "dynamic-terrain": {
    bg: "#020a08",
    particleColor: "rgba(80,180,120,0.4)",
    nebulaColor: "rgba(20,100,60,0.04)",
    auroraGradient: "from-emerald-400/4 via-teal-400/3 to-transparent",
    arrivalText: "The proving ground awakens...",
    accentGlow: "#4a8a5a",
  },
};

export default function IslandPage({ params }) {
  const { island: islandId } = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [showArrival, setShowArrival] = useState(true);

  useEffect(() => {
    fetch(`/api/passion-lab/${islandId}`)
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [islandId]);

  useEffect(() => {
    if (!loading && data) {
      const t = setTimeout(() => setShowArrival(false), 2000);
      return () => clearTimeout(t);
    }
  }, [loading, data]);

  const theme = useMemo(() => {
    if (!data?.theme?.atmosphere) return THEME_CONFIGS["deep-cosmos"];
    return THEME_CONFIGS[data.theme.atmosphere] || THEME_CONFIGS["deep-cosmos"];
  }, [data]);

  const particles = useMemo(
    () => generateParticles(30, theme.particleColor),
    [theme.particleColor]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020510] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.15, 0.6, 0.15], rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="text-3xl text-white/15"
        >
          &#x25C7;
        </motion.div>
      </main>
    );
  }

  if (!data || data.error) {
    return (
      <main className="min-h-screen bg-[#020510] flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-6 text-white/8">&#x25CE;</motion.div>
          <h2 className="text-2xl font-serif mb-4 text-[#5a6a8a]">Island not found</h2>
          <Link href="/passion" className="text-[#5a7aa0] hover:text-[#8ab0d0] transition-colors text-sm font-medium">
            ← Return to the archipelago
          </Link>
        </div>
      </main>
    );
  }

  const level = data.evolution?.level ?? 0;
  const evo = EVO_NAMES[level] || EVO_NAMES[0];
  const sections = data.sections || [];
  const instruments = data.instruments || [];

  // 按类型分组
  const grouped = {};
  data.files.forEach((f) => {
    if (!grouped[f.type]) grouped[f.type] = [];
    grouped[f.type].push(f);
  });
  const activeTypes = Object.keys(grouped).filter((t) => grouped[t].length > 0);

  return (
    <main className="min-h-screen text-[#b8c8d8]" style={{ background: theme.bg }}>
      {/* ═══ 到达动画 ═══ */}
      <AnimatePresence>
        {showArrival && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
            style={{ background: theme.bg }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 70 }}
              className="text-center"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${data.light || "#3a5a8a"}40, ${data.color || "#1a2a4a"})`,
                  border: `1px solid ${data.glow || "#3a5a7a"}30`,
                  boxShadow: `0 0 80px ${data.glow || "#2a4a7a"}30`,
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-white/70">{data.icon || "\u25C7"}</span>
              </motion.div>
              <p className="font-serif text-lg tracking-[0.15em] text-[#8a9aba]">
                {theme.arrivalText}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 背景粒子 ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: p.s, height: p.s, left: `${p.x}%`, top: `${p.y}%`, opacity: p.o, background: p.color }}
            animate={{ opacity: [p.o * 0.2, p.o, p.o * 0.2], scale: [1, 1.3, 1] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: (i * 0.15) % 5 }}
          />
        ))}
      </div>

      {/* ═══ 星云光斑 ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{ width: 500, height: 500, left: "20%", top: "5%", background: theme.nebulaColor }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{ width: 400, height: 400, right: "10%", top: "30%", background: theme.nebulaColor }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{ width: 350, height: 350, left: "55%", bottom: "10%", background: theme.nebulaColor }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* ═══ 极光 ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className={`absolute left-0 right-0 h-[2%] bg-gradient-to-r ${theme.auroraGradient}`}
          style={{ top: "3%", filter: "blur(8px)" }}
          animate={{ x: [0, 80, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute left-0 right-0 h-[1.5%] bg-gradient-to-r ${theme.auroraGradient}`}
          style={{ top: "5%", filter: "blur(6px)" }}
          animate={{ x: [0, -60, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* ═══ 返回键 ═══ */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link href="/passion">
          <motion.div
            whileHover={{ x: -5 }}
            className="px-5 py-3 border border-[#4a6890]/40 rounded-xl bg-[#0a1428]/90 backdrop-blur-lg text-sm uppercase tracking-[0.2em] text-[#7aa0d0] hover:bg-[#4a6890]/20 hover:text-[#c8d8f0] transition-all duration-500"
          >
            ← Archipelago
          </motion.div>
        </Link>
      </motion.div>

      {/* ═══════════════════ 岛屿身份区 ═══════════════════ */}
      <section className="relative pt-28 pb-16 px-6 text-center">
        {/* 岛徽 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 2.2, type: "spring", stiffness: 50 }}
          className="relative inline-block mb-8"
        >
          <motion.div
            className="relative w-36 h-36 mx-auto rounded-full flex items-center justify-center text-5xl"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${data.light || "#3a5a8a"}40, ${data.color || "#1a2a4a"} 65%)`,
              border: `1px solid ${data.glow || "#3a5a7a"}35`,
              boxShadow: `0 0 80px ${data.glow || "#2a4a7a"}25, 0 0 160px ${data.glow || "#2a4a7a"}08`,
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-white/65">{data.icon || "\u25C7"}</span>
            {/* 演化环 */}
            <motion.div
              className="absolute inset-[-10px] rounded-full border border-dashed pointer-events-none"
              style={{ borderColor: `${data.glow || "#3a5a7a"}15` }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            />
            {level >= 3 && (
              <motion.div
                className="absolute inset-[-16px] rounded-full border pointer-events-none"
                style={{ borderColor: `${data.glow || "#3a5a7a"}08` }}
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* 岛名 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] text-[#d0dae8] mb-3"
        >
          {data.name}
        </motion.h1>

        {/* 副标题 */}
        {data.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 1 }}
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#5a7a8a] mb-4"
          >
            {data.subtitle}
          </motion.p>
        )}

        {/* 描述 */}
        {data.desc && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.1, duration: 1 }}
            className="max-w-xl mx-auto text-sm leading-[1.8] text-[#5a7888]"
          >
            {data.desc}
          </motion.p>
        )}

        {/* 演化 + 统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.4, duration: 1 }}
          className="mt-10 flex flex-col items-center gap-5"
        >
          {/* 演化进度 */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((l) => (
              <div key={l} className="flex flex-col items-center gap-1.5">
                <motion.div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: l <= level ? `${data.glow || "#5a8aaa"}` : "rgba(255,255,255,0.04)",
                    boxShadow: l <= level ? `0 0 12px ${data.glow || "#5a8aaa"}35` : "none",
                  }}
                  animate={l <= level ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: l * 0.5 }}
                />
                <span className="text-[7px] uppercase tracking-[0.12em] text-[#3a5a5a]">
                  {EVO_NAMES[l].cn}
                </span>
              </div>
            ))}
          </div>

          {/* 统计徽章 */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {data.features?.map((f, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.6 + i * 0.15 }}
                className="px-3 py-1.5 rounded-full text-[9px] tracking-[0.1em] bg-white/[0.03] border border-white/[0.06] text-[#6a8a9a]"
              >
                {f.label} &middot; {f.count}
              </motion.span>
            ))}
            <span className="px-3 py-1.5 rounded-full text-[9px] tracking-[0.15em] bg-white/[0.02] border border-white/[0.04] text-[#4a5a6a] uppercase">
              {evo.en} &middot; {data.fileCount} relics
            </span>
          </div>
        </motion.div>

        {/* ─── 岛屿子区域导航 ─── */}
        {sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.8, duration: 1 }}
            className="mt-10"
          >
            <p className="text-[8px] uppercase tracking-[0.5em] text-[#2a4a5a] mb-4">
              Island Territories
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(activeSection === sec.id ? null : sec.id)}
                  className={`px-4 py-2 rounded-lg text-[10px] tracking-[0.1em] border transition-all duration-500 flex items-center gap-1.5 ${
                    activeSection === sec.id
                      ? "bg-white/[0.06] text-[#b0c8d8] border-white/[0.12]"
                      : "bg-transparent text-[#5a7a8a] border-white/[0.05] hover:bg-white/[0.03] hover:text-[#8a9aaa]"
                  }`}
                >
                  <span>{sec.icon}</span>
                  <span>{sec.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── 乐器子区域（Sound Reef 专属） ─── */}
        {instruments.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.8, duration: 1 }}
            className="mt-8"
          >
            <p className="text-[8px] uppercase tracking-[0.5em] text-[#2a4a5a] mb-4">
              Sound Chambers
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {instruments.map((inst) => (
                <motion.div
                  key={inst.id}
                  whileHover={{ y: -3 }}
                  className="flex flex-col items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-all duration-500"
                >
                  <span className="text-2xl">{inst.icon}</span>
                  <span className="text-[9px] tracking-[0.12em] text-[#7a9aaa]">{inst.name}</span>
                  <span className="text-[7px] text-[#4a6a7a]">{inst.nameCN}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 内容类型导航 */}
        {activeTypes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 1 }}
            className="mt-8 flex flex-wrap justify-center gap-2"
          >
            {activeTypes.map((type) => {
              const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.other;
              return (
                <button
                  key={type}
                  onClick={() => setActiveSection(activeSection === type ? null : type)}
                  className={`px-4 py-2 rounded-lg text-[9px] uppercase tracking-[0.2em] border transition-all duration-500 ${
                    activeSection === type
                      ? "bg-white/[0.06] text-[#c0d0e0] border-white/[0.12]"
                      : "bg-transparent text-[#5a7a8a] border-white/[0.05] hover:bg-white/[0.03] hover:text-[#8a9aaa]"
                  }`}
                >
                  {cfg.icon} {cfg.en} ({grouped[type].length})
                </button>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* ═══════════════════ 内容区 ═══════════════════ */}
      <section className="px-6 pb-32 max-w-6xl mx-auto">
        {data.files.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.2 }}
            className="text-center py-24 max-w-md mx-auto"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-8 rounded-full border border-white/[0.05]"
            >
              <div className="absolute inset-3 rounded-full border border-white/[0.03]" />
            </motion.div>
            <h3 className="font-serif text-xl tracking-[0.12em] text-[#5a7a8a] mb-4">
              This island is sleeping
            </h3>
            <p className="text-sm leading-8 text-[#3a5a6a] mb-6">
              Drop files into{" "}
              <code className="bg-white/[0.03] px-2 py-0.5 rounded text-[#5a7a8a] text-xs">
                public/passion/{islandId}/
              </code>
              <br />
              and watch it awaken.
            </p>
            {sections.length > 0 && (
              <div className="mt-8 text-left max-w-sm mx-auto">
                <p className="text-[8px] uppercase tracking-[0.3em] text-[#3a5a5a] mb-3 text-center">
                  Ready for exploration
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {sections.map((sec) => (
                    <div key={sec.id} className="flex items-center gap-1.5 px-2 py-1.5 rounded text-[9px] text-[#4a6a7a] bg-white/[0.015]">
                      <span>{sec.icon}</span>
                      <span>{sec.nameCN || sec.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="space-y-16">
            {activeTypes.map((type) => {
              if (activeSection && activeSection !== type) return null;
              const files = grouped[type] || [];
              const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.other;
              if (files.length === 0) return null;

              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8 }}
                >
                  {/* 区块头 */}
                  <div className="flex items-center gap-4 mb-6">
                    <motion.span
                      className="text-xl"
                      animate={{ opacity: [0.5, 0.9, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ color: theme.accentGlow }}
                    >
                      {cfg.icon}
                    </motion.span>
                    <div>
                      <h2 className="font-serif text-base tracking-[0.1em] text-[#a0b8c8]">{cfg.en}</h2>
                      <p className="text-[9px] text-[#5a7a8a] mt-0.5">{cfg.desc}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[8px] uppercase tracking-[0.2em] text-[#3a5a6a] px-2 py-1 rounded-full bg-white/[0.02] border border-white/[0.04]">
                        {files.length} {type === "image" ? "echoes" : type === "video" ? "fragments" : type === "text" ? "notes" : type === "audio" ? "signals" : "records"}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-white/[0.05] via-white/[0.02] to-transparent mb-6" />

                  <div className="columns-1 md:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
                    {files.map((file, idx) => (
                      <motion.div
                        key={file.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: Math.min(idx * 0.04, 0.4) }}
                        className="mb-5 break-inside-avoid"
                      >
                        <RelicCard
                          file={file}
                          type={type}
                          islandColor={data.color}
                          islandGlow={data.glow}
                          theme={theme}
                          onImageClick={setSelectedImage}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════════════ 图片预览 ═══════════════════ */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-[90vw] max-h-[90vh]"
            >
              <img
                src={selectedImage}
                alt="Echo"
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent rounded-b-xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════ 底部 ═══════════════════ */}
      <footer className="text-center pb-12 text-[#2a3a4a] text-[8px] uppercase tracking-[0.4em]">
        {data.name} &middot; {evo.en}
      </footer>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   遗物卡片
   ═══════════════════════════════════════════════════════════════ */
function RelicCard({ file, type, islandColor, islandGlow, theme, onImageClick }) {
  const [expanded, setExpanded] = useState(false);

  let hash = 0;
  for (let i = 0; i < file.name.length; i++) hash = ((hash << 5) - hash + file.name.charCodeAt(i)) | 0;
  const imgHeight = 180 + Math.abs(hash % 120);

  if (type === "image") {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        className="group relative overflow-hidden rounded-xl bg-white/[0.015] backdrop-blur-sm border border-white/[0.05] cursor-pointer"
        onClick={() => onImageClick(file.path)}
      >
        <div className="relative overflow-hidden" style={{ height: imgHeight }}>
          <img src={file.path} alt={file.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-xs text-white/80 truncate">{file.name}</p>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-[#5a7a8a] truncate max-w-[70%]">{file.name}</p>
            <p className="text-[8px] text-[#3a5a6a]">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "video") {
    return (
      <motion.div whileHover={{ y: -3 }}
        className="group relative overflow-hidden rounded-xl bg-white/[0.015] backdrop-blur-sm border border-white/[0.05] p-5">
        <div className="flex items-start gap-4">
          <motion.div className="flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-2xl"
            style={{ background: `${islandGlow || "#2a4a7a"}12` }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >{"\u25B3"}</motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs text-[#b0c0d0] truncate mb-1">{file.name}</h4>
            <p className="text-[9px] text-[#3a5a6a] mb-3">Fragment &middot; {(file.size / 1024 / 1024).toFixed(1)} MB</p>
            <a href={file.path} target="_blank" rel="noopener noreferrer"
              className="inline-block px-3 py-1.5 rounded-lg bg-white/[0.03] text-[9px] uppercase tracking-[0.15em] text-[#7a9aaa] hover:bg-white/[0.06] transition-all duration-500 border border-white/[0.05]">
              Play Fragment
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "pdf" || type === "doc") {
    return (
      <motion.div whileHover={{ y: -3 }}
        className="group relative overflow-hidden rounded-xl bg-white/[0.015] backdrop-blur-sm border border-white/[0.05] p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-16 rounded-lg flex items-center justify-center text-2xl"
            style={{ background: `${islandGlow || "#2a4a7a"}12` }}>
            {"\u25A1"}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs text-[#b0c0d0] truncate mb-1">{file.name}</h4>
            <p className="text-[9px] text-[#3a5a6a] mb-3">Archive &middot; {(file.size / 1024).toFixed(1)} KB</p>
            <div className="flex gap-2">
              <a href={file.path} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-[9px] uppercase tracking-[0.15em] text-[#7a9aaa] hover:bg-white/[0.06] transition-all duration-500 border border-white/[0.05]">
                Read
              </a>
              <a href={file.path} download
                className="px-3 py-1.5 rounded-lg border border-white/[0.05] text-[9px] uppercase tracking-[0.15em] text-[#5a7a8a] hover:bg-white/[0.03] transition-all duration-500">
                Download
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "text") {
    return (
      <motion.div whileHover={{ y: -3 }}
        className="group relative overflow-hidden rounded-xl bg-white/[0.015] backdrop-blur-sm border border-white/[0.05] p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center text-lg">
            {"\u25BD"}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs text-[#b0c0d0] truncate">{file.name}</h4>
            <p className="text-[9px] text-[#3a5a6a] mt-0.5">Field Note &middot; {(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="text-[#3a5a6a] text-xs">
            &#x25BC;
          </motion.span>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="pt-3 border-t border-white/[0.04]">
                <p className="text-[10px] leading-6 text-[#5a7a8a] mb-3">
                  Download to read the full field note.
                </p>
                <a href={file.path} download
                  className="inline-block px-3 py-1.5 rounded-lg bg-white/[0.03] text-[9px] uppercase tracking-[0.15em] text-[#7a9aaa] hover:bg-white/[0.06] transition-all duration-500 border border-white/[0.05]">
                  Download Note
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (type === "audio") {
    return (
      <motion.div whileHover={{ y: -3 }}
        className="group relative overflow-hidden rounded-xl bg-white/[0.015] backdrop-blur-sm border border-white/[0.05] p-5">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{ background: `${islandGlow || "#2a4a7a"}12`, border: `1px solid ${islandGlow || "#2a4a7a"}15` }}
          >{"\u25CB"}</motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs text-[#b0c0d0] truncate">{file.name}</h4>
            <p className="text-[9px] text-[#3a5a6a] mt-0.5">Signal &middot; {(file.size / 1024 / 1024).toFixed(1)} MB</p>
          </div>
          <a href={file.path} download
            className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white/[0.03] text-[9px] uppercase tracking-[0.15em] text-[#7a9aaa] hover:bg-white/[0.06] transition-all duration-500 border border-white/[0.05]">
            Download
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-xl bg-white/[0.015] backdrop-blur-sm border border-white/[0.05] p-5">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/[0.02] flex items-center justify-center text-lg">
          {"\u2606"}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs text-[#b0c0d0] truncate">{file.name}</h4>
          <p className="text-[9px] text-[#3a5a6a] mt-0.5">Relic &middot; {(file.size / 1024).toFixed(1)} KB</p>
        </div>
        <a href={file.path} download
          className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white/[0.03] text-[9px] uppercase tracking-[0.15em] text-[#7a9aaa] hover:bg-white/[0.06] transition-all duration-500 border border-white/[0.05]">
          Download
        </a>
      </div>
    </motion.div>
  );
}
