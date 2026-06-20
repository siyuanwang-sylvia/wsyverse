"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* ═══════════════════════════════════════════
   Knowledge Vault — 无限书架宇宙
   视觉体系：禁书馆黑金 + 空间感
   ═══════════════════════════════════════════ */

const SHELVES = [
  {
    id: "cpa",
    title: "CPA",
    subtitle: "注册会计师",
    icon: "📊",
    desc: "会计 · 审计 · 税法 · 财务成本管理",
    color: "#f4e6c3",
    files: 0,
  },
  {
    id: "ielts",
    title: "IELTS",
    subtitle: "雅思",
    icon: "✎",
    desc: "听力 · 阅读 · 写作 · 口语",
    color: "#e8d8a8",
    files: 0,
  },
  {
    id: "phd",
    title: "PhD Research",
    subtitle: "博士研究",
    icon: "⊹",
    desc: "论文 · 文献 · 研究方法 · 笔记",
    color: "#ddd0b0",
    files: 0,
  },
  {
    id: "finance",
    title: "Finance",
    subtitle: "金融",
    icon: "⬡",
    desc: "投资 · 衍生品 · 风险管理",
    color: "#e0d4b8",
    files: 0,
  },
  {
    id: "psychology",
    title: "Psychology",
    subtitle: "心理学",
    icon: "☽",
    desc: "荣格 · 认知 · 社会 · 发展",
    color: "#d8c8a0",
    files: 0,
  },
  {
    id: "ai",
    title: "Artificial Intelligence",
    subtitle: "人工智能",
    icon: "◇",
    desc: "机器学习 · LLM · RAG · 向量数据库",
    color: "#c8d8f0",
    files: 0,
  },
  {
    id: "languages",
    title: "Languages",
    subtitle: "语言",
    icon: "✿",
    desc: "英语 · 法语 · 日语 · 更多",
    color: "#d0c8a8",
    files: 0,
  },
  {
    id: "books",
    title: "Books",
    subtitle: "阅读",
    icon: "☰",
    desc: "电子书 · 笔记 · 摘录 · 书评",
    color: "#e4d8b4",
    files: 0,
  },
];

export default function VaultPage() {
  return (
    <main className="min-h-screen relative bg-[#05060a] text-[#f4e6c3] overflow-hidden">

      {/* 背景体积光 */}
      <div className="absolute top-[-200px] left-[10%] w-[600px] h-[600px] rounded-full bg-amber-500/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[5%] w-[500px] h-[500px] rounded-full bg-yellow-500/3 blur-3xl pointer-events-none" />

      {/* 返回键 */}
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

      {/* 标题区 */}
      <motion.div
        className="relative z-10 text-center pt-8 pb-12 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="
          text-3xl md:text-5xl
          tracking-[0.15em]
          font-serif
          text-[#f5e8c8]
          drop-shadow-[0_0_20px_rgba(255,215,100,0.06)]
        ">
          KNOWLEDGE VAULT
        </h2>
        <p className="mt-3 text-sm tracking-[0.1em] text-[#7a6e52] italic">
          &ldquo;Every shelf grows when you add a folder.&rdquo;
        </p>
      </motion.div>

      {/* 书架网格 */}
      <div className="
        relative z-10
        max-w-[1200px]
        mx-auto
        px-6 pb-24
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        gap-5
      ">
        {SHELVES.map((shelf, idx) => (
          <motion.div
            key={shelf.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.08, duration: 0.6 }}
          >
            <Link
              href={`/vault/${shelf.id}`}
              className="group block"
            >
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-lg
                  border
                  p-6
                  h-[200px]
                  flex flex-col justify-between
                  transition-all duration-500
                  hover:-translate-y-2
                  hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                "
                style={{
                  backgroundColor: "rgba(16,14,10,0.8)",
                  borderColor: "rgba(160,140,80,0.18)",
                }}
              >
                {/* 内部纹理 */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,220,140,0.5) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {/* 顶部：图标 + 书名 */}
                <div>
                  <div
                    className="text-2xl mb-3"
                    style={{ color: shelf.color }}
                  >
                    {shelf.icon}
                  </div>
                  <h3
                    className="text-lg tracking-[0.1em] font-serif"
                    style={{ color: shelf.color }}
                  >
                    {shelf.title}
                  </h3>
                  <p className="mt-1 text-xs tracking-[0.08em] text-[#6b5e42]">
                    {shelf.subtitle}
                  </p>
                </div>

                {/* 描述 */}
                <div>
                  <p className="text-[11px] leading-relaxed text-[#7a6e52]">
                    {shelf.desc}
                  </p>

                  {/* 文件计数 / 状态 */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                    <span className="text-[10px] tracking-[0.1em] text-[#5a4e38] uppercase">
                      {shelf.files === 0 ? "Empty — awaiting contents" : `${shelf.files} files`}
                    </span>
                  </div>
                </div>

                {/* hover 光晕 */}
                <div
                  className="
                    absolute inset-0 rounded-lg
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-500
                    pointer-events-none
                  "
                  style={{
                    background: `radial-gradient(ellipse at 50% 80%, ${shelf.color}08, transparent 70%)`,
                  }}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="relative z-10 text-center pb-12">
        <p className="text-[10px] tracking-[0.2em] text-[#3a3220] uppercase">
          Drop files into <span className="text-[#6b5e42]">/public/knowledge/</span> to auto-populate shelves
        </p>
      </div>
    </main>
  );
}
