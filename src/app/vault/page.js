"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ═════════════════════════════════════
   从 API 加载书架数据
   ═════════════════════════════════════ */

const SHELF_META = {
  academic: {
    title: "学术类",
    subtitle: "Academic Archives",
    icon: "✦",
    desc: "会计 · 金融 · 心理 · AI · 博士研究 · 阅读",
    color: "#d6b77a",
  },
  art: {
    title: "艺术类",
    subtitle: "Artistic Realms",
    icon: "◇",
    desc: "设计 · 摄影 · 音乐 · 影视 · 创意文档",
    color: "#9a7dd0",
  },
  language: {
    title: "语言类",
    subtitle: "Language Studios",
    icon: "✿",
    desc: "英语 · 法语 · 日语 · 雅思 · 更多",
    color: "#7ab0a0",
  },
};

const SHELF_IDS = Object.keys(SHELF_META);

function fmtCount(n) {
  if (n === 0) return "Empty — awaiting contents";
  if (n === 1) return "1 file";
  return `${n} files`;
}

function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/* ═════════════════════════════════════
   主页面
   ═════════════════════════════════════ */

export default function VaultPage() {
  const [shelves, setShelves] = useState(null);
  const [activeShelf, setActiveShelf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/knowledge");
        if (res.ok) {
          const data = await res.json();
          const list = SHELF_IDS.map(id => {
            const meta = SHELF_META[id];
            const files = data[id]?.files ?? [];
            return { id, ...meta, fileCount: files.length, files };
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
    ? shelves.reduce((s, sh) => s + sh.fileCount, 0)
    : 0;

  /* ── 搜索过滤 ── */
  const filteredShelves = useMemo(() => {
    if (!shelves || !searchQuery.trim()) return shelves;
    const q = searchQuery.toLowerCase().trim();
    return shelves.map(sh => {
      const shelfMatch = sh.title.toLowerCase().includes(q)
        || sh.subtitle.toLowerCase().includes(q)
        || sh.desc.toLowerCase().includes(q);
      const matchedFiles = sh.files.filter(f =>
        f.name.toLowerCase().includes(q)
        || (f.displayName && f.displayName.toLowerCase().includes(q))
      );
      if (shelfMatch || matchedFiles.length > 0) {
        return { ...sh, files: shelfMatch ? sh.files : matchedFiles, fileCount: shelfMatch ? sh.fileCount : matchedFiles.length };
      }
      return null;
    }).filter(Boolean);
  }, [shelves, searchQuery]);

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
          className="px-5 py-3 border border-amber-700/60 rounded-xl bg-[#0b1020]/95 backdrop-blur-lg text-sm uppercase tracking-[0.2em] text-amber-200 hover:bg-amber-900/30 hover:text-amber-100 transition-all duration-500 shadow-lg shadow-amber-900/20"
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
              {searchQuery.trim() ? `找到 ${filteredShelves?.length ?? 0} 个书架 · ${filteredShelves?.reduce((s, sh) => s + sh.fileCount, 0) ?? 0} 个文件` : `${totalFiles} items archived`}
            </p>
          )}
        </motion.div>

        {/* 搜索框 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative z-10 max-w-lg mx-auto mt-2 mb-10"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索书籍、笔记、关键词..."
              className="w-full px-5 py-3 pl-12 rounded-xl bg-[#0b1020]/80 border border-[#8d7753]/25 text-sm text-[#e8d7b5] placeholder:text-[#5e5442] focus:outline-none focus:border-[#d6b77a]/40 focus:bg-[#0b1020] transition-all duration-500 tracking-[0.05em]"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5e5442] text-sm">🔍</span>
            {searchQuery.trim() && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5e5442] hover:text-[#d6b77a] text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>

        {/* 书架网格 */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(filteredShelves || shelves).map((shelf, i) => (
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
                    {shelf.fileCount === 0 ? "Enter" : "Open"}
                  </span>
                  <span className="text-xs text-[#6f6249]">
                    {fmtCount(shelf.fileCount)}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="relative z-10 text-center pb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#3d3529]">
            把文件放入 <span className="text-[#6f6249]">/public/knowledge/&lt;folder&gt;/</span> 即可自动出现
          </p>
        </div>
      </main>
    );
  }

  /* ── 单个书架详情视图 ── */
  const meta = SHELF_META[activeShelf] || {};
  const shelfData = shelves.find(s => s.id === activeShelf);
  const files = shelfData?.files ?? [];
  const fileCount = files.length;

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
            <div className="mb-8 relative">
              <div className="text-5xl text-[#d6b77a]/15">{meta.icon}</div>
              <motion.div
                animate={{ opacity: [0.1, 0.25, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 text-5xl text-[#d6b77a]/15 blur-sm"
              >
                {meta.icon}
              </motion.div>
            </div>

            <p className="text-sm leading-8 text-[#5e5442] mb-2">
              这间书架还是空的。
            </p>

            <div className="mx-auto mb-8 h-px w-16" style={{ backgroundColor: "rgba(141,119,83,0.2)" }} />

            {/* 使用步骤 */}
            <div className="max-w-sm space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-[#d6b77a]/30 text-sm mt-0.5">1</span>
                <p className="text-xs text-[#6f6249] leading-6">
                  打开项目文件夹中的
                  <code className="mx-1 px-2 py-0.5 bg-[#0b1020] border border-[#8d7753]/15 rounded text-[#d6b77a]/50 text-[10px]">
                    public/knowledge/{activeShelf}/
                  </code>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#d6b77a]/30 text-sm mt-0.5">2</span>
                <p className="text-xs text-[#6f6249] leading-6">
                  把你的 PDF / DOCX / TXT 文件放进去
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#d6b77a]/30 text-sm mt-0.5">3</span>
                <p className="text-xs text-[#6f6249] leading-6">
                  刷新页面，文件会自动出现在这里
                </p>
              </div>
            </div>

            <p className="mt-8 text-[10px] uppercase tracking-[0.4em] text-[#3d3529]">
              No code changes required
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {files.map((file, i) => (
              <FileCard key={file.name + "-" + file.modified} file={file} index={i} />
            ))}
          </div>
        )}

        {/* 添加提示 */}
        <div className="mt-12 border-t border-[#8d7753]/12 pt-6">
          <p className="text-xs leading-7 text-[#3d3529]">
            <span className="mr-2 text-[#6f6249]">&#10022;</span>
            新增内容：把文件放入
            <code className="mx-1 px-1.5 py-0.5 bg-[#0b1020] border border-[#8d7753]/10 rounded text-[#5e5442] text-[10px]">
              public/knowledge/{activeShelf}/
            </code>
            刷新页面即可。
          </p>
        </div>
      </div>
    </main>
  );
}

/* ═════════════════════════════════════
   FileCard — 文件卡片
   ═════════════════════════════════════ */

function FileCard({ file, index }) {
  const ft = file.fileType || "other";
  const iconMap = {
    pdf:   { label: "PDF", color: "text-red-400/70",   border: "border-red-900/20" },
    image: { label: "IMG", color: "text-emerald-400/70", border: "border-emerald-900/20" },
    text:  { label: "TXT", color: "text-blue-400/70",  border: "border-blue-900/20" },
    doc:   { label: "DOC", color: "text-blue-400/70",  border: "border-blue-900/20" },
    other: { label: "FILE", color: "text-zinc-400/70",  border: "border-zinc-700/20" },
  };
  const cfg = iconMap[ft] || iconMap.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.6 }}
      className="group relative overflow-hidden rounded-xl border border-[#8d7753]/18 bg-[#0b1020]/80 backdrop-blur-sm hover:border-[#8d7753]/35 transition-all duration-500"
    >
      {/* PDF / DOC 图标区 */}
      {(ft === "pdf" || ft === "doc") && (
        <div className="relative h-20 flex items-center justify-center bg-[#0a0d18] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,60,60,0.04)_0%,transparent_70%)]" />
          <span className={`text-2xl font-serif ${ft === "pdf" ? "text-red-400/20" : "text-blue-400/20"} tracking-[0.1em]`}>
            {ft.toUpperCase()}
          </span>
        </div>
      )}

      {/* 内容区 */}
      <div className="p-4">
        {/* 类型 + 大小 */}
        <div className="mb-2 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] rounded border ${cfg.border} ${cfg.color}`}>
            {cfg.label}
          </span>
          <span className="text-[10px] text-[#5e5442]">
            {fmtSize(file.size)}
          </span>
        </div>

        {/* 文件名 */}
        <h3 className="font-serif text-sm leading-snug text-[#f4e8c8] truncate">
          {file.displayName}
        </h3>

        {/* 修改日期 */}
        <p className="mt-1 text-[10px] text-[#5e5442]">
          {new Date(file.modified).toISOString().split("T")[0]}
        </p>

        {/* 操作按钮 */}
        <div className="mt-3 flex gap-2">
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-1.5 text-[10px] uppercase tracking-[0.25em] border border-[#8d7753]/20 text-[#d6b77a]/60 hover:bg-[#d6b77a]/5 hover:text-[#d6b77a] transition-all duration-500 rounded-lg"
          >
            {ft === "pdf" ? "打开阅读" : "下载文件"}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
