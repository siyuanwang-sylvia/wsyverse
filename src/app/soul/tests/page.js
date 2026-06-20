"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════
   漂浮意识词库
   ═══════════════════════════════════════════ */

const WORD_POOL = [
  { text: "海",     mean: ["depth","loneliness","freedom"] },
  { text: "离开",   mean: ["change","loss","courage"] },
  { text: "月亮",   mean: ["longing","feminine","hidden"] },
  { text: "深夜",   mean: ["solitude","truth","vulnerability"] },
  { text: "雨",     mean: ["cleansing","sadness","renewal"] },
  { text: "飞鸟",   mean: ["escape","hope","transience"] },
  { text: "回忆",   mean: ["past","attachment","identity"] },
  { text: "门",     mean: ["threshold","choice","unknown"] },
  { text: "火车",   mean: ["journey","departure","nostalgia"] },
  { text: "梦",     mean: ["desire","fear","unconscious"] },
  { text: "沉默",   mean: ["unsaid","power","distance"] },
  { text: "光",     mean: ["hope","truth","guidance"] },
  { text: "迷路",   mean: ["confusion","searching","growth"] },
  { text: "镜子",   mean: ["self","reflection","truth"] },
  { text: "远方",   mean: ["yearning","future","possibility"] },
  { text: "遗忘",   mean: ["healing","avoidance","mercy"] },
  { text: "相遇",   mean: ["fate","connection","surprise"] },
  { text: "孤独",   mean: ["independence","depth","pain"] },
  { text: "等待",   mean: ["patience","anxiety","faith"] },
  { text: "消失",   mean: ["escape","transformation","fear"] },
  { text: "归来",   mean: ["home","integration","relief"] },
  { text: "时间",   mean: ["impermanence","pressure","flow"] },
  { text: "深渊",   mean: ["shadow","exploration","fear"] },
  { text: "呼吸",   mean: ["presence","life","grounding"] },
];

/* ═══════════════════════════════════════════
   灵魂诊断模板
   ═══════════════════════════════════════════ */

function generateDiagnosis(selectedWords) {
  const wordTexts = selectedWords.map(w => w.text);
  const allMeans  = selectedWords.flatMap(w => w.mean);

  const hasLoneliness = allMeans.some(m => ["loneliness","solitude","孤独"].includes(m));
  const hasHope      = allMeans.some(m => ["hope","light","future","escape"].includes(m));
  const hasPast      = allMeans.some(m => ["past","attachment","loss","nostalgia"].includes(m));
  const hasDepth     = allMeans.some(m => ["depth","shadow","unconscious","fear"].includes(m));
  const hasChange    = allMeans.some(m => ["change","departure","transformation"].includes(m));
  const hasSelf      = allMeans.some(m => ["self","reflection","identity","truth"].includes(m));

  let soulType  = "";
  let diagnosis = "";
  let whisper   = "";

  if (hasDepth && hasLoneliness) {
    soulType  = "深海型意识";
    diagnosis = `你最近的潜意识正在向深处下沉。\n\n表面看似平静，但内在已经有暗流在涌动。你选择的「${wordTexts.slice(0,3).join(" · ")}」说明：你正在消化某些无法言说的情绪。\n\n你不需要立刻给出答案。\n深渊里藏着你尚未认识的自己。`;
    whisper = "最深的地方，光才能照得最远。";
  } else if (hasHope && hasChange) {
    soulType  = "月光漂流者";
    diagnosis = `你并不缺乏方向。\n\n你只是已经太久，没有停下来听自己。「${wordTexts.slice(0,3).join(" · ")}」反复出现在你的意识里，说明你正在准备一次真正的出发。\n\n不要急。\n漂流本身就是答案。`;
    whisper = "你以为自己在迷路，其实你在找到自己。";
  } else if (hasPast && hasSelf) {
    soulType  = "记忆镜像者";
    diagnosis = `你以为自己在怀念过去。\n\n其实你在怀念——那时的自己。「${wordTexts.slice(0,2).join(" · ")}」是你的潜意识反复回去的地方。\n\n过去没有消失。\n它只是换了一种方式，住在你里面。`;
    whisper = "记忆不是过去，是你反复选择的自己。";
  } else if (hasSelf && hasDepth) {
    soulType  = "影子探索者";
    diagnosis = `你最近在回避某些关于自己的真相。\n\n「${wordTexts.slice(0,3).join(" · ")}」说明：你的潜意识正在试图和你对话。但你还不敢完全转过身去。\n\n你不需要完美。\n你只需要，诚实一次。`;
    whisper = "你害怕看见的影子，其实是你最真实的部分。";
  } else if (hasLoneliness && hasPast) {
    soulType  = "夜行独白者";
    diagnosis = `你最近反复在深夜想起某些画面。\n\n不是因为你放不下。而是因为——那些画面里，藏着你现在最需要听到的东西。\n\n「${wordTexts.slice(0,2).join(" · ")}」是你的潜意识在敲门。\n打开它。`;
    whisper = "深夜出现的记忆，都是还没说完的话。";
  } else {
    soulType  = "意识漂流者";
    diagnosis = `你最近的状态像是一片海。\n\n表面平静，但底层有暗流。「${wordTexts.slice(0, Math.min(3, wordTexts.length)).join(" · ")}」说明你正在经历一次缓慢的、安静的、内在位移。\n\n不需要急着定义它。\n让它漂。直到它自己靠岸。`;
    whisper = "有些答案，要在你停止寻找之后才会出现。";
  }

  return { soulType, diagnosis, whisper };
}

