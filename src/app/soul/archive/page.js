"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ── 固定粒子（避免 SSR 警告） ──────────────────────────────
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
  { x: 24, y: 95, s: 1.8, o: 0.06, d: 23 },
  { x: 78, y: 62, s: 1.0, o: 0.13, d: 20 },
  { x: 50, y: 48, s: 1.5, o: 0.07, d: 15 },
  { x: 14, y: 29, s: 1.2, o: 0.11, d: 24 },
  { x: 97, y: 44, s: 2.0, o: 0.08, d: 17 },
];

// ── 文件类型图标和配色 ─────────────────────────────────────
const FILE_TYPES = {
  pdf:      { icon: "PDF",  color: "text-red-400/70",  border: "border-red-900/20",  bg: "bg-red-950/10" },
  document: { icon: "DOC",  color: "text-blue-400/70",  border: "border-blue-900/20", bg: "bg-blue-950/10" },
  image:    { icon: "IMG",  color: "text-emerald-400/70", border: "border-emerald-900/20", bg: "bg-emerald-950/10" },
  other:    { icon: "FILE", color: "text-zinc-400/70",  border: "border-zinc-700/20",  bg: "bg-zinc-900/10" },
};

// ── 文件大小格式化 ────────────────────────────────────────
function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ── 分馆入口配置 ─────────────────────────────────────────
const SECTION_META = {
  books:     { title: "BIBLIOTHECA",       subtitle: "典藏书阁", symbol: "✦", desc: "那些改变过意识的文字", accept: "PDF 文件" },
  notes:     { title: "COGNITIVE CORRIDOR", subtitle: "认知走廊", symbol: "☽", desc: "碎片化的思绪与感知", accept: "TXT / MD / DOCX" },
  clippings: { title: "IMAGE VAULT",       subtitle: "影像记忆", symbol: "⟁", desc: "捕捉到的瞬间与灵感", accept: "JPG / PNG / GIF / WEBP" },
};

/* ═══════════════════════════════════════════════════════
   主组件
   ═══════════════════════════════════════════════════════ */

