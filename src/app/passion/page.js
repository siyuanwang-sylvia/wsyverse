"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ═══════════════════ 星空（客户端生成，避免 SSR hydration 不匹配） ═══════════════════ */
function generateStars(count = 80) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 2 + 0.5,
    o: Math.random() * 0.6 + 0.2,
    d: Math.random() * 6 + 3,
  }));
}

/* ═══════════════════ 星云 ═══════════════════ */
const NEBULAE = [
  { x: 10, y: 15, w: 500, h: 350, color: "rgba(40,60,140,0.04)", d: 40 },
  { x: 60, y: 10, w: 420, h: 300, color: "rgba(80,40,120,0.03)", d: 35 },
  { x: 30, y: 5, w: 350, h: 250, color: "rgba(30,90,130,0.03)", d: 45 },
  { x: 75, y: 20, w: 380, h: 280, color: "rgba(60,30,100,0.04)", d: 38 },
  { x: 45, y: 8, w: 300, h: 200, color: "rgba(50,70,150,0.03)", d: 42 },
];

/* ═══════════════════ 极光 ═══════════════════ */
const AURORA_BANDS = [
  { y: 2, h: 3, gradient: "from-cyan-400/6 via-blue-500/3 to-transparent", drift: 100, d: 22 },
  { y: 4, h: 2, gradient: "from-purple-400/5 via-teal-400/3 to-transparent", drift: -70, d: 28 },
  { y: 6, h: 2.5, gradient: "from-emerald-400/4 via-indigo-400/3 to-transparent", drift: 50, d: 20 },
  { y: 1, h: 1.5, gradient: "from-pink-400/4 via-blue-400/2 to-transparent", drift: -40, d: 25 },
];

/* ═══════════════════ 星轨 ═══════════════════ */
const ORBITS = [
  { cx: 50, cy: 50, rx: 44, ry: 16, rot: -12, d: 140 },
  { cx: 50, cy: 50, rx: 32, ry: 28, rot: 8, d: 100 },
  { cx: 50, cy: 50, rx: 50, ry: 10, rot: 20, d: 170 },
  { cx: 50, cy: 50, rx: 38, ry: 22, rot: -5, d: 120 },
];

/* ═══════════════════ 海浪线 ═══════════════════ */
const WAVES = Array.from({ length: 8 }, (_, i) => ({
  y: 55 + i * 5,
  o: 0.08 - i * 0.008,
  d: 10 + i * 2,
  delay: i * 1.2,
}));

/* ═══════════════════ 演化视觉配置 ═══════════════════ */
const EVO_VISUAL = {
  0: { ringOpacity: 0.1, glowSize: 20, label: "UNCHARTED", labelCN: "未发现" },
  1: { ringOpacity: 0.2, glowSize: 40, label: "DISCOVERED", labelCN: "初现" },
  2: { ringOpacity: 0.35, glowSize: 60, label: "SETTLING", labelCN: "定居" },
  3: { ringOpacity: 0.5, glowSize: 80, label: "THRIVING", labelCN: "繁盛" },
  4: { ringOpacity: 0.7, glowSize: 110, label: "CIVILIZATION", labelCN: "文明" },
};

/* ═══════════════════ 固定岛屿位置（群岛布局） ═══════════════════ */
const ISLAND_POSITIONS = {
  celestarium: { x: 22, y: 28 },
  "the-sound-reef": { x: 72, y: 24 },
  "motion-garden": { x: 38, y: 46 },
  playground: { x: 60, y: 50 },
};

function getIslandPos(islandId, index, total) {
  if (ISLAND_POSITIONS[islandId]) return ISLAND_POSITIONS[islandId];
  // Fallback for unknown islands: golden spiral
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const r = 18 + Math.sqrt(index / Math.max(total, 1)) * 25;
  const angle = index * goldenAngle;
  return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
}