/* ═══════════════════════════════════════════
   答案之书
   ═══════════════════════════════════════════ */

const ANSWER_BOOK = [
  "有些答案之所以迟迟没有出现，\n是因为你还没有真正开始提问。",
  "你以为自己在怀念过去，\n其实你在怀念那时的自己。",
  "最深层的真相往往看起来像沉默。\n不要急着打破它。",
  "你正在等待的那个信号，\n其实已经出现过一次了。",
  "有些门需要你背对着它，\n走很远之后，才会自动打开。",
  "你最近做的那个梦，\n不是梦。是你的潜意识在给你写信。",
  "真正的放弃是没有感觉的。\n你还在痛苦，说明你还没放弃。",
  "你问的这个问题，\n答案其实在你的身体里，不在你的脑子里。",
  "有些分别，\n其实是为了让你重新遇见自己。",
  "你现在的迷茫，\n是之前的自己给未来的自己留的一扇窗。",
  "不要害怕消失。\n消失是另一种形式的归来。",
  "你以为你是独自一人。\n但你选择的这些词，说明有人曾经深深理解过你。",
];

/* ═══════════════════════════════════════════
   固定粒子（避免 SSR 警告）
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
   漂浮词组件
   ═══════════════════════════════════════════ */

function FloatingWord({ word, index, isSelected, onToggle }) {
  const seed   = index * 137.508;
  const initX  = ((seed * 7.3)  % 70) +  5;   // 5 % – 75 %
  const initY  = ((seed * 3.7)  % 60) + 10;   // 10% – 70 %
  const driftX = ((seed * 2.3)  % 30) - 15;    // ±15 %
  const driftY = ((seed * 1.7)  % 25) - 12;    // ±12 %
  const dur     = 18 + (seed % 20);
  const dly     = (seed * 0.13) % 8;

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{ left: `${initX}%`, top: `${initY}%` }}
      animate={{
        x:      [0, driftX, 0, -driftX * 0.6, 0],
        y:      [0, -driftY, 0, driftY * 0.8, 0],
        rotate: [0, (seed % 6) - 3, 0],
      }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: dly }}
      onClick={onToggle}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={isSelected ? {
          scale:         [1, 1.08, 1],
          textShadow: [
            "0 0 0px transparent",
            "0 0 12px rgba(255,231,176,0.4)",
            "0 0 0px transparent",
          ],
        } : {}}
        transition={{ duration: 2.5, repeat: isSelected ? Infinity : 0, ease: "easeInOut" }}
        className={`
          px-4 py-2 rounded-full border text-sm md:text-base font-serif
          transition-all duration-700
          ${isSelected
            ? "border-[#d6b77a] bg-[#d6b77a]/10 text-[#ffe7b0] shadow-[0_0_20px_rgba(214,183,122,0.15)]"
            : "border-[#8d7753]/30 bg-[#0b1020]/60 text-[#8d7753] hover:border-[#d6b77a]/50 hover:text-[#d6b77a]/80"
          }
        `}
      >
        {word.text}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   主页面
   ═══════════════════════════════════════════ */

