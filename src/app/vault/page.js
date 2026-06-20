"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ═════════════════════════════════════════
   从 API 加载书架数据
   ═════════════════════════════════════════ */

const SHELF_META = {
  cpa:       { title: "CPA",           subtitle: "注册会计师",       icon: "📊", desc: "会计 · 审计 · 税法 · 财务成本管理" },
  ielts:    { title: "IELTS",        subtitle: "雅思",               icon: "✎",  desc: "听力 · 阅读 · 写作 · 口语" },
  phd:       { title: "PhD Research",   subtitle: "博士研究",           icon: "⊹",  desc: "论文 · 文献 · 研究方法 · 笔记" },
  finance:   { title: "Finance",        subtitle: "金融",               icon: "⬡",  desc: "投资 · 衍生品 · 风险管理" },
  psychology: { title: "Psychology",     subtitle: "心理学",             icon: "☽",  desc: "荣格 · 认知 · 社会 · 发展" },
  ai:        { title: "AI",             subtitle: "人工智能",           icon: "◇",  desc: "机器学习 · LLM · RAG · 向量数据库" },
  languages:  { title: "Languages",      subtitle: "语言",               icon: "✿",  desc: "英语 · 法语 · 日语 · 更多" },
  books:     { title: "Books",          subtitle: "阅读",               icon: "☰",  desc: "电子书 · 笔记 · 摘录 · 书评" },
};

const SHELF_IDS = Object.keys(SHELF_META);

function fmtCount(n) {
  if (n === 0) return "Empty — awaiting contents";
  if (n === 1) return "1 file";
  return `${n} files`;
}

/* ═════════════════════════════════════════
   主页面
   ═════════════════════════════════════════ */