export default function Archive() {
  const [activeSection, setActiveSection] = useState(null);
  const [archiveData, setArchiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 加载文件数据
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/archive");
        if (res.ok) {
          const data = await res.json();
          setArchiveData(data);
        }
      } catch {
        // API 不可用时静默失败
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalCount = archiveData
    ? Object.values(archiveData).reduce((sum, sec) => sum + sec.files.length, 0)
    : 0;

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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#161b2e_0%,#090b14_45%,#050816_100%)]" />
      <div className="absolute top-[-10%] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#d6b77a]/4 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-[#1a1410] blur-3xl opacity-60" />

      {/* ── 漂浮灰尘 ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.x + "-" + p.y}
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
              delay: PARTICLES.indexOf(p) * 0.4,
            }}
          />
        ))}
      </div>

      {/* ── 返回按钮 ── */}
      <Link
        href="/soul"
        className="absolute left-8 top-8 z-20 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#6f6249] transition-colors duration-500 hover:text-[#d6b77a]"
      >
        <span className="text-base">&#8592;</span>
        <span>Soul Realm</span>
      </Link>

      {/* ── 主内容 ── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-start px-6 pt-28 pb-24">

        {/* 馆名标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.65em] text-[#8d7753]">
            Psychology Knowledge Base
          </p>
          <h1 className="font-serif text-4xl tracking-[0.22em] text-[#ffe7b0] md:text-6xl">
            ARCHIVE
          </h1>
          <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-[#8d7753]/60 to-transparent" />
          <p className="mx-auto mt-6 max-w-md text-sm leading-8 text-[#8d7753]">
            记忆不会消失。它们只是等待被重新找到。
          </p>
          {totalCount > 0 && (
            <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-[#5e5442]">
              {totalCount} items archived
            </p>
          )}
        </motion.div>

        {/* ── 三扇馆门 / 分馆内容 ── */}
        <AnimatePresence mode="wait">

          {/* 首页：三扇馆门 */}
          {!activeSection && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              className="grid w-full max-w-4xl gap-6 md:grid-cols-3"
            >
              {Object.entries(SECTION_META).map(([key, meta], i) => {
                const count = archiveData?.[key]?.files.length ?? 0;
                return (
                  <motion.button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.18 + 0.3, duration: 1.6 }}
                    className="group relative overflow-hidden rounded-[28px] border border-[#8d7753]/20 bg-[#0b1020]/80 p-8 text-left backdrop-blur-md transition-all duration-700 hover:-translate-y-1"
                  >
                    {/* 门内深层光 */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#d6b77a0d_0%,transparent_70%)] opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
                    {/* 金色流光 */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute -left-16 top-0 h-full w-16 rotate-12 bg-gradient-to-r from-transparent via-[#ffe7b015] to-transparent blur-xl transition-all duration-[2500ms] group-hover:left-[130%]" />
                    </div>
                    {/* 内框 */}
                    <div className="absolute inset-4 rounded-[20px] border border-[#8d7753]/12" />

                    <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                      <div>
                        <div className="mb-5 text-2xl text-[#d6b77a]/60">{meta.symbol}</div>
                        <h2 className="font-serif text-xl tracking-[0.12em] text-[#ffe7b0]">
                          {meta.title}
                        </h2>
                        <p className="mt-1 text-xs tracking-[0.2em] text-[#8d7753]">
                          {meta.subtitle}
                        </p>
                        <div className="mt-4 h-px w-12 bg-[#8d7753]/35" />
                        <p className="mt-4 text-xs leading-6 text-[#7a6e5e]">{meta.desc}</p>
                        <p className="mt-2 text-[10px] text-[#5e5442]/60">
                          接受 {meta.accept}
                        </p>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-xs uppercase tracking-[0.35em] text-[#5e5442]">
                          Enter
                        </span>
                        <span className="text-xs text-[#6f6249]">
                          {count} 件
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* ── 分馆内容视图 ── */}
          {activeSection && (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 1.2 }}
              className="w-full max-w-4xl"
            >
              <SectionHeader
                meta={SECTION_META[activeSection]}
                onBack={() => setActiveSection(null)}
              />

              {/* 加载中 */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-32">
                  <motion.div
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl text-[#d6b77a]/30"
                  >
                    ✦
                  </motion.div>
                  <p className="mt-6 text-xs tracking-[0.3em] text-[#5e5442]">
                    正在扫描档案馆...
                  </p>
                </div>
              )}

              {/* 文件列表 */}
              {!loading && archiveData?.[activeSection] && (
                <>
                  {archiveData[activeSection].files.length === 0 ? (
                    <EmptyShelf
                      section={activeSection}
                      meta={SECTION_META[activeSection]}
                    />
                  ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                      {archiveData[activeSection].files.map((file, i) => (
                        <FileCard
                          key={file.name + "-" + file.modified}
                          file={file}
                          index={i}
                          section={activeSection}
                          onPreview={() => setPreviewUrl(file.url)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* 使用说明 */}
              <AddHint section={activeSection} meta={SECTION_META[activeSection]} />
            </motion.div>
          )}

        </AnimatePresence>

      </section>

      {/* ── 图片预览弹窗 ── */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/95 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewUrl(null)}
          >
            <motion.div
              className="relative max-w-3xl max-h-[85vh] w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              {/* 关闭 */}
              <button
                onClick={() => setPreviewUrl(null)}
                className="absolute -top-10 right-0 text-[#6f6249] hover:text-[#d6b77a] text-sm transition-colors"
              >
                close
              </button>

              {/* 图片 */}
              <div className="rounded-2xl border border-[#8d7753]/20 overflow-hidden bg-[#0b1020]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto object-contain max-h-[80vh]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部低语 */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-[#3d3328]">
          Memory is not storage. It is architecture.
        </p>
      </div>

    </main>
  );
}

/* ═══════════════════════════════════════════
   子组件
   ═══════════════════════════════════════════ */

function SectionHeader({ meta, onBack }) {
  return (
    <div className="mb-12 flex items-end justify-between border-b border-[#8d7753]/18 pb-6">
      <div>
        <p className="mb-1 text-xs uppercase tracking-[0.5em] text-[#6f6249]">
          {meta.subtitle}
        </p>
        <h2 className="font-serif text-3xl tracking-[0.15em] text-[#ffe7b0]">
          {meta.title}
        </h2>
      </div>
      <button
        onClick={onBack}
        className="text-xs uppercase tracking-[0.35em] text-[#6f6249] transition-colors duration-500 hover:text-[#d6b77a]"
      >
        &#8592; 返回
      </button>
    </div>
  );
}

function FileCard({ file, index, section, onPreview }) {
  const ft = FILE_TYPES[file.fileType] || FILE_TYPES.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 1.2 }}
      className="group relative overflow-hidden rounded-2xl border border-[#8d7753]/18 bg-[#0b1020]/80 backdrop-blur-sm transition-all duration-700 hover:-translate-y-0.5 hover:border-[#8d7753]/35"
    >
      {/* 图片缩略图 */}
      {file.fileType === "image" && (
        <div
          className="relative h-32 bg-[#0a0d18] cursor-pointer overflow-hidden"
          onClick={onPreview}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={file.url}
            alt={file.displayName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020] to-transparent" />
          <div className="absolute bottom-2 right-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#8d7753]/60 bg-[#050816]/60 px-2 py-0.5 rounded">
              preview
            </span>
          </div>
        </div>
      )}

      {/* PDF 缩略装饰 */}
      {file.fileType === "pdf" && (
        <div className="relative h-24 bg-[#0a0d18] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,60,60,0.04)_0%,transparent_70%)]" />
          <span className="text-3xl font-serif text-red-400/15 tracking-[0.1em]">
            PDF
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#8d7753]/10" />
        </div>
      )}

      {/* 文档缩略装饰 */}
      {file.fileType === "document" && (
        <div className="relative h-20 bg-[#0a0d18] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(60,120,220,0.04)_0%,transparent_70%)]" />
          <span className="text-2xl font-serif text-blue-400/15 tracking-[0.1em]">
            {file.ext.toUpperCase()}
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#8d7753]/10" />
        </div>
      )}

      {/* 内容区 */}
      <div className="p-5">
        {/* 顶部：类型标签 + 大小 */}
        <div className="mb-3 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] rounded border ${ft.border} ${ft.color}`}>
            <span>{ft.icon}</span>
            <span>{file.ext.toUpperCase()}</span>
          </span>
          <span className="text-[10px] text-[#5e5442]">
            {fmtSize(file.size)}
          </span>
        </div>

        {/* 文件名 */}
        <h3 className="font-serif text-base leading-snug tracking-wide text-[#ffe7b0] truncate">
          {file.displayName}
        </h3>

        {/* 日期 */}
        <p className="mt-1.5 text-xs text-[#5e5442]">
          {fmtDate(file.modified)}
        </p>

        {/* 分割线 */}
        <div className="my-3 h-px bg-[#8d7753]/15" />

        {/* 操作按钮 */}
        <div className="flex gap-2">
          {file.fileType === "pdf" && (
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 text-[10px] uppercase tracking-[0.25em] border border-[#8d7753]/20 text-[#d6b77a]/60 hover:bg-[#d6b77a]/5 hover:text-[#d6b77a] transition-all duration-500 rounded-lg"
            >
              打开阅读
            </a>
          )}
          {(file.fileType === "document" || file.fileType === "other") && (
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 text-[10px] uppercase tracking-[0.25em] border border-[#8d7753]/20 text-[#d6b77a]/60 hover:bg-[#d6b77a]/5 hover:text-[#d6b77a] transition-all duration-500 rounded-lg"
            >
              下载文件
            </a>
          )}
          {file.fileType === "image" && (
            <button
              onClick={onPreview}
              className="flex-1 text-center py-2 text-[10px] uppercase tracking-[0.25em] border border-[#8d7753]/20 text-[#d6b77a]/60 hover:bg-[#d6b77a]/5 hover:text-[#d6b77a] transition-all duration-500 rounded-lg"
            >
              查看大图
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyShelf({ section, meta }) {
  const folderPath = `public/archive/${section}/`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      {/* 空架图标 */}
      <div className="mb-8 relative">
        <div className="text-5xl text-[#d6b77a]/15">{meta.symbol}</div>
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 text-5xl text-[#d6b77a]/15 blur-sm"
        >
          {meta.symbol}
        </motion.div>
      </div>

      <p className="text-sm leading-8 text-[#5e5442] mb-2">
        这间馆室还是空的。
      </p>

      <div className="mx-auto mb-8 h-px w-16 bg-[#8d7753]/20" />

      {/* 使用步骤 */}
      <div className="max-w-sm space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-[#d6b77a]/30 text-sm mt-0.5">1</span>
          <p className="text-xs text-[#6f6249] leading-6">
            打开项目文件夹中的
            <code className="mx-1 px-2 py-0.5 bg-[#0b1020] border border-[#8d7753]/15 rounded text-[#d6b77a]/50">
              {folderPath}
            </code>
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-[#d6b77a]/30 text-sm mt-0.5">2</span>
          <p className="text-xs text-[#6f6249] leading-6">
            把你的 {meta.accept} 文件放进去
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
  );
}

function AddHint({ section, meta }) {
  const folderPath = `public/archive/${section}/`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 1.5 }}
      className="mt-12 border-t border-[#8d7753]/12 pt-6"
    >
      <p className="text-xs leading-7 text-[#3d3328]">
        <span className="mr-2 text-[#6f6249]">&#10022;</span>
        新增内容：把 {meta.accept} 文件放入
        <code className="mx-1 px-1.5 py-0.5 bg-[#0b1020] border border-[#8d7753]/10 rounded text-[#5e5442]">
          {folderPath}
        </code>
        刷新页面即可。
      </p>
    </motion.div>
  );
}
