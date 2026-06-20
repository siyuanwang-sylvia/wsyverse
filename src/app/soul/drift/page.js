"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

/* ==================== CONSTANTS ==================== */

const SK = "soul-drift-bottles";

const TAGS = [
  "#孤独","#成长","#爱","#深海意识","#迷茫",
  "#未来","#崩塌","#温柔","#深夜","#灵感",
  "#顿悟","#告别",
];

const TAG_COLORS = {
  "#孤独": "border-zinc-600 text-zinc-400",
  "#成长": "border-emerald-800 text-emerald-500",
  "#爱": "border-rose-800 text-rose-400",
  "#深海意识": "border-blue-800 text-blue-400",
  "#迷茫": "border-amber-800 text-amber-500",
  "#未来": "border-violet-800 text-violet-400",
  "#崩塌": "border-red-900 text-red-400",
  "#温柔": "border-pink-800 text-pink-400",
  "#深夜": "border-indigo-800 text-indigo-400",
  "#灵感": "border-cyan-800 text-cyan-400",
  "#顿悟": "border-yellow-800 text-yellow-500",
  "#告别": "border-gray-700 text-gray-400",
};

/* Default bottles — kept empty, user creates their own via the UI */
const DEFAULTS = [];

/* Fixed bottle positions — no Math.random, no SSR warnings */
const SLOTS = [
  { left:"8%",  top:"50%", delay:"0s",    dur:"9s",  dx:12  },
  { left:"25%", top:"60%", delay:"1.8s",  dur:"11s", dx:-15 },
  { left:"42%", top:"47%", delay:"0.5s",  dur:"10s", dx:18  },
  { left:"60%", top:"55%", delay:"2.5s",  dur:"8s",  dx:-10 },
  { left:"78%", top:"48%", delay:"1.2s",  dur:"12s", dx:14  },
  { left:"90%", top:"62%", delay:"0.8s",  dur:"9s",  dx:-12 },
  { left:"15%", top:"72%", delay:"2.0s",  dur:"11s", dx:10  },
  { left:"52%", top:"68%", delay:"0.3s",  dur:"10s", dx:-18 },
  { left:"35%", top:"78%", delay:"1.5s",  dur:"9s",  dx:15  },
  { left:"68%", top:"74%", delay:"2.2s",  dur:"12s", dx:-14 },
  { left:"82%", top:"58%", delay:"0.7s",  dur:"10s", dx:16  },
  { left:"30%", top:"85%", delay:"1.0s",  dur:"11s", dx:-8  },
];

const SEA_WHISPERS = [
  "今天的你，回答过去的自己。",
  "有些话，只有大海听得见。",
  "把情绪交给潮汐。",
  "夜深了，海还在听。",
  "瓶子会漂到你该看到的地方。",
];

/* ==================== HELPERS ==================== */

function load() {
  if (typeof window === "undefined") return [];
  try {
    const r = localStorage.getItem(SK);
    if (r) { const s = JSON.parse(r); if (Array.isArray(s)) return s; }
  } catch (_) {}
  return [];
}

function save(d) {
  try { localStorage.setItem(SK, JSON.stringify(d)); } catch (_) {}
}