export default function VaultPage() {
  const [shelves, setShelves] = useState(null);
  const [activeShelf, setActiveShelf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/knowledge");
        if (res.ok) {
          const data = await res.json();
          const list = SHELF_IDS.map(id => {
            const meta = SHELF_META[id];
            const files = data[id]?.files?.length ?? 0;
            return { id, ...meta, files };
          });
          setShelves(list);
        }
      } catch (_) {
        /* 静默失败，使用 0 文件计数 */
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalFiles = shelves
    ? shelves.reduce((s, sh) => s + sh.files, 0)
    : 0;

  /* ── 返回键 ── */
  const backBtn = (
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
  );

  /* ── 加载中 ── */
  if (loading || !shelves) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#05060a] text-[#f4e6c3] flex items-center justify-center">
        {backBtn}
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl text-[#d6b77a]/30"
        >
          ✦
        </motion.div>
      </main>
    );
  }

  /* ── 书架列表视图 ── */
  if (!activeShelf) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#05060a] text-[#f4e6c3]">
        {backBtn}

        {/* 背景体积光 */}
        <div className="absolute top-[-200px] left-[10%] w-[600px] h-[600px] rounded-full bg-amber-500/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-150px] right-[5%] w-[500px] h-[500px] rounded-full bg-yellow-500/3 blur-3xl pointer-events-none" />

        {/* 标题区 */}
        <motion.div
          className="relative z-10 text-center pt-28 pb-16 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="mb-4 text-xs uppercase tracking-[0.65em] text-[#8d7753]">
            Knowledge Architecture
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-[0.15em] text-[#f4e8c8]">
            KNOWLEDGE VAULT
          </h1>
          <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-[#8d7753]/60 to-transparent" />
          <p className="mx-auto mt-6 max-w-md text-sm leading-8 text-[#8d7753]">
            每一本书，都是一座岛屿。
          </p>
          {totalFiles > 0 && (
            <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-[#5e5442]">
              {totalFiles} items archived
            </p>
          )}
        </motion.div>

        {/* 书架网格 */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shelves.map((shelf, i) => (
            <motion.button
              key={shelf.id}
              onClick={() => setActiveShelf(shelf.id)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.8 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-700 hover:border-[#8d7753]/35"
              style={{ backgroundColor: "rgba(16,14,10,0.85)", borderColor: "rgba(141,119,83,0.18)" }}
            >
              {/* hover 光晕 */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{ background: `radial-gradient(circle at center, ${shelf.color}08, transparent 70%)` }}
              />

              <div className="relative z-10 flex flex-col justify-between h-full gap-6">
                <div>
                  <div className="mb-4 text-2xl" style={{ color: shelf.color }}>{shelf.icon}</div>
                  <h3 className="font-serif text-lg tracking-[0.1em] text-[#f4e8c8]">{shelf.title}</h3>
                  <p className="mt-1 text-xs tracking-[0.08em] text-[#8d7753]">{shelf.subtitle}</p>
                  <div className="mt-3 h-px w-12" style={{ backgroundColor: "rgba(141,119,83,0.25)" }} />
                  <p className="mt-3 text-xs leading-6 text-[#7a6e52]">{shelf.desc}</p>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-xs uppercase tracking-[0.35em] text-[#5e5442]">
                    {shelf.files === 0 ? "Enter" : "Open"}
                  </span>
                  <span className="text-xs text-[#6f6249]">
                    {fmtCount(shelf.files)}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="relative z-10 text-center pb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#3d3529]">
            把文件放入 <span className="text-[#6f6249]">/public/knowledge/book/</span> 即可自动出现
          </p>
        </div>
      </main>
    );
  }

  /* ── 单个书架详情视图 ── */
  const meta = SHELF_META[activeShelf] || {};
  const shelfData = shelves.find(s => s.id === activeShelf);
  const fileCount = shelfData?.files ?? 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05060a] text-[#f4e6c3]">
      {backBtn}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-28">
        {/* 顶栏 */}
        <motion.div
          className="flex items-end justify-between border-b border-[#8d7753]/18 pb-6 mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.5em] text-[#6f6249]">{meta.subtitle}</p>
            <h2 className="font-serif text-3xl tracking-[0.15em] text-[#f4e8c8]">{meta.title}</h2>
          </div>
          <button
            onClick={() => setActiveShelf(null)}
            className="text-xs uppercase tracking-[0.35em] text-[#6f6249] hover:text-[#d6b77a] transition-colors duration-500"
          >
            ← 返回
          </button>
        </motion.div>

        {/* 文件列表区域 */}
        {fileCount === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-8 text-5xl text-[#d6b77a]/15">{meta.icon}</div>
            <p className="text-sm leading-8 text-[#5e5442] mb-2">这间书架还是空的。</p>
            <div className="mx-auto mb-8 h-px w-16" style={{ backgroundColor: "rgba(141,119,83,0.2)" }} />
            <div className="max-w-sm space-y-4 text-left">
              <div className="flex items-start gap-3">
                <span className="text-[#d6b77a]/30 text-sm mt-0.5">1</span>
                <p className="text-xs text-[#6f6249] leading-6">
                  打开项目文件夹中的 <code className="mx-1 px-2 py-0.5 bg-[#0b1020] border border-[#8d7753]/15 rounded text-[#d6b77a]/50 text-[10px]">public/knowledge/book/</code>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#d6b77a]/30 text-sm mt-0.5">2</span>
                <p className="text-xs text-[#6f6249] leading-6">把你的 PDF / DOCX / TXT 文件放进去</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#d6b77a]/30 text-sm mt-0.5">3</span>
                <p className="text-xs text-[#6f6249] leading-6">刷新页面，文件会自动出现在这里</p>
              </div>
            </div>
            <p className="mt-8 text-[10px] uppercase tracking-[0.4em] text-[#3d3529]">
              No code changes required
            </p>
          </motion.div>
        ) : (
          <p className="text-sm text-[#8d7753]">书架中有 {fileCount} 个文件。（文件列表功能开发中）</p>
        )}

        {/* 添加提示 */}
        <div className="mt-12 border-t border-[#8d7753]/12 pt-6">
          <p className="text-xs leading-7 text-[#3d3529]">
            <span className="mr-2 text-[#6f6249]">&#10022;</span>
            新增内容：把文件放入 <code className="mx-1 px-1.5 py-0.5 bg-[#0b1020] border border-[#8d7753]/10 rounded text-[#5e5442] text-[10px]">public/knowledge/book/</code> 刷新页面即可。
          </p>
        </div>
      </div>
    </main>
  );
}