export default function Tests() {
  const [selected,      setSelected]      = useState([]);
  const [result,        setResult]        = useState(null);
  const [showResult,   setShowResult]   = useState(false);
  const [answerBookOpen, setAnswerBookOpen] = useState(false);
  const [answerText,   setAnswerText]   = useState("");
  const [phase,         setPhase]         = useState("choosing");

  const toggleWord = useCallback((word) => {
    setSelected(prev => {
      if (prev.find(w => w.text === word.text)) return prev.filter(w => w.text !== word.text);
      if (prev.length >= 6) return prev;
      return [...prev, word];
    });
  }, []);

  const handleGenerate = useCallback(() => {
    if (selected.length < 2) return;
    const res = generateDiagnosis(selected);
    setResult(res);
    setShowResult(true);
    setPhase("result");
  }, [selected]);

  const openAnswerBook = useCallback(() => {
    const text = ANSWER_BOOK[Math.floor(Math.random() * ANSWER_BOOK.length)];
    setAnswerText(text);
    setAnswerBookOpen(true);
    setPhase("book");
  }, []);

  const resetAll = useCallback(() => {
    setSelected([]);
    setResult(null);
    setShowResult(false);
    setAnswerBookOpen(false);
    setPhase("choosing");
  }, []);

  const selectedSet = useMemo(() => new Set(selected.map(w => w.text)), [selected]);

  /* ── 背景粒子 JSX（复用 PARTICLES 常量） ─────────────────────── */
  const particleJSX = PARTICLES.map((p, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full bg-[#ffe7b0]"
      style={{ width: p.s, height: p.s, left: `${p.x}%`, top: `${p.y}%`, opacity: p.o }}
      animate={{ y: [0, -25, 0], opacity: [p.o * 0.3, p.o, p.o * 0.3] }}
      transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
    />
  ));

  /* ── 漂浮词区域高度 ───────────────────────────────────────────── */
  const floatingAreaH = "h-[280px] md:h-[360px]";

  /* ═══════════════════════════════════════════
     渲染
     ═══════════════════════════════════════════ */
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-[#e8d7b5]">

      {/* ── 背景层 ──────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#161b2e_0%,#090b14_50%,#050816_100%)]" />
      <div className="absolute top-[-5%] right-[10%] h-[500px] w-[500px] rounded-full bg-[#d6b77a]/3 blur-3xl" />
      <div className="absolute bottom-[-15%] left-[-5%] h-[400px] w-[400px] rounded-full bg-[#1a1410]/80 blur-3xl" />

      {/* ── 漂浮灰尘 ───────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particleJSX}
      </div>

      {/* ── 主内容 ─────────────────────────── */}
      <section className="relative z-10 flex flex-col min-h-screen px-6 py-8 md:py-12">

        {/* 顶部导航 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/soul"
            className="text-sm font-medium uppercase tracking-[0.3em] text-[#8d7753] hover:text-[#d6b77a] transition-colors px-5 py-3 border border-[#8d7753]/30 rounded-xl bg-[#0b1020]/60 backdrop-blur-sm"
          >
            ← Soul Realm
          </Link>

          <div className="text-[9px] uppercase tracking-[0.5em] text-[#3d3529]">
            Psychology Test Base
          </div>

          {phase !== "choosing" && (
            <button
              onClick={resetAll}
              className="text-[10px] uppercase tracking-[0.4em] text-[#5e5442] hover:text-[#8d7753] transition-colors"
            >
              Reset
            </button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ═══════════════════════════════
               选择阶段
               ═══════════════════════════════ */}
          {phase === "choosing" && (
            <motion.div
              key="choosing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="flex-1 flex flex-col items-center"
            >
              {/* 标题 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1.5 }}
                className="text-center mb-10 md:mb-14"
              >
                <p className="text-[10px] uppercase tracking-[0.5em] text-[#5e5442] mb-3">
                  Consciousness Mapping
                </p>
                <h1 className="font-serif text-2xl md:text-4xl tracking-[0.12em] text-[#d6b77a] mb-4">
                  意识碎片
                </h1>
                <div className="mx-auto h-px w-24 bg-[#8d7753]/40 mb-4" />
                <p className="text-xs md:text-sm text-[#6f6249] leading-7 max-w-md mx-auto">
                  点击那些吸引你的词。<br />
                  它们在替你的潜意识说话。
                </p>
              </motion.div>

              {/* 已选词标签 */}
              {selected.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 flex flex-wrap justify-center gap-2"
                >
                  {selected.map(w => (
                    <span
                      key={w.text}
                      className="text-[10px] uppercase tracking-[0.3em] text-[#d6b77a]/60 px-3 py-1 border border-[#d6b77a]/20 rounded-full"
                    >
                      {w.text}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* 漂浮词区域 */}
              <div className={`relative w-full max-w-4xl ${floatingAreaH} mb-10`}>
                {WORD_POOL.map((word, i) => (
                  <FloatingWord
                    key={word.text}
                    word={word}
                    index={i}
                    isSelected={selectedSet.has(word.text)}
                    onToggle={() => toggleWord(word)}
                  />
                ))}
              </div>

              {/* 生成按钮 */}
              <AnimatePresence>
                {selected.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerate}
                      className="group relative px-10 py-4 rounded-2xl border border-[#8d7753]/40 bg-[#0b1020]/80 backdrop-blur-md text-[#d6b77a] text-sm uppercase tracking-[0.4em] overflow-hidden"
                    >
                      {/* 流光 */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -left-20 top-0 h-full w-20 rotate-12 bg-gradient-to-r from-transparent via-[#ffe7b0]/8 to-transparent blur-xl transition-all duration-[3000ms] group-hover:left-[120%]" />
                      </div>
                      <span className="relative z-10">
                        生成意识映射 ·
                        {selected.length}
                      </span>
                    </motion.button>

                    <p className="mt-4 text-[10px] tracking-[0.3em] text-[#3d3529] uppercase">
                      {selected.length < 3
                        ? "至少再选一个，让映射更精准"
                        : "已捕捉到足够意识碎片，可以生成了"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 答案之书入口 */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={openAnswerBook}
                className="mt-12 text-[10px] uppercase tracking-[0.5em] text-[#3d3529] hover:text-[#5e5442] transition-colors"
              >
                ⋯ 答案之书 ⋯
              </motion.button>

            </motion.div>
          )}

          {/* ═══════════════════════════════
               结果阶段
               ═══════════════════════════════ */}
          {phase === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="flex-1 flex flex-col items-center justify-center py-12"
            >
              {/* 灵魂类型 */}
              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, letterSpacing: "0.18em" }}
                transition={{ delay: 0.3, duration: 1.5 }}
                className="mb-8"
              >
                <p className="text-[10px] uppercase tracking-[0.5em] text-[#5e5442] mb-2 text-center">
                  Your Soul Type
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-[#ffe7b0] tracking-[0.1em] text-center">
                  {result.soulType}
                </h2>
              </motion.div>

              {/* 分割线 */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "120px" }}
                transition={{ delay: 0.8, duration: 1 }}
                className="h-px bg-[#8d7753]/40 mb-8"
              />

              {/* 诊断正文 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="max-w-lg mx-auto text-center"
              >
                <p className="text-sm md:text-base leading-[2] text-[#c8b48a] whitespace-pre-line font-serif">
                  {result.diagnosis}
                </p>
              </motion.div>

              {/* 灵魂低语 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1.2 }}
                className="mt-10 px-6 py-4 border border-[#8d7753]/20 rounded-xl bg-[#0b1020]/60 max-w-sm mx-auto"
              >
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#5e5442] mb-2 text-center">
                  Soul Whisper
                </p>
                <p className="text-sm text-[#d6b77a]/80 leading-[1.9] text-center font-serif">
                  {result.whisper}
                </p>
              </motion.div>

              {/* 操作 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="mt-10 flex gap-6"
              >
                <button
                  onClick={resetAll}
                  className="text-[10px] uppercase tracking-[0.4em] text-[#5e5442] hover:text-[#8d7753] transition-colors"
                >
                  ← 重新选择
                </button>
                <button
                  onClick={openAnswerBook}
                  className="text-[10px] uppercase tracking-[0.4em] text-[#5e5442] hover:text-[#8d7753] transition-colors"
                >
                  ⋯ 答案之书
                </button>
              </motion.div>

            </motion.div>
          )}

          {/* ═══════════════════════════════
               答案之书
               ═══════════════════════════════ */}
          {phase === "book" && (
            <motion.div
              key="book"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex-1 flex flex-col items-center justify-center py-12"
            >
              {/* 书影 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative mb-10"
              >
                {/* 发光背景 */}
                <div className="absolute inset-[-30px] rounded-full bg-[#d6b77a]/5 blur-2xl" />

                <div
                  className="
                    relative w-[200px] h-[260px] md:w-[220px] md:h-[280px]
                    rounded-lg border border-[#8d7753]/40 bg-[#0b1020]
                    shadow-[0_0_40px_rgba(214,183,122,0.1)]
                    flex flex-col items-center justify-center p-6
                  "
                >
                  {/* 书脊装饰 */}
                  <div className="absolute left-[12px] top-[20px] bottom-[20px] w-px bg-[#8d7753]/30" />
                  <div className="absolute right-[12px] top-[20px] bottom-[20px] w-px bg-[#8d7753]/30" />
                  <div className="absolute top-[12px] left-[20px] right-[20px] h-px bg-[#8d7753]/30" />
                  <div className="absolute bottom-[12px] left-[20px] right-[20px] h-px bg-[#8d7753]/30" />

                  <p className="text-[9px] uppercase tracking-[0.5em] text-[#5e5442] mb-4">
                    The Book of Answers
                  </p>

                  <div className="text-4xl text-[#8d7753]/50 mb-4">
                    ✦
                  </div>

                  <p className="text-[10px] text-[#5e5442] tracking-[0.3em] uppercase">
                    open me
                  </p>
                </div>
              </motion.div>

              {/* 答案文字 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={answerText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  className="max-w-md mx-auto text-center px-4"
                >
                  <p className="text-sm md:text-base leading-[2.2] text-[#c8b48a] font-serif whitespace-pre-line">
                    {answerText}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* 操作 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-10 flex gap-6"
              >
                <button
                  onClick={() => {
                    const text = ANSWER_BOOK[Math.floor(Math.random() * ANSWER_BOOK.length)];
                    setAnswerText(text);
                  }}
                  className="text-[10px] uppercase tracking-[0.4em] text-[#5e5442] hover:text-[#8d7753] transition-colors"
                >
                  ⟳ 再翻一页
                </button>
                <button
                  onClick={resetAll}
                  className="text-[10px] uppercase tracking-[0.4em] text-[#5e5442] hover:text-[#8d7753] transition-colors"
                >
                  ← 返回
                </button>
              </motion.div>

            </motion.div>
          )}

        </AnimatePresence>

        {/* 底部低语 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="mt-auto pt-8 text-center"
        >
          <p className="text-[9px] uppercase tracking-[0.45em] text-[#2a2418]">
            {phase === "choosing" && "Words are the footprints of consciousness"}
            {phase === "result"   && "This is not a test. It is a mirror."}
            {phase === "book"     && "The answer was always within the question"}
          </p>
        </motion.div>

      </section>
    </main>
  );
}