function fmtDate(s) {
  const d = new Date(s);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

/* ==================== ANIMATED BOTTLE SVG ==================== */

function BottleSVG({ glow, small }) {
  const w = small ? 28 : 36;
  const h = small ? 48 : 60;
  return (
    <svg width={w} height={h} viewBox="0 0 36 60" fill="none" className="drop-shadow-lg">
      {/* glow aura */}
      {glow && (
        <ellipse cx="18" cy="38" rx="22" ry="30" fill="rgba(26,74,122,0.12)" />
      )}
      {/* cork */}
      <rect x="14" y="2" width="8" height="4" rx="1" fill="#6b5530" opacity="0.7" />
      {/* neck */}
      <rect x="15" y="6" width="6" height="5" rx="0" fill="rgba(13,31,53,0.6)" stroke="rgba(26,74,122,0.3)" strokeWidth="0.5" />
      {/* shoulder curve */}
      <path d="M15 11 Q15 14 10 16 L10 14 Q15 12 15 11" fill="rgba(13,31,53,0.5)" />
      <path d="M21 11 Q21 14 26 16 L26 14 Q21 12 21 11" fill="rgba(13,31,53,0.5)" />
      {/* body */}
      <rect x="10" y="16" width="16" height="38" rx="4" fill="rgba(10,22,40,0.7)" stroke="rgba(26,74,122,0.25)" strokeWidth="0.8" />
      {/* glass highlight */}
      <rect x="12" y="18" width="2" height="14" rx="1" fill="rgba(255,255,255,0.06)" />
      {/* inner message glow */}
      <rect x="12" y="20" width="12" height="28" rx="2" fill="rgba(214,183,122,0.04)" />
      {/* bottom curve */}
      <path d="M10 50 Q14 56 18 56 Q22 56 26 50" stroke="rgba(26,74,122,0.3)" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

/* ==================== MAIN COMPONENT ==================== */

export default function Drift() {
  const router = useRouter();
  const [bottles, setBottles] = useState([]);
  const [view, setView] = useState("sea");
  const [selectedId, setSelectedId] = useState(null);
  const [writeText, setWriteText] = useState("");
  const [writeTags, setWriteTags] = useState([]);
  const [writeType, setWriteType] = useState("message");
  const [phase, setPhase] = useState("idle");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [whisperIdx, setWhisperIdx] = useState(0);

  /* load on mount */
  useEffect(() => {
    setBottles(load());
    setWhisperIdx(Math.floor(Math.random() * SEA_WHISPERS.length));
  }, []);

  /* save on change */
  useEffect(() => {
    if (bottles.length > 0) save(bottles);
  }, [bottles]);

  const sel = bottles.find(b => b.id === selectedId);

  const filtered = bottles.filter(b => {
    if (searchTag && !b.tags.includes(searchTag)) return false;
    if (searchText && !b.text.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const show = bottles.slice(0, SLOTS.length);

  /* ---- actions ---- */

  function handleThrow() {
    if (!writeText.trim() || phase !== "idle") return;
    setPhase("rolling");
    setTimeout(() => {
      setBottles(p => [{
        id: Date.now(),
        text: writeText.trim(),
        date: new Date().toISOString(),
        tags: writeTags.length > 0 ? writeTags : ["#深夜"],
        type: writeType,
        replies: [],
      }, ...p]);
      setWriteText("");
      setWriteTags([]);
      setWriteType("message");
      setPhase("idle");
      setView("sea");
    }, 2500);
  }

  function handleReply() {
    if (!replyText.trim() || !selectedId) return;
    setBottles(p => p.map(b => b.id !== selectedId ? b : {
      ...b,
      replies: [...b.replies, { text: replyText.trim(), date: new Date().toISOString() }],
    }));
    setReplyText("");
    setReplying(false);
  }

  function openBottle(id) {
    setSelectedId(id);
    setView("read");
    setReplying(false);
    setReplyText("");
    setSearchOpen(false);
  }

  function pickRandom() {
    const qs = bottles.filter(b => b.type === "question");
    const pool = qs.length > 0 ? qs : bottles;
    if (pool.length === 0) return;
    openBottle(pool[Math.floor(Math.random() * pool.length)].id);
  }

  function toggleTag(t) {
    setWriteTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  }

  /* ==================== RENDER ==================== */

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#050816] select-none">
      {/* ---------- STYLE ---------- */}
      <style>{`
        @keyframes twinkle {
          0%,100%{opacity:.15}50%{opacity:.6}
        }
        @keyframes floatBottle {
          0%,100%{transform:translateY(0) translateX(0) rotate(-1deg)}
          33%{transform:translateY(-7px) translateX(var(--dx)) rotate(0.8deg)}
          66%{transform:translateY(-3px) translateX(calc(var(--dx) * -0.6)) rotate(-0.5deg)}
        }
        @keyframes waveMove {
          0%{transform:translateX(0)}100%{transform:translateX(-50%)}
        }
        @keyframes gentlePulse {
          0%,100%{opacity:.4}50%{opacity:.7}
        }
        @keyframes paperRoll {
          0%{transform:scaleX(1) rotate(0deg);opacity:1}
          40%{transform:scaleX(0.08) rotate(8deg);opacity:1}
          70%{transform:scaleX(0.08) rotate(8deg) translateY(-60px);opacity:.8}
          100%{transform:scaleX(0.08) rotate(8deg) translateY(-100px);opacity:0}
        }
        @keyframes corkDrop {
          0%{transform:translateY(-20px);opacity:0}
          60%{transform:translateY(2px);opacity:1}
          100%{transform:translateY(0);opacity:1}
        }
        @keyframes bottleSway {
          0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}
        }
        @keyframes fadeInUp {
          from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}
        }
        .star{position:absolute;border-radius:50%;background:#ffe7b0;animation:twinkle var(--dur) ease-in-out var(--delay) infinite}
        .sea-whisper{animation:gentlePulse 4s ease-in-out infinite}
      `}</style>

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

      {/* ---------- BACKGROUND: STARS ---------- */}
      {[
        {x:"5%",y:"4%",s:1.5,d:"3s",dl:"0s"},
        {x:"12%",y:"8%",s:1,d:"4s",dl:"1s"},
        {x:"20%",y:"3%",s:2,d:"5s",dl:"0.5s"},
        {x:"28%",y:"10%",s:1,d:"3.5s",dl:"2s"},
        {x:"35%",y:"2%",s:1.5,d:"4.5s",dl:"0.8s"},
        {x:"45%",y:"7%",s:1,d:"3s",dl:"1.5s"},
        {x:"52%",y:"4%",s:2,d:"5s",dl:"0.3s"},
        {x:"60%",y:"9%",s:1,d:"4s",dl:"2.5s"},
        {x:"68%",y:"3%",s:1.5,d:"3.5s",dl:"1.2s"},
        {x:"75%",y:"6%",s:1,d:"4.5s",dl:"0.7s"},
        {x:"82%",y:"2%",s:2,d:"5s",dl:"1.8s"},
        {x:"88%",y:"8%",s:1,d:"3s",dl:"0.4s"},
        {x:"95%",y:"5%",s:1.5,d:"4s",dl:"2.2s"},
        {x:"8%",y:"15%",s:1,d:"5s",dl:"1.3s"},
        {x:"18%",y:"18%",s:1.5,d:"3.5s",dl:"0.6s"},
        {x:"30%",y:"14%",s:1,d:"4s",dl:"2.1s"},
        {x:"42%",y:"17%",s:2,d:"5s",dl:"0.9s"},
        {x:"55%",y:"13%",s:1,d:"3s",dl:"1.7s"},
        {x:"65%",y:"16%",s:1.5,d:"4.5s",dl:"0.2s"},
        {x:"78%",y:"12%",s:1,d:"3.5s",dl:"2.4s"},
        {x:"90%",y:"15%",s:2,d:"5s",dl:"1.1s"},
        {x:"3%",y:"22%",s:1,d:"4s",dl:"0.5s"},
        {x:"15%",y:"25%",s:1.5,d:"3s",dl:"2.3s"},
        {x:"48%",y:"20%",s:1,d:"5s",dl:"1.6s"},
        {x:"70%",y:"22%",s:1.5,d:"4s",dl:"0.1s"},
        {x:"85%",y:"20%",s:1,d:"3.5s",dl:"1.9s"},
        {x:"38%",y:"27%",s:1,d:"4.5s",dl:"2.6s"},
        {x:"58%",y:"25%",s:2,d:"3s",dl:"0.8s"},
        {x:"92%",y:"28%",s:1,d:"5s",dl:"1.4s"},
      ].map((st,i) => (
        <div key={i} className="star" style={{
          left:st.x, top:st.y,
          width:st.s, height:st.s,
          "--dur":st.d, "--delay":st.dl,
        }} />
      ))}

      {/* ---------- BACKGROUND: HORIZON GLOW ---------- */}
      <div className="absolute left-0 right-0 top-[32%] h-[8%] bg-gradient-to-b from-transparent via-[#1a2a4a]/8 to-transparent pointer-events-none" />

      {/* ---------- BACKGROUND: SEA SURFACE WAVE ---------- */}
      <div className="absolute left-0 right-0 top-[36%] pointer-events-none">
        {/* wave line glow */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#1a4a7a]/25 to-transparent mx-auto w-[80%]" />
        {/* wave texture */}
        <svg className="w-[200%] h-4 opacity-10" style={{animation:"waveMove 12s linear infinite"}} viewBox="0 0 1200 16" preserveAspectRatio="none">
          <path d="M0 8 Q150 0 300 8 Q450 16 600 8 Q750 0 900 8 Q1050 16 1200 8" fill="none" stroke="#1a4a7a" strokeWidth="0.5" />
        </svg>
        <svg className="w-[200%] h-3 opacity-5" style={{animation:"waveMove 18s linear infinite reverse"}} viewBox="0 0 1200 12" preserveAspectRatio="none">
          <path d="M0 6 Q200 0 400 6 Q600 12 800 6 Q1000 0 1200 6" fill="none" stroke="#1a4a7a" strokeWidth="0.5" />
        </svg>
      </div>

      {/* ---------- BACKGROUND: DEEP OCEAN GRADIENT ---------- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[36%] left-0 right-0 bottom-0 bg-gradient-to-b from-[#050816]/0 via-[#0a1628]/40 to-[#040610]/80" />
      </div>

      {/* ---------- SEA VIEW: FLOATING BOTTLES ---------- */}
      <AnimatePresence>
        {view === "sea" && (
          <motion.div
            className="absolute inset-0"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.8}}
          >
            {show.map((bottle, i) => {
              const slot = SLOTS[i % SLOTS.length];
              const isQ = bottle.type === "question";
              return (
                <motion.div
                  key={bottle.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: slot.left,
                    top: slot.top,
                    "--dx": `${slot.dx}px`,
                    animation: `floatBottle ${slot.dur} ease-in-out ${slot.delay} infinite`,
                  }}
                  whileHover={{ scale: 1.2, filter: "brightness(1.3)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openBottle(bottle.id)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                >
                  {/* Question bottle golden glow */}
                  {isQ && (
                    <div className="absolute -inset-5 rounded-full bg-[#d6b77a]/8 blur-lg group-hover:bg-[#d6b77a]/15 transition-all duration-700" />
                  )}
                  {/* Normal bottle blue glow */}
                  {!isQ && (
                    <div className="absolute -inset-4 rounded-full bg-[#1a4a7a]/8 blur-md group-hover:bg-[#1a4a7a]/15 transition-all duration-700" />
                  )}
                  <BottleSVG glow={isQ} small={false} />
                </motion.div>
              );
            })}

            {/* Empty sea message */}
            {bottles.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[#6f6249]/60 text-sm tracking-widest font-serif">
                  The sea is empty. Throw the first bottle.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- SEA WHISPER (bottom center) ---------- */}
      <AnimatePresence>
        {view === "sea" && !searchOpen && (
          <motion.p
            className="sea-whisper absolute bottom-24 left-0 right-0 text-center text-[#6f6249]/50 text-xs tracking-[0.3em] font-serif"
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
          >
            {SEA_WHISPERS[whisperIdx]}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ---------- HEADER ---------- */}
      <div className="absolute top-0 left-0 right-0 z-30 p-5 flex items-center justify-between">
        <button
          onClick={() => router.push("/soul")}
          className="text-[#6f6249] hover:text-[#d6b77a] transition-colors duration-500 text-sm tracking-wider"
        >
          &#8592; Soul Realm
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-[#d6b77a]/60 text-sm tracking-[0.25em] font-serif uppercase">
            Drift Stream
          </h1>
        </div>
      </div>

      {/* ---------- BOTTOM ACTION BAR ---------- */}
      <AnimatePresence>
        {view === "sea" && !searchOpen && (
          <motion.div
            className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-5"
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} transition={{delay:0.3,duration:0.6}}
          >
            <ActionButton label="Write" icon="&#9998;" onClick={() => setView("write")} />
            <ActionButton label="Pick Up" icon="&#9826;" onClick={pickRandom} />
            <ActionButton label="Search" icon="&#9776;" onClick={() => setSearchOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== WRITE MODAL ==================== */}
      <AnimatePresence>
        {view === "write" && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center px-4"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-[#050816]/90 backdrop-blur-sm"
              onClick={() => { if(phase==="idle") setView("sea"); }}
            />

            <motion.div
              className="relative z-10 w-full max-w-md"
              initial={{opacity:0,scale:0.9,y:30}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:30}}
              transition={{type:"spring",damping:20,stiffness:150}}
            >
              {/* Close */}
              {phase === "idle" && (
                <button
                  onClick={() => setView("sea")}
                  className="absolute -top-10 right-0 text-[#6f6249] hover:text-[#d6b77a] text-sm transition-colors"
                >
                  close
                </button>
              )}

              {/* Title */}
              <h2 className="text-center text-[#d6b77a]/70 text-lg tracking-[0.2em] font-serif mb-8">
                {writeType === "question" ? "Ask the future" : "Write to the sea"}
              </h2>

              {/* TYPE TOGGLE */}
              {phase === "idle" && (
                <div className="flex justify-center gap-3 mb-6">
                  <button
                    onClick={() => setWriteType("message")}
                    className={`px-4 py-1.5 text-xs tracking-wider border transition-all duration-500 ${
                      writeType==="message"
                        ? "border-[#d6b77a]/40 text-[#d6b77a] bg-[#d6b77a]/5"
                        : "border-[#6f6249]/20 text-[#6f6249] hover:border-[#6f6249]/40"
                    }`}
                  >
                    drift message
                  </button>
                  <button
                    onClick={() => setWriteType("question")}
                    className={`px-4 py-1.5 text-xs tracking-wider border transition-all duration-500 ${
                      writeType==="question"
                        ? "border-[#d6b77a]/40 text-[#d6b77a] bg-[#d6b77a]/5"
                        : "border-[#6f6249]/20 text-[#6f6249] hover:border-[#6f6249]/40"
                    }`}
                  >
                    question to future
                  </button>
                </div>
              )}

              {/* BOTTLE + TEXT AREA */}
              <div className="relative flex flex-col items-center">
                {/* Bottle visual above textarea */}
                <div style={phase==="rolling" ? {animation:"bottleSway 1s ease-in-out infinite"} : {}}>
                  <BottleSVG glow={false} small={false} />
                </div>

                {/* Paper / Textarea */}
                <div className="relative w-full -mt-2">
                  {phase === "idle" && (
                    <textarea
                      value={writeText}
                      onChange={e => setWriteText(e.target.value)}
                      placeholder="What do you want to drift into the sea..."
                      className="w-full h-28 bg-[#0b1020]/80 border border-[#8d7753]/20 rounded-lg px-4 py-3 text-[#e8d7b5] text-sm leading-relaxed placeholder:text-[#5e5442]/50 resize-none focus:outline-none focus:border-[#d6b77a]/30 transition-colors duration-500"
                      style={{fontFamily:"serif"}}
                    />
                  )}

                  {/* ROLLING ANIMATION */}
                  {phase === "rolling" && (
                    <div className="flex justify-center">
                      <motion.div
                        className="w-64 h-20 bg-[#e8d7b5]/15 border border-[#d6b77a]/20 rounded-sm flex items-center justify-center px-4"
                        style={{fontFamily:"serif"}}
                        initial={{scaleX:1,rotate:0,opacity:1,y:0}}
                        animate={{scaleX:0.06,rotate:10,opacity:0,y:-80}}
                        transition={{duration:2,ease:"easeInOut"}}
                      >
                        <span className="text-[#e8d7b5]/70 text-xs leading-relaxed whitespace-pre-wrap">
                          {writeText.slice(0, 40)}{writeText.length > 40 ? "..." : ""}
                        </span>
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* CORK DROP during rolling */}
                {phase === "rolling" && (
                  <motion.div
                    className="w-6 h-3 bg-[#6b5530]/70 rounded-sm mt-1"
                    initial={{y:-20,opacity:0}}
                    animate={{y:0,opacity:1}}
                    transition={{delay:1.2,duration:0.5,ease:"easeOut"}}
                  />
                )}
              </div>

              {/* TAG SELECTOR */}
              {phase === "idle" && (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {TAGS.map(t => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`px-2.5 py-1 text-[10px] tracking-wider border transition-all duration-300 ${
                        writeTags.includes(t)
                          ? `${TAG_COLORS[t] || "border-[#8d7753]/40 text-[#d6b77a]"} bg-current/5`
                          : "border-[#5e5442]/20 text-[#5e5442]/60 hover:border-[#5e5442]/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}

              {/* THROW BUTTON */}
              {phase === "idle" && (
                <motion.button
                  onClick={handleThrow}
                  className="mt-8 mx-auto block px-8 py-2.5 text-xs tracking-[0.3em] uppercase font-serif border border-[#d6b77a]/30 text-[#d6b77a]/70 hover:bg-[#d6b77a]/5 hover:text-[#d6b77a] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={!writeText.trim()}
                  whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                >
                  throw into the sea
                </motion.button>
              )}

              {/* Rolling status text */}
              {phase === "rolling" && (
                <motion.p
                  className="mt-6 text-center text-[#6f6249]/40 text-xs tracking-[0.3em] font-serif"
                  initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
                >
                  drifting into the deep...
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== READ MODAL ==================== */}
      <AnimatePresence>
        {view === "read" && sel && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center px-4"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-[#050816]/90 backdrop-blur-sm"
              onClick={() => setView("sea")}
            />

            <motion.div
              className="relative z-10 w-full max-w-lg"
              initial={{opacity:0,y:40,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:40,scale:0.95}}
              transition={{type:"spring",damping:18,stiffness:120}}
            >
              {/* Bottle icon top */}
              <div className="flex justify-center mb-6">
                <div style={{animation:"bottleSway 3s ease-in-out infinite"}}>
                  <BottleSVG glow={sel.type==="question"} small={true} />
                </div>
              </div>

              {/* Paper card */}
              <div className="bg-[#0b1020]/90 border border-[#8d7753]/20 rounded-lg p-6 relative">
                {/* Corner ornament */}
                <div className="absolute top-2 left-3 w-4 h-4 border-t border-l border-[#8d7753]/20" />
                <div className="absolute top-2 right-3 w-4 h-4 border-t border-r border-[#8d7753]/20" />
                <div className="absolute bottom-2 left-3 w-4 h-4 border-b border-l border-[#8d7753]/20" />
                <div className="absolute bottom-2 right-3 w-4 h-4 border-b border-r border-[#8d7753]/20" />

                {/* Type badge */}
                {sel.type === "question" && (
                  <div className="flex justify-center mb-4">
                    <span className="px-3 py-1 text-[10px] tracking-[0.2em] border border-[#d6b77a]/20 text-[#d6b77a]/50 uppercase font-serif">
                      a question from the past
                    </span>
                  </div>
                )}

                {/* Message text */}
                <p className="text-[#e8d7b5] text-base leading-relaxed text-center px-2" style={{fontFamily:"serif"}}>
                  {sel.text}
                </p>

                {/* Date */}
                <p className="text-center text-[#6f6249]/50 text-xs mt-5 tracking-wider font-serif">
                  {fmtDate(sel.date)}
                </p>

                {/* Tags */}
                <div className="flex justify-center gap-2 mt-3">
                  {sel.tags.map(t => (
                    <span key={t} className={`text-[10px] px-2 py-0.5 border ${TAG_COLORS[t] || "border-[#8d7753]/20 text-[#8d7753]"}`}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Replies */}
                {sel.replies.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-[#8d7753]/10">
                    <p className="text-[#6f6249]/40 text-[10px] tracking-[0.2em] uppercase mb-3 font-serif">
                      answers from the future
                    </p>
                    {sel.replies.map((r, i) => (
                      <motion.div
                        key={i}
                        className="bg-[#050816]/50 rounded p-3 mb-2"
                        initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:i*0.15}}
                      >
                        <p className="text-[#d6b77a]/60 text-sm leading-relaxed" style={{fontFamily:"serif"}}>{r.text}</p>
                        <p className="text-[#6f6249]/40 text-[10px] mt-2 tracking-wider">{fmtDate(r.date)}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Reply input */}
                {sel.type === "question" && !replying && (
                  <div className="flex justify-center mt-5">
                    <button
                      onClick={() => setReplying(true)}
                      className="px-5 py-1.5 text-[10px] tracking-[0.25em] uppercase border border-[#d6b77a]/20 text-[#d6b77a]/50 hover:bg-[#d6b77a]/5 hover:text-[#d6b77a]/70 transition-all duration-500 font-serif"
                    >
                      answer past self
                    </button>
                  </div>
                )}

                {replying && (
                  <motion.div
                    className="mt-5 pt-4 border-t border-[#8d7753]/10"
                    initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
                  >
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Answer the past self..."
                      className="w-full h-20 bg-[#050816]/60 border border-[#8d7753]/15 rounded px-3 py-2 text-[#e8d7b5] text-sm placeholder:text-[#5e5442]/40 resize-none focus:outline-none focus:border-[#d6b77a]/20 transition-colors"
                      style={{fontFamily:"serif"}}
                      autoFocus
                    />
                    <div className="flex justify-end gap-3 mt-2">
                      <button
                        onClick={() => { setReplying(false); setReplyText(""); }}
                        className="px-3 py-1 text-[10px] tracking-wider text-[#6f6249]/50 hover:text-[#6f6249] transition-colors"
                      >
                        cancel
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="px-4 py-1 text-[10px] tracking-[0.2em] uppercase border border-[#d6b77a]/30 text-[#d6b77a]/60 hover:bg-[#d6b77a]/5 transition-all duration-500 disabled:opacity-30 font-serif"
                      >
                        send to the past
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Close */}
                <div className="flex justify-center mt-5">
                  <button
                    onClick={() => setView("sea")}
                    className="px-5 py-1.5 text-[10px] tracking-[0.25em] border border-[#6f6249]/20 text-[#6f6249]/50 hover:text-[#6f6249] hover:border-[#6f6249]/40 transition-all duration-500 font-serif"
                  >
                    close bottle
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== SEARCH PANEL ==================== */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="absolute inset-x-0 top-0 bottom-0 z-30 pt-16 px-4 overflow-y-auto"
            initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
          >
            <div className="max-w-lg mx-auto">
              {/* Search header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#d6b77a]/60 text-sm tracking-[0.2em] font-serif">
                  Search the sea
                </h2>
                <button
                  onClick={() => { setSearchOpen(false); setSearchText(""); setSearchTag(""); }}
                  className="text-[#6f6249]/50 hover:text-[#d6b77a] text-xs tracking-wider transition-colors"
                >
                  close
                </button>
              </div>

              {/* Keyword search */}
              <input
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="Search by keyword..."
                className="w-full bg-[#0b1020]/60 border border-[#8d7753]/15 rounded px-4 py-2.5 text-[#e8d7b5] text-sm placeholder:text-[#5e5442]/40 focus:outline-none focus:border-[#d6b77a]/20 transition-colors mb-4"
                style={{fontFamily:"serif"}}
              />

              {/* Tag filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSearchTag("")}
                  className={`px-2.5 py-1 text-[10px] tracking-wider border transition-all duration-300 ${
                    searchTag === ""
                      ? "border-[#d6b77a]/30 text-[#d6b77a]"
                      : "border-[#5e5442]/20 text-[#5e5442]/50 hover:border-[#5e5442]/40"
                  }`}
                >
                  ALL
                </button>
                {TAGS.map(t => (
                  <button
                    key={t}
                    onClick={() => setSearchTag(searchTag === t ? "" : t)}
                    className={`px-2.5 py-1 text-[10px] tracking-wider border transition-all duration-300 ${
                      searchTag === t
                        ? (TAG_COLORS[t] || "border-[#8d7753]/40 text-[#d6b77a]")
                        : "border-[#5e5442]/20 text-[#5e5442]/40 hover:border-[#5e5442]/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Results count */}
              <p className="text-[#6f6249]/40 text-[10px] tracking-wider mb-3">
                {filtered.length} bottle{filtered.length !== 1 ? "s" : ""} found
              </p>

              {/* Results list */}
              <div className="space-y-3 pb-20">
                {filtered.map((b, i) => (
                  <motion.button
                    key={b.id}
                    onClick={() => openBottle(b.id)}
                    className="w-full text-left bg-[#0b1020]/60 border border-[#8d7753]/10 rounded-lg p-4 hover:border-[#8d7753]/25 transition-all duration-500 group"
                    initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 opacity-40 group-hover:opacity-80 transition-opacity">
                        <BottleSVG glow={false} small={true} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#e8d7b5]/70 text-sm leading-relaxed truncate" style={{fontFamily:"serif"}}>
                          {b.text}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[#6f6249]/40 text-[10px] tracking-wider">{fmtDate(b.date)}</span>
                          <div className="flex gap-1">
                            {b.tags.map(t => (
                              <span key={t} className={`text-[9px] px-1.5 py-0.5 border ${TAG_COLORS[t] || "border-[#8d7753]/15 text-[#8d7753]/50"}`}>
                                {t}
                              </span>
                            ))}
                          </div>
                          {b.type === "question" && (
                            <span className="text-[9px] text-[#d6b77a]/30 border border-[#d6b77a]/15 px-1.5 py-0.5">
                              Q
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-[#6f6249]/30 text-sm py-8 font-serif tracking-wider">
                    No bottles found in the deep.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- BOTTLE COUNT INDICATOR ---------- */}
      <AnimatePresence>
        {view === "sea" && !searchOpen && (
          <motion.div
            className="absolute top-5 right-16 z-10"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          >
            <span className="text-[#6f6249]/30 text-[10px] tracking-[0.2em] font-serif">
              {bottles.length} bottle{bottles.length !== 1 ? "s" : ""} drifting
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ==================== ACTION BUTTON ==================== */

function ActionButton({ label, icon, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 px-5 py-3 border border-[#8d7753]/15 hover:border-[#d6b77a]/30 transition-all duration-500 group"
      whileHover={{scale:1.05}} whileTap={{scale:0.95}}
    >
      <span className="text-[#d6b77a]/40 group-hover:text-[#d6b77a]/70 transition-colors duration-500 text-lg">
        {icon}
      </span>
      <span className="text-[#6f6249]/50 group-hover:text-[#d6b77a]/50 text-[10px] tracking-[0.2em] uppercase transition-colors duration-500 font-serif">
        {label}
      </span>
    </motion.button>
  );
}
