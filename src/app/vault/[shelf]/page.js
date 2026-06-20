"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

/* ══════════════════════════════════
   书架元数据 — 3 个模块
   ══════════════════════════════════ */
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

/* 媒体类型筛选标签 */
const TYPE_TABS = [
  { key: "all",    label: "全部",  icon: "⊞" },
  { key: "image",  label: "照片",  icon: "◎" },
  { key: "video",  label: "视频",  icon: "▶" },
  { key: "audio",  label: "音频",  icon: "♪" },
  { key: "pdf",    label: "PDF",   icon: "📄" },
  { key: "doc",    label: "文档",  icon: "📝" },
  { key: "text",   label: "文本",  icon: "📃" },
  { key: "other",  label: "其他",  icon: "📁" },
];

function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/* ══════════════════════════════════
   页面主组件
   ══════════════════════════════════ */
export default function ShelfPage() {
  const { shelf: shelfId } = useParams();
  const meta = SHELF_META[shelfId];

  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/knowledge");
        if (res.ok) {
          const data = await res.json();
          setFiles(data[shelfId]?.files ?? []);
        }
      } catch (_) { /* 静默失败 */ }
      finally { setLoading(false); }
    }
    fetchData();
  }, [shelfId]);

  if (!meta) {
    return (
      <main className="relative min-h-screen scrollable-page bg-[#05060a] text-[#f4e6c3] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4 text-[#5a6a8a]">Shelf not found</h2>
          <Link href="/vault" className="text-[#5a7aa0] hover:text-[#8ab0d0] transition-colors text-sm">
            ← Return to Knowledge Vault
          </Link>
        </div>
      </main>
    );
  }

  /* ── 筛选 + 搜索 ── */
  const filteredFiles = useMemo(() => {
    if (!files) return [];
    let result = files;

    /* 媒体类型筛选 */
    if (activeType !== "all") {
      result = result.filter(f => f.fileType === activeType);
    }

    /* 搜索 */
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(f =>
        f.name.toLowerCase().includes(q) ||
        (f.displayName && f.displayName.toLowerCase().includes(q))
      );
    }

    return result;
  }, [files, activeType, searchQuery]);

  const fileCount = files?.length ?? 0;
  const filteredCount = filteredFiles.length;

  return (
    <main className="relative min-h-screen scrollable-page bg-[#05060a] text-[#f4e6c3]">
      {/* 返回键 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link href="/vault">
          <motion.div
            whileHover={{ x: -4 }}
            className="px-5 py-3 border border-amber-700/60 rounded-xl bg-[#0b1020]/95 backdrop-blur-lg text-sm uppercase tracking-[0.2em] text-amber-200 hover:bg-amber-900/30 hover:text-amber-100 transition-all duration-500 shadow-lg shadow-amber-900/20"
          >
            ← Vault
          </motion.div>
        </Link>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28">
        {/* 顶栏 */}
        <motion.div
          className="flex items-end justify-between border-b border-[#8d7753]/18 pb-6 mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.5em] text-[#6f6249]">{meta.subtitle}</p>
            <h2 className="font-serif text-3xl tracking-[0.15em] text-[#f4e8c8]">{meta.title}</h2>
            <p className="mt-2 text-xs text-[#7a6e52]">{meta.desc}</p>
          </div>
          <div className="text-xs text-[#5e5442] uppercase tracking-[0.3em]">
            {fileCount} {fileCount === 1 ? "file" : "files"}
          </div>
        </motion.div>

        {/* 搜索框 + 类型筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 space-y-4"
        >
          {/* 搜索框 */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索文件名、关键词..."
              className="w-full px-5 py-2.5 pl-11 rounded-xl bg-[#0b1020]/80 border border-[#8d7753]/25 text-sm text-[#e8d7b5] placeholder:text-[#5e5442] focus:outline-none focus:border-[#d6b77a]/40 focus:bg-[#0b1020] transition-all duration-500 tracking-[0.05em]"
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

          {/* 类型筛选标签 */}
          <div className="flex flex-wrap gap-2">
            {TYPE_TABS.map(tab => {
              const isActive = activeType === tab.key;
              const count = tab.key === "all"
                ? fileCount
                : files?.filter(f => f.fileType === tab.key).length ?? 0;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveType(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-[0.2em] border transition-all duration-500 ${
                    isActive
                      ? "border-[#d6b77a]/50 bg-[#d6b77a]/8 text-[#d6b77a]"
                      : "border-[#8d7753]/15 bg-transparent text-[#5e5442] hover:border-[#8d7753]/30 hover:text-[#8d7753]"
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                  <span className={`ml-1.5 ${isActive ? "text-[#d6b77a]/60" : "text-[#3d3529]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 文件列表 */}
        {loading || files === null ? (
          <div className="flex items-center justify-center py-24">
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl text-[#d6b77a]/30"
            >
              ✦
            </motion.div>
          </div>
        ) : fileCount === 0 ? (
          /* 空书架 */
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
            <div className="max-w-sm space-y-4 text-left">
              <div className="flex items-start gap-3">
                <span className="text-[#d6b77a]/30 text-sm mt-0.5">1</span>
                <p className="text-xs text-[#6f6249] leading-6">
                  打开项目文件夹中的
                  <code className="mx-1 px-2 py-0.5 bg-[#0b1020] border border-[#8d7753]/15 rounded text-[#d6b77a]/50 text-[10px]">
                    public/knowledge/{shelfId}/
                  </code>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#d6b77a]/30 text-sm mt-0.5">2</span>
                <p className="text-xs text-[#6f6249] leading-6">
                  按类型放入子文件夹：<br />
                  <code className="text-[#5e5442]">photos/</code> 照片 · <code className="text-[#5e5442]">videos/</code> 视频<br />
                  <code className="text-[#5e5442]">audio/</code> 音频 · <code className="text-[#5e5442]">files/</code> 文档
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
          <>
            {/* 筛选结果计数 */}
            {activeType !== "all" || searchQuery.trim() ? (
              <p className="mb-6 text-xs text-[#5e5442] uppercase tracking-[0.2em]">
                {filteredCount} / {fileCount} files
                {searchQuery.trim() && ` · 搜索"${searchQuery}"`}
              </p>
            ) : null}

            {/* 文件水falls 网格 */}
            {filteredCount === 0 ? (
              <div className="text-center py-16 text-[#5e5442] text-sm">
                没有匹配"{TYPE_TABS.find(t => t.key === activeType)?.label}"类型的文件
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
                {filteredFiles.map((file, i) => (
                  <div key={file.name + "-" + file.modified} className="mb-5 break-inside-avoid">
                    <FileCard file={file} index={i} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 添加提示 */}
        <div className="mt-12 border-t border-[#8d7753]/12 pt-6">
          <p className="text-xs leading-7 text-[#3d3529]">
            <span className="mr-2 text-[#6f6249]">✦</span>
            新增内容：把文件放入对应子文件夹
            <code className="mx-1 px-1.5 py-0.5 bg-[#0b1020] border border-[#8d7753]/10 rounded text-[#5e5442] text-[10px]">
              public/knowledge/{shelfId}/&lt;类型&gt;/
            </code>
            刷新页面即可。
          </p>
        </div>
      </div>
    </main>
  );
}

/* ══════════════════════════════════
   FileCard — 文件卡片（支持图片预览）
   ══════════════════════════════════ */
function FileCard({ file, index }) {
  const ft = file.fileType || "other";
  const isImage = ft === "image";
  const isVideo = ft === "video";
  const isPdf   = ft === "pdf";

  const iconMap = {
    pdf:   { label: "PDF",  color: "text-red-400/70",   border: "border-red-900/20" },
    image: { label: "IMG",  color: "text-emerald-400/70", border: "border-emerald-900/20" },
    video: { label: "VIDEO", color: "text-purple-400/70", border: "border-purple-900/20" },
    audio: { label: "AUDIO", color: "text-amber-400/70",  border: "border-amber-900/20" },
    text:  { label: "TXT",  color: "text-blue-400/70",  border: "border-blue-900/20" },
    doc:   { label: "DOC",  color: "text-blue-400/70",  border: "border-blue-900/20" },
    other: { label: "FILE", color: "text-zinc-400/70",  border: "border-zinc-700/20" },
  };
  const cfg = iconMap[ft] || iconMap.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group relative overflow-hidden rounded-xl border border-[#8d7753]/18 bg-[#0b1020]/80 backdrop-blur-sm hover:border-[#8d7753]/35 transition-all duration-500"
    >
      {/* 图片预览 */}
      {isImage && (
        <div className="relative overflow-hidden">
          <img
            src={file.url}
            alt={file.displayName}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020] via-transparent to-transparent opacity-60" />
        </div>
      )}

      {/* 视频图标 */}
      {isVideo && (
        <div className="relative h-28 flex items-center justify-center bg-[#0a0d18] overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(140,80,200,0.06) 0%, transparent 70%)" }} />
          <span className="text-3xl text-purple-400/20">▶</span>
          <span className="ml-2 text-xs uppercase tracking-[0.3em] text-purple-400/30">Video</span>
        </div>
      )}

      {/* PDF 图标区 */}
      {(isPdf) && (
        <div className="relative h-20 flex items-center justify-center bg-[#0a0d18] overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(180,60,60,0.04) 0%, transparent 70%)" }} />
          <span className="text-2xl font-serif text-red-400/20 tracking-[0.1em]">PDF</span>
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
            {isPdf ? "打开阅读" : isImage ? "查看图片" : isVideo ? "播放视频" : "下载文件"}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