export default function TheArchipelago() {
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIsland, setHoveredIsland] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setMounted(true);
    setStars(generateStars(80));
  }, []);

  useEffect(() => {
    fetch("/api/passion-lab")
      .then((res) => res.json())
      .then((data) => {
        setIslands(data.islands || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="relative min-h-screen scrollable-page bg-[#020510] text-[#b8c8d8] select-none">
      {/* ═══════════════════ 层级 0：深空背景 ═══════════════════ */}
      <div className="absolute inset-0 bg-[#020510]" />

      {/* ═══════════════════ 层级 1：星空 ═══════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={mounted ? { rotate: [0, 360] } : {}}
          transition={{ duration: 600, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50% 50%" }}
        >
          {stars.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{ width: p.s, height: p.s, left: `${p.x}%`, top: `${p.y}%`, opacity: p.o }}
              animate={{ opacity: [p.o * 0.3, p.o, p.o * 0.3], scale: [1, 1.4, 1] }}
              transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: (i * 0.13) % 5 }}
            />
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════ 层级 2：星云 ═══════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {NEBULAE.map((n, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{ width: n.w, height: n.h, left: `${n.x}%`, top: `${n.y}%`, background: n.color }}
            animate={{ x: [0, 25, 0], y: [0, -15, 0], scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: n.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ═══════════════════ 层级 3：极光 ═══════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {AURORA_BANDS.map((a, i) => (
          <motion.div
            key={i}
            className={`absolute left-0 right-0 bg-gradient-to-r ${a.gradient}`}
            style={{ top: `${a.y}%`, height: `${a.h}%`, filter: "blur(8px)" }}
            animate={{ x: [0, a.drift, 0], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: a.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ═══════════════════ 层级 4：星轨 ═══════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {ORBITS.map((orbit, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/[0.025]"
            style={{
              left: `${orbit.cx}%`, top: `${orbit.cy}%`,
              width: `${orbit.rx * 2}%`, height: `${orbit.ry * 2}%`,
              marginLeft: `-${orbit.rx}%`, marginTop: `-${orbit.ry}%`,
            }}
            animate={{ rotate: [orbit.rot, orbit.rot + 360] }}
            transition={{ duration: orbit.d, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* ═══════════════════ 层级 5：宇宙海洋 ═══════════════════ */}
      {/* 海面分隔线（地平线） */}
      <div className="absolute left-0 right-0 pointer-events-none" style={{ top: "54%" }}>
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mt-1"
          animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.9, 1.1, 0.9] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* 海面渐变 */}
      <div className="absolute left-0 right-0 pointer-events-none" style={{ top: "54%", bottom: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020818]/90 via-[#030d1a]/95 to-[#020810]" />
        {/* 深海光 */}
        <motion.div
          className="absolute left-1/4 w-[50%] h-px"
          style={{ top: "5%" }}
          animate={{ opacity: [0, 0.3, 0], scaleX: [0.8, 1.2, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </motion.div>
      </div>

      {/* 海浪动画 */}
      {WAVES.map((w, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ top: `${w.y}%` }}
          animate={{
            opacity: [w.o * 0.5, w.o, w.o * 0.5],
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${w.o * 0.5}) 20%, rgba(255,255,255,${w.o}) 50%, rgba(255,255,255,${w.o * 0.5}) 80%, transparent 100%)`,
          }}
          transition={{ duration: w.d, repeat: Infinity, ease: "easeInOut", delay: w.delay }}
        />
      ))}

      {/* ═══════════════════ 层级 6：雾气（海面上） ═══════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`fog-${i}`}
            className="absolute h-[8%] rounded-full bg-white/[0.015] blur-xl"
            style={{
              left: `${(i * 18) % 90}%`,
              top: `${48 + i * 3}%`,
              width: `${25 + (i % 3) * 15}%`,
            }}
            animate={{
              x: [0, (i % 2 === 0 ? 40 : -40), 0],
              opacity: [0.3, 0.7, 0.3],
              scaleX: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 18 + i * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3,
            }}
          />
        ))}
      </div>

      {/* ═══════════════════ 层级 7：漂浮群岛 ═══════════════════ */}
      <div className="absolute inset-0" style={{ top: "5%", bottom: "55%" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ opacity: [0.2, 0.7, 0.2], rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="text-3xl text-white/15"
            >
              &#x25C7;
            </motion.div>
          </div>
        ) : islands.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 mb-8 rounded-full border border-white/[0.05]"
            >
              <div className="absolute inset-3 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-8 rounded-full border border-white/[0.02]" />
            </motion.div>
            <p className="font-serif text-lg tracking-[0.15em] text-[#4a5a6a]">
              The ocean awaits its first island
            </p>
            <p className="text-[10px] text-[#2a3a4a] mt-3 tracking-[0.2em] uppercase">
              Create a folder in public/passion/
            </p>
          </div>
        ) : (
          islands.map((island, index) => (
            <FloatingIsland
              key={island.id}
              island={island}
              position={getIslandPos(island.id, index, islands.length)}
              index={index}
              isHovered={hoveredIsland === island.id}
              onHover={setHoveredIsland}
            />
          ))
        )}
      </div>

      {/* ═══════════════════ 层级 8：岛屿水面倒影 ═══════════════════ */}
      <div className="absolute inset-0 pointer-events-none" style={{ top: "55%" }}>
        {islands.map((island) => {
          const pos = getIslandPos(island.id, islands.indexOf(island), islands.length);
          const level = island.evolution?.level ?? 0;
          const vis = EVO_VISUAL[level];
          const size = island.evolution?.size || 80;
          // Only show reflection if island is above horizon
          const reflectY = 55 + ((55 - pos.y) * 0.3);
          if (pos.y > 55) return null;
          return (
            <motion.div
              key={`refl-${island.id}`}
              className="absolute rounded-full"
              style={{
                width: size * 0.7,
                height: size * 0.25,
                left: `${pos.x}%`,
                top: `${reflectY}%`,
                transform: "translate(-50%, 0)",
                background: `radial-gradient(ellipse, ${island.glow || "#2a4a7a"}15 0%, transparent 80%)`,
                filter: "blur(6px)",
              }}
              animate={{ opacity: [0.15, 0.35, 0.15], scaleY: [0.6, 1, 0.6] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}
      </div>

      {/* ═══════════════════ UI：返回键 ═══════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link href="/">
          <motion.div
            whileHover={{ x: -5 }}
            className="px-5 py-3 border border-[#4a6890]/40 rounded-xl bg-[#0a1428]/90 backdrop-blur-lg text-sm uppercase tracking-[0.2em] text-[#7aa0d0] hover:bg-[#4a6890]/20 hover:text-[#c8d8f0] transition-all duration-500"
          >
            ← Universe
          </motion.div>
        </Link>
      </motion.div>

      {/* ═══════════════════ UI：标题区 ═══════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 pt-24 text-center z-40 pointer-events-none"
      >
        <p className="text-[9px] uppercase tracking-[0.7em] text-[#3a5a6a] mb-3">
          Passion Laboratory
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] text-[#c0d0e0] mb-2">
          THE ARCHIPELAGO
        </h1>
        <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent mb-3" />
        <p className="text-[10px] tracking-[0.25em] text-[#4a6a7a]">
          Every passion breathes as its own island
        </p>
      </motion.div>

      {/* ═══════════════════ UI：底部图例 ═══════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute bottom-8 left-0 right-0 text-center z-40 pointer-events-none"
      >
        <div className="inline-flex items-center gap-6 px-6 py-3 rounded-full bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
          {Object.entries(EVO_VISUAL).map(([level, vis]) => (
            <div key={level} className="flex flex-col items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: `rgba(160,200,220,${vis.ringOpacity})`,
                  boxShadow: `0 0 ${vis.glowSize * 0.2}px rgba(160,200,220,${vis.ringOpacity * 0.5})`,
                }}
              />
              <span className="text-[7px] uppercase tracking-[0.15em] text-[#3a4a5a]">{vis.labelCN}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[8px] uppercase tracking-[0.4em] text-[#1a2a3a]">
          The Unknown Island always waits in the deep
        </p>
      </motion.div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   漂浮岛屿组件
   ═══════════════════════════════════════════════════════════════ */
function FloatingIsland({ island, position, index, isHovered, onHover }) {
  const level = island.evolution?.level ?? 0;
  const vis = EVO_VISUAL[level] || EVO_VISUAL[0];
  const size = island.evolution?.size || 80;
  const actualSize = Math.max(80, size);
  const icon = island.icon || "\u25C7";

  // 岛屿不规则形状参数
  const wobbleParams = [
    { rx: 1.0, ry: 1.0 },
    { rx: 1.08, ry: 0.94 },
    { rx: 0.93, ry: 1.05 },
    { rx: 1.05, ry: 0.97 },
  ];
  const wobble = wobbleParams[index % wobbleParams.length];

  return (
    <Link href={`/passion/${island.id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 1.5,
          delay: 0.6 + index * 0.3,
          type: "spring",
          stiffness: 50,
          damping: 15,
        }}
        onMouseEnter={() => onHover(island.id)}
        onMouseLeave={() => onHover(null)}
        className="absolute cursor-pointer group"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
          zIndex: isHovered ? 30 : 10,
        }}
      >
        {/* ─── 大气层光晕 ─── */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: actualSize * 2.2,
            height: actualSize * 2.2,
            left: "50%", top: "50%",
            marginLeft: -(actualSize * 2.2) / 2,
            marginTop: -(actualSize * 2.2) / 2,
            background: `radial-gradient(circle, ${island.glow || "#3a5a8a"}20 0%, ${island.glow || "#3a5a8a"}05 40%, transparent 70%)`,
            boxShadow: `0 0 ${vis.glowSize}px ${island.glow || "#2a4a7a"}15`,
            filter: "blur(4px)",
          }}
          animate={{
            scale: isHovered ? [1, 1.12, 1] : [1, 1.05, 1],
            opacity: isHovered ? 0.9 : 0.6,
          }}
          transition={{ duration: isHovered ? 2.5 : 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ─── 演化环（外层） ─── */}
        {level >= 1 && (
          <motion.div
            className="absolute rounded-full border border-dashed pointer-events-none"
            style={{
              width: actualSize * 1.8,
              height: actualSize * 1.8,
              left: "50%", top: "50%",
              marginLeft: -(actualSize * 1.8) / 2,
              marginTop: -(actualSize * 1.8) / 2,
              borderColor: `rgba(160,200,220,${vis.ringOpacity * 0.5})`,
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 50 + level * 15, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* ─── 第二演化环（高级别） ─── */}
        {level >= 3 && (
          <motion.div
            className="absolute rounded-full border pointer-events-none"
            style={{
              width: actualSize * 2.0,
              height: actualSize * 2.0,
              left: "50%", top: "50%",
              marginLeft: -(actualSize * 2.0) / 2,
              marginTop: -(actualSize * 2.0) / 2,
              borderColor: `rgba(160,200,220,${vis.ringOpacity * 0.25})`,
            }}
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* ─── 漂浮碎片（高级别） ─── */}
        {level >= 2 && (
          <>
            <FloatingFragment
              size={actualSize * 0.15}
              offsetX={actualSize * 0.6}
              offsetY={-actualSize * 0.3}
              color={island.glow}
              orbitDuration={12 + index}
              delay={0}
            />
            <FloatingFragment
              size={actualSize * 0.1}
              offsetX={-actualSize * 0.5}
              offsetY={actualSize * 0.35}
              color={island.light}
              orbitDuration={15 + index}
              delay={1.5}
            />
            {level >= 4 && (
              <FloatingFragment
                size={actualSize * 0.12}
                offsetX={actualSize * 0.3}
                offsetY={actualSize * 0.5}
                color={island.glow}
                orbitDuration={18 + index}
                delay={3}
              />
            )}
          </>
        )}

        {/* ─── 岛屿主体 ─── */}
        <motion.div
          className="relative rounded-full overflow-visible"
          style={{
            width: actualSize,
            height: actualSize,
          }}
          animate={{
            y: [0, -6, 0],
            rotate: [0, 0.5, 0, -0.5, 0],
          }}
          transition={{
            y: { duration: 4 + index * 0.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
            rotate: { duration: 8 + index, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {/* 岛屿地表 */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: actualSize,
              height: actualSize,
              background: `radial-gradient(circle at 40% 35%, ${island.light || "#4a6a9a"}50 0%, ${island.color || "#1a2a4a"} 50%, ${island.color || "#0a1a3a"} 95%)`,
              border: `1px solid ${island.glow || "#3a5a7a"}${isHovered ? "50" : "25"}`,
              boxShadow: `0 0 ${vis.glowSize / 2}px ${island.glow || "#2a4a7a"}20, inset 0 ${actualSize * 0.1}px ${actualSize * 0.3}px ${island.color || "#1a2a4a"}90`,
              transform: isHovered ? `scaleX(${wobble.rx}) scaleY(${wobble.ry})` : "scale(1)",
            }}
            transition={{ duration: 0.8 }}
          />

          {/* 岛屿表面纹理 */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none" style={{ opacity: 0.3 }}>
            {/* 高地 */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: `${50 + (index % 3) * 10}%`,
                height: `${40 + (index % 4) * 8}%`,
                top: `${15 + (index % 3) * 5}%`,
                left: `${20 + (index % 2) * 8}%`,
                background: `radial-gradient(circle, ${island.glow || "#4a6a9a"}40, transparent)`,
              }}
            />
            {/* 低地 */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: `${35 + (index % 3) * 8}%`,
                height: `${30 + (index % 2) * 6}%`,
                bottom: `${20 + (index % 4) * 3}%`,
                right: `${15 + (index % 2) * 10}%`,
                background: `radial-gradient(circle, ${island.light || "#5a7aaa"}20, transparent)`,
              }}
            />
            {/* 环形山 */}
            {level >= 2 && (
              <motion.div
                className="absolute rounded-full border"
                style={{
                  width: `${12 + (level % 3) * 3}%`,
                  height: `${12 + (level % 3) * 3}%`,
                  top: `${40 + (index % 3) * 8}%`,
                  right: `${25 + (index % 2) * 5}%`,
                  borderColor: `${island.glow || "#3a5a7a"}15`,
                }}
              />
            )}
          </div>

          {/* 岛屿图标 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.span
              className="text-white/50 group-hover:text-white/85 transition-all duration-700"
              style={{ fontSize: actualSize * 0.3 }}
              animate={{ scale: isHovered ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {icon}
            </motion.span>
          </div>

          {/* 雾层（不活跃） */}
          {island.fogLevel > 0 && (
            <motion.div
              className="absolute inset-0 rounded-full bg-white pointer-events-none"
              animate={{ opacity: [island.fogLevel * 0.4, island.fogLevel * 0.8, island.fogLevel * 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: "blur(6px)" }}
            />
          )}
        </motion.div>

        {/* ─── 岛屿名称 ─── */}
        <motion.div
          className="absolute left-1/2 text-center pointer-events-none"
          style={{ top: actualSize * 0.55 + 6, transform: "translateX(-50%)" }}
          animate={{ opacity: isHovered ? 1 : 0.55 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-serif text-[11px] tracking-[0.12em] text-[#a0b8c8] group-hover:text-white transition-colors duration-500 whitespace-nowrap">
            {island.name}
          </p>
          <p className="text-[7px] uppercase tracking-[0.25em] text-[#4a6a7a] mt-0.5">
            {vis.label} &middot; {island.fileCount || 0} relics
          </p>
        </motion.div>

        {/* ─── Hover 详情卡 ─── */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50"
              style={{ top: -(actualSize * 0.6 + 90) }}
            >
              <div
                className="w-[240px] rounded-xl border p-5 shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, rgba(10,15,25,0.95), rgba(5,10,20,0.98))`,
                  borderColor: `${island.glow || "#3a5a7a"}25`,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${island.glow || "#2a4a7a"}08`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <p className="font-serif text-sm tracking-[0.08em] text-[#d0dae8]">{island.name}</p>
                    {island.subtitle && (
                      <p className="text-[8px] uppercase tracking-[0.25em] text-[#5a7a8a]">{island.subtitle}</p>
                    )}
                  </div>
                </div>

                {island.desc && (
                  <p className="text-[10px] leading-[1.65] text-[#5a7a8a] mb-3 line-clamp-2">
                    {island.desc}
                  </p>
                )}

                {/* 特征 */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {island.features?.slice(0, 4).map((f, i) => (
                    <span
                      key={i}
                      className="text-[8px] uppercase tracking-[0.12em] text-[#6a8a9a] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.05]"
                    >
                      {f.label} {f.count}
                    </span>
                  ))}
                </div>

                {/* 演化指示器 */}
                <div className="flex items-center gap-1.5 mb-3">
                  {[0, 1, 2, 3, 4].map((l) => (
                    <div
                      key={l}
                      className="flex-1 h-0.5 rounded-full transition-all duration-500"
                      style={{
                        background: l <= level
                          ? `${island.glow || "#5a8aaa"}`
                          : "rgba(255,255,255,0.06)",
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#3a5a6a]">
                    {vis.labelCN} &middot; {island.fileCount} relics
                  </span>
                  <span className="text-[9px] text-[#4a6a7a] group-hover:text-[#8a9aba] transition-colors">
                    Enter &#x2192;
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   漂浮碎片（高级演化岛屿的卫星碎片）
   ═══════════════════════════════════════════════════════════════ */
function FloatingFragment({ size, offsetX, offsetY, color, orbitDuration, delay }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `calc(50% - ${size / 2}px)`,
        top: `calc(50% - ${size / 2}px)`,
        background: `radial-gradient(circle, ${color || "#4a6a9a"}40, ${color || "#2a4a7a"}20)`,
        border: `1px solid ${color || "#3a5a7a"}20`,
      }}
      animate={{
        x: [offsetX, offsetX + 10, offsetX],
        y: [offsetY, offsetY - 8, offsetY],
        rotate: [0, 360],
      }}
      transition={{
        x: { duration: orbitDuration, repeat: Infinity, ease: "easeInOut", delay },
        y: { duration: orbitDuration * 0.7, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: orbitDuration * 1.5, repeat: Infinity, ease: "linear", delay },
      }}
    />
  );
}
