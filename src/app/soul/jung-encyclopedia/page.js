"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

// 深色/浅色模式配置
const THEMES = {
  light: {
    bg: "bg-[#faf8f5]",
    bgCard: "bg-[#ffffff]/80",
    bgSidebar: "bg-[#f5f2ed]",
    text: "text-[#2c2c2c]",
    textSecondary: "text-[#6b6b6b]",
    textMuted: "text-[#a0a0a0]",
    border: "border-[#e8e4df]",
    accent: "text-[#7a9e7e]",
    accentBg: "bg-[#7a9e7e]/10",
    accentBorder: "border-[#7a9e7e]/30",
    heroGradient: "from-[#faf8f5] via-[#e8e4df]/50 to-[#d4d8c8]/30",
    cardShadow: "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
    cardHoverShadow: "shadow-[0_8px_30px_rgba(0,0,0,0.1)]",
    sidebarActive: "bg-[#7a9e7e]/20 text-[#7a9e7e]",
    stickyTop: "bg-[#faf8f5]/90",
  },
  dark: {
    bg: "bg-[#1a1a1a]",
    bgCard: "bg-[#2a2a2a]/80",
    bgSidebar: "bg-[#222222]",
    text: "text-[#e8e4df]",
    textSecondary: "text-[#a0a0a0]",
    textMuted: "text-[#6b6b6b]",
    border: "border-[#3a3a3a]",
    accent: "text-[#7a9e7e]",
    accentBg: "bg-[#7a9e7e]/20",
    accentBorder: "border-[#7a9e7e]/40",
    heroGradient: "from-[#1a1a1a] via-[#2a2a2a]/50 to-[#1a2a1a]/30",
    cardShadow: "shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
    cardHoverShadow: "shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
    sidebarActive: "bg-[#7a9e7e]/30 text-[#7a9e7e]",
    stickyTop: "bg-[#1a1a1a]/90",
  },
};

// 八种心理功能数据
const COGNITIVE_FUNCTIONS = [
  {
    id: "si",
    name: "Si",
    fullName: "内倾感觉 (Introverted Sensation)",
    keywords: ["细节", "经验", "传统", "记忆", "稳定"],
    definition: "Si 关注过去的经验、身体感受和已知的细节，通过对比当下与记忆来建立稳定感。",
    characteristics: "重视传统、细节导向、依赖经验、追求稳定、对熟悉环境有安全感",
    strengths: "极强的记忆力、细致入微的观察力、可靠的执行力、对传统价值的尊重",
    blindSpots: "可能抗拒变化、过度依赖过去经验、忽视未来的可能性",
    example: "一位会计仔细核对每一笔账目，使用熟悉的Excel模板，喜欢在固定的咖啡店工作。",
    color: "#7a9e7e",
  },
  {
    id: "se",
    name: "Se",
    fullName: "外倾感觉 (Extraverted Sensation)",
    keywords: ["当下", "行动", "感官", "冒险", "活力"],
    definition: "Se 专注于当下的物理现实，通过直接的感官体验来理解和影响世界。",
    characteristics: "行动导向、活在当下、感官敏锐、喜欢冒险、能量充沛",
    strengths: "快速反应能力、极强的适应能力、实际操作技能、充满活力的表现力",
    blindSpots: "可能缺乏长远规划、容易冲动、忽视内在感受、过度追求刺激",
    example: "一位消防员在紧急情况下迅速做出反应，准确判断火势蔓延方向，保护队友安全。",
    color: "#c4a35a",
  },
  {
    id: "ni",
    name: "Ni",
    fullName: "内倾直觉 (Introverted Intuition)",
    keywords: ["洞察", "未来", "模式", "象征", "远见"],
    definition: "Ni 通过无意识过程整合信息，形成对未来的洞察和象征性的理解。",
    characteristics: "远见卓识、模式识别、象征思维、未来导向、深度洞察",
    strengths: "战略思维能力、预见趋势、理解复杂系统、提出创新理论",
    blindSpots: "可能脱离现实、难以解释洞察来源、忽视细节、过度抽象",
    example: "一位企业家在别人还未察觉时就预见了移动互联网的浪潮，提前布局生态系统。",
    color: "#6a8eaa",
  },
  {
    id: "ne",
    name: "Ne",
    fullName: "外倾直觉 (Extraverted Intuition)",
    keywords: ["可能", "联想", "探索", "创新", "多元"],
    definition: "Ne 积极探索外部世界的可能性，通过联想和发散思维产生新的想法和连接。",
    characteristics: "创意无限、喜欢探索、开放包容、善于联想、追求新奇",
    strengths: "极强的创造力、快速建立联系、适应变化、启发他人思考",
    blindSpots: "可能缺乏专注、难以完成任务、过度分散精力、忽视深度",
    example: "一位产品经理在头脑风暴会议上提出十几个创新功能，将不同行业的最佳实践融合到产品中。",
    color: "#aa6a8e",
  },
  {
    id: "ti",
    name: "Ti",
    fullName: "内倾思考 (Introverted Thinking)",
    keywords: ["逻辑", "分析", "原理", "精确", "内在一致"],
    definition: "Ti 通过内在的逻辑框架来分析和理解世界，追求精确性和内在一致性。",
    characteristics: "逻辑严密、追求精确、喜欢分析、重视原理、独立思考",
    strengths: "极强的分析能力、逻辑构建能力、问题分解能力、理论创新能力",
    blindSpots: "可能忽视情感因素、过度分析、难以妥协、显得冷漠",
    example: "一位软件架构师设计一个高度模块化的系统，确保每个组件的逻辑独立性和可测试性。",
    color: "#8e6a6a",
  },
  {
    id: "te",
    name: "Te",
    fullName: "外倾思考 (Extraverted Thinking)",
    keywords: ["效率", "组织", "结果", "标准", "外部一致"],
    definition: "Te 通过外部标准和效率原则来组织世界，追求可衡量的结果和优化。",
    characteristics: "高效执行、目标导向、喜欢组织、重视标准、追求结果",
    strengths: "极强的执行力、项目管理能力、决策能力、资源优化能力",
    blindSpots: "可能忽视个体差异、过度标准化、缺乏灵活性、忽视情感需求",
    example: "一位CEO重新设计公司流程，引入KPI体系，将团队效率提升30%。",
    color: "#c47a5a",
  },
  {
    id: "fi",
    name: "Fi",
    fullName: "内倾情感 (Introverted Feeling)",
    keywords: ["价值", " authenticity", "内在和谐", "同理心", "个性"],
    definition: "Fi 通过内在的价值体系来理解和评价世界，追求真实性和内在和谐。",
    characteristics: "重视价值、追求真实、富有同理心、独立自主、情感深刻",
    strengths: "极强的价值判断力、真诚的表达、深度同理心、道德勇气",
    blindSpots: "可能过度个人化、难以妥协、忽视外部标准、显得自我中心",
    example: "一位社会工作者坚持为弱势群体争取权益，即使面临职业风险也不愿违背自己的价值观。",
    color: "#8e6a8e",
  },
  {
    id: "fe",
    name: "Fe",
    fullName: "外倾情感 (Extraverted Feeling)",
    keywords: ["和谐", "共情", "社会价值", "联系", " external consistency"],
    definition: "Fe 通过外部的情感氛围和社会价值来理解和影响世界，追求和谐与联系。",
    characteristics: "重视和谐、善于共情、喜欢社交、关注他人、追求共识",
    strengths: "极强的社交能力、团队协调能力、情感表达能力、冲突调解能力",
    blindSpots: "可能忽视个人需求、过度迎合、难以说"不"、失去自我边界",
    example: "一位团队领导敏锐地察觉到成员间的紧张关系，通过一对一沟通和团队建设活动恢复团队和谐。",
    color: "#5a8ec4",
  },
];

// 章节数据
const SECTIONS = [
  { id: "introduction", title: "引言", titleEn: "Introduction" },
  { id: "biography", title: "荣格生平", titleEn: "Biography" },
  { id: "theory", title: "理论发展", titleEn: "Theory Development" },
  { id: "functions", title: "八种心理功能", titleEn: "Eight Cognitive Functions" },
  { id: "relationships", title: "功能关系", titleEn: "Function Relationships" },
  { id: "applications", title: "实际应用", titleEn: "Applications" },
  { id: "resources", title: "延伸资源", titleEn: "Resources" },
];

// 荣格生平时间轴数据
const TIMELINE = [
  { year: "1875", event: "卡尔·古斯塔夫·荣格出生于瑞士凯斯维尔" },
  { year: "1895", event: "进入巴塞尔大学学习医学" },
  { year: "1900", event: "获得医学博士学位，开始精神病学研究" },
  { year: "1907", event: "与西格蒙德·弗洛伊德首次会面，开始密切合作" },
  { year: "1912", event: "出版《力比多的象征》，与弗洛伊德关系破裂" },
  { year: "1913-1917", event: ""直面无意识"时期，进行自我实验和梦境分析" },
  { year: "1921", event: "出版《心理类型》，系统阐述心理类型理论" },
  { year: "1933", event: "担任苏黎世联邦理工学院心理学教授" },
  { year: "1944", event: "出版《心理学与炼金术》" },
  { year: "1961", event: "在瑞士苏黎世去世，享年85岁" },
];

export default function JungEncyclopedia() {
  const [theme, setTheme] = useState("dark");
  const [activeSection, setActiveSection] = useState("introduction");
  const [expandedFunction, setExpandedFunction] = useState(null);
  const [flippedCard, setFlippedCard] = useState(null);
  const contentRef = useRef(null);

  const currentTheme = THEMES[theme];

  // 滚动监听，更新当前章节
  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.map((s) => s.id);
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 平滑滚动到指定章节
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 返回顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 切换深色/浅色模式
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-700`}>
      {/* 返回按钮 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link href="/soul">
          <motion.div
            whileHover={{ x: -4 }}
            className={`px-5 py-3 border ${currentTheme.border} rounded-xl ${currentTheme.bgCard} backdrop-blur-lg text-sm uppercase tracking-[0.2em] ${currentTheme.text} hover:${currentTheme.accentBg} hover:${currentTheme.accent} transition-all duration-500`}
          >
            ← Soul Realm
          </motion.div>
        </Link>
      </motion.div>

      {/* 深色/浅色模式切换 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="fixed top-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className={`px-5 py-3 border ${currentTheme.border} rounded-xl ${currentTheme.bgCard} backdrop-blur-lg text-sm uppercase tracking-[0.2em] ${currentTheme.text} hover:${currentTheme.accentBg} hover:${currentTheme.accent} transition-all duration-500`}
        >
          {theme === "dark" ? "☀ Light" : "☾ Dark"}
        </motion.button>
      </motion.div>

      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br ${currentTheme.heroGradient}`}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 神经网络线条 */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="neural" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="1" fill="currentColor" />
                <line x1="50" y1="50" x2="150" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="50" y2="150" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect fill="url(#neural)" width="100%" height="100%" />
          </svg>

          {/* 树木年轮 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02]"
          >
            <svg viewBox="0 0 800 800" className="w-full h-full">
              {[100, 200, 300, 400].map((r, i) => (
                <circle key={i} cx="400" cy="400" r={r} fill="none" stroke="currentColor" strokeWidth="0.5" />
              ))}
            </svg>
          </motion.div>
        </div>

        {/* Hero 内容 */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className={`text-sm uppercase tracking-[0.3em] ${currentTheme.textMuted} mb-6`}
          >
            Carl Jung
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className={`text-5xl md:text-7xl font-light ${currentTheme.text} mb-8 leading-tight`}
          >
            荣格心理类型理论
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className={`text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto leading-relaxed mb-12`}
          >
            探索人类心理的八种认知功能，理解个体如何感知世界、做出决策，并找到属于你的心理类型
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.1 }}
          >
            <button
              onClick={() => scrollToSection("introduction")}
              className={`px-8 py-4 ${currentTheme.accentBg} ${currentTheme.accent} border ${currentTheme.accentBorder} rounded-full text-sm uppercase tracking-[0.2em] hover:shadow-lg transition-all duration-500`}
            >
              开始探索 →
            </button>
          </motion.div>
        </div>

        {/* 向下滚动提示 */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${currentTheme.textMuted}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.section>

      {/* 主体内容区域 */}
      <div className="flex max-w-7xl mx-auto px-6 py-16 gap-8">
        {/* 左侧固定目录 */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`hidden lg:block w-64 fixed top-24 left-6 bottom-24 overflow-y-auto ${currentTheme.bgSidebar} rounded-2xl p-6 ${currentTheme.border} border`}
        >
          <nav className="space-y-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                  activeSection === section.id
                    ? currentTheme.sidebarActive
                    : `${currentTheme.textSecondary} hover:${currentTheme.accentBg}`
                }`}
              >
                <div className="font-medium">{section.title}</div>
                <div className={`text-xs ${currentTheme.textMuted} mt-0.5`}>{section.titleEn}</div>
              </button>
            ))}
          </nav>

          {/* 返回顶部按钮 */}
          <button
            onClick={scrollToTop}
            className={`mt-8 w-full px-4 py-3 rounded-lg text-sm ${currentTheme.textMuted} hover:${currentTheme.accentBg} hover:${currentTheme.accent} transition-all duration-300`}
          >
            ↑ 返回顶部
          </button>
        </motion.aside>

        {/* 主内容区域 */}
        <main className="flex-1 lg:ml-72 space-y-24" ref={contentRef}>
          {/* 引言 */}
          <section id="introduction" className="scroll-mt-24">
            <FadeInSection>
              <h2 className={`text-3xl font-light ${currentTheme.text} mb-8`}>引言</h2>
              <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-8 ${currentTheme.cardShadow} border ${currentTheme.border}`}>
                <p className={`${currentTheme.textSecondary} leading-relaxed mb-6`}>
                  卡尔·古斯塔夫·荣格（Carl Gustav Jung, 1875-1961）是瑞士心理学家，分析心理学创始人。他提出的心理类型理论，特别是八种认知功能模型，为我们理解人类心理差异提供了深刻的框架。
                </p>
                <p className={`${currentTheme.textSecondary} leading-relaxed mb-6`}>
                  与迈尔斯-布里格斯类型指标（MBTI）不同，荣格的原初理论更加精细和深邃。八种认知功能不仅仅是类型的标签，而是心理能量的流动方式，是个体与世界互动的基本模式。
                </p>
                <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                  本百科将带你深入理解这八种心理功能，探索它们如何在日常生活中显现，以及如何通过自我觉察实现心理整合与成长。
                </p>
              </div>
            </FadeInSection>
          </section>

          {/* 荣格生平时间轴 */}
          <section id="biography" className="scroll-mt-24">
            <FadeInSection>
              <h2 className={`text-3xl font-light ${currentTheme.text} mb-8`}>荣格生平</h2>
              <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-8 ${currentTheme.cardShadow} border ${currentTheme.border}`}>
                <div className="relative">
                  {/* 时间轴线 */}
                  <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${currentTheme.accentBg}`} />

                  {TIMELINE.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="relative pl-12 pb-8 last:pb-0"
                    >
                      {/* 时间轴点 */}
                      <div className={`absolute left-2.5 top-1.5 w-3 h-3 ${currentTheme.accentBg} border-2 ${currentTheme.accentBorder} rounded-full`} />

                      <div className={`text-sm ${currentTheme.accent} font-medium mb-2`}>{item.year}</div>
                      <div className={`${currentTheme.textSecondary} leading-relaxed`}>{item.event}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* 理论发展 */}
          <section id="theory" className="scroll-mt-24">
            <FadeInSection>
              <h2 className={`text-3xl font-light ${currentTheme.text} mb-8`}>理论发展</h2>
              <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-8 ${currentTheme.cardShadow} border ${currentTheme.border} space-y-6`}>
                <div>
                  <h3 className={`text-xl ${currentTheme.text} mb-4`}>心理能量的方向：内倾 vs 外倾</h3>
                  <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                    荣格认为，心理能量要么流向内部世界（内倾，Introversion），要么流向外部世界（外倾，Extraversion）。这不是简单的"内向"或"外向"性格，而是心理能量的根本取向。
                  </p>
                </div>

                <div>
                  <h3 className={`text-xl ${currentTheme.text} mb-4`}>四种心理功能</h3>
                  <p className={`${currentTheme.textSecondary} leading-relaxed mb-4`}>
                    荣格识别出四种基本的心理功能，分为两组对立的类型：
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: "感觉 (Sensation)", desc: "我们通过感官接收信息的方式" },
                      { title: "直觉 (Intuition)", desc: "我们感知模式和可能性的方式" },
                      { title: "思考 (Thinking)", desc: "我们做出逻辑判断的方式" },
                      { title: "情感 (Feeling)", desc: "我们做出价值评判的方式" },
                    ].map((item, i) => (
                      <div key={i} className={`p-4 rounded-xl ${currentTheme.accentBg} border ${currentTheme.accentBorder}`}>
                        <div className={`font-medium ${currentTheme.accent} mb-1`}>{item.title}</div>
                        <div className={`text-sm ${currentTheme.textSecondary}`}>{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`text-xl ${currentTheme.text} mb-4`}>八种认知功能</h3>
                  <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                    将心理能量的方向（内倾/外倾）与四种心理功能相结合，就得到了八种认知功能。每个人都会使用所有八种功能，但通常有一两种是主导的，这构成了个体的心理类型。
                  </p>
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* 八种心理功能 */}
          <section id="functions" className="scroll-mt-24">
            <FadeInSection>
              <h2 className={`text-3xl font-light ${currentTheme.text} mb-8`}>八种心理功能</h2>
              <p className={`${currentTheme.textSecondary} leading-relaxed mb-12 max-w-3xl`}>
                点击每个功能卡片查看详细信息。每个功能都有其独特的定义、特点、优势、盲点和生活实例。
              </p>
            </FadeInSection>

            <div className="grid md:grid-cols-2 gap-6">
              {COGNITIVE_FUNCTIONS.map((func, index) => (
                <FadeInSection key={func.id} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl ${currentTheme.cardShadow} border ${currentTheme.border} overflow-hidden cursor-pointer`}
                    onClick={() => setExpandedFunction(expandedFunction === func.id ? null : func.id)}
                  >
                    {/* 卡片头部 */}
                    <div className="p-6" style={{ borderLeft: `4px solid ${func.color}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-3xl font-light mb-1" style={{ color: func.color }}>
                            {func.name}
                          </div>
                          <div className={`text-sm ${currentTheme.textSecondary}`}>{func.fullName}</div>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedFunction === func.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={`text-2xl ${currentTheme.textMuted}`}
                        >
                          ↓
                        </motion.div>
                      </div>

                      {/* 关键词 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {func.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 text-xs rounded-full ${currentTheme.accentBg} ${currentTheme.accent}`}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      <p className={`${currentTheme.textSecondary} text-sm leading-relaxed`}>
                        {func.definition}
                      </p>
                    </div>

                    {/* 展开内容 */}
                    <AnimatePresence>
                      {expandedFunction === func.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="overflow-hidden"
                        >
                          <div className={`px-6 pb-6 space-y-4 border-t ${currentTheme.border}`}>
                            <div className="pt-4">
                              <div className={`text-sm font-medium ${currentTheme.accent} mb-2`}>特点</div>
                              <div className={`text-sm ${currentTheme.textSecondary} leading-relaxed`}>{func.characteristics}</div>
                            </div>

                            <div>
                              <div className={`text-sm font-medium ${currentTheme.accent} mb-2`}>优势</div>
                              <div className={`text-sm ${currentTheme.textSecondary} leading-relaxed`}>{func.strengths}</div>
                            </div>

                            <div>
                              <div className={`text-sm font-medium ${currentTheme.accent} mb-2`}>盲点</div>
                              <div className={`text-sm ${currentTheme.textSecondary} leading-relaxed`}>{func.blindSpots}</div>
                            </div>

                            <div>
                              <div className={`text-sm font-medium ${currentTheme.accent} mb-2`}>生活实例</div>
                              <div className={`text-sm ${currentTheme.textSecondary} leading-relaxed italic`}>
                                "{func.example}"
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </FadeInSection>
              ))}
            </div>
          </section>

          {/* 功能关系图 */}
          <section id="relationships" className="scroll-mt-24">
            <FadeInSection>
              <h2 className={`text-3xl font-light ${currentTheme.text} mb-8`}>功能关系</h2>
              <p className={`${currentTheme.textSecondary} leading-relaxed mb-12 max-w-3xl`}>
                八种认知功能之间通过"对立"、"辅助"和"补偿"等关系相互影响，形成个体的心理类型结构。
              </p>
            </FadeInSection>

            {/* 功能对关系图 */}
            <FadeInSection>
              <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-8 ${currentTheme.cardShadow} border ${currentTheme.border} mb-8`}>
                <h3 className={`text-xl ${currentTheme.text} mb-6`}>四组功能对</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      pair: "Si – Ne",
                      desc: "内倾感觉 vs 外倾直觉：稳定与探索的平衡",
                      color: "#7a9e7e",
                    },
                    {
                      pair: "Ni – Se",
                      desc: "内倾直觉 vs 外倾感觉：洞察与行动的平衡",
                      color: "#6a8eaa",
                    },
                    {
                      pair: "Ti – Fe",
                      desc: "内倾思考 vs 外倾情感：分析与共情的平衡",
                      color: "#8e6a6a",
                    },
                    {
                      pair: "Fi – Te",
                      desc: "内倾情感 vs 外倾思考：价值与效率的平衡",
                      color: "#8e6a8e",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-xl border ${currentTheme.border} hover:${currentTheme.cardHoverShadow} transition-all duration-500`}
                    >
                      <div className="text-2xl font-light mb-3" style={{ color: item.color }}>
                        {item.pair}
                      </div>
                      <div className={`text-sm ${currentTheme.textSecondary} leading-relaxed`}>{item.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInSection>

            {/* 功能关系可视化 */}
            <FadeInSection>
              <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-8 ${currentTheme.cardShadow} border ${currentTheme.border} mb-8`}>
                <h3 className={`text-xl ${currentTheme.text} mb-6`}>八种功能关系图</h3>
                <p className={`${currentTheme.textSecondary} text-sm leading-relaxed mb-6`}>
                  下面的关系图展示了八种认知功能之间的对应关系。对立功能（如 Si-Ne）形成互补的平衡关系。
                </p>
                
                <div className="flex justify-center">
                  <svg width="600" height="600" viewBox="0 0 600 600" className="max-w-full h-auto">
                    {/* 背景圆 */}
                    <circle cx="300" cy="300" r="250" fill="none" stroke={`${currentTheme.border.includes('border-[') ? '#e8e4df' : '#3a3a3a'}`} strokeWidth="1" opacity="0.3" />
                    <circle cx="300" cy="300" r="180" fill="none" stroke={`${currentTheme.border.includes('border-[') ? '#e8e4df' : '#3a3a3a'}`} strokeWidth="1" opacity="0.2" />
                    
                    {/* 连接线 - 对立功能对 */}
                    <line x1="300" y1="100" x2="300" y2="500" stroke="#7a9e7e" strokeWidth="2" opacity="0.6" />
                    <line x1="100" y1="300" x2="500" y2="300" stroke="#6a8eaa" strokeWidth="2" opacity="0.6" />
                    <line x1="158" y1="158" x2="442" y2="442" stroke="#8e6a6a" strokeWidth="2" opacity="0.6" />
                    <line x1="442" y1="158" x2="158" y2="442" stroke="#8e6a8e" strokeWidth="2" opacity="0.6" />
                    
                    {/* 功能节点 */}
                    {/* Si */}
                    <circle cx="300" cy="100" r="30" fill={currentTheme.bgCard} stroke="#7a9e7e" strokeWidth="3" />
                    <text x="300" y="105" textAnchor="middle" fill={currentTheme.text} fontSize="16" fontWeight="light">Si</text>
                    <text x="300" y="70" textAnchor="middle" fill="#7a9e7e" fontSize="12">内倾感觉</text>
                    
                    {/* Ne */}
                    <circle cx="300" cy="500" r="30" fill={currentTheme.bgCard} stroke="#7a9e7e" strokeWidth="3" />
                    <text x="300" y="505" textAnchor="middle" fill={currentTheme.text} fontSize="16" fontWeight="light">Ne</text>
                    <text x="300" y="540" textAnchor="middle" fill="#7a9e7e" fontSize="12">外倾直觉</text>
                    
                    {/* Ni */}
                    <circle cx="100" cy="300" r="30" fill={currentTheme.bgCard} stroke="#6a8eaa" strokeWidth="3" />
                    <text x="100" y="305" textAnchor="middle" fill={currentTheme.text} fontSize="16" fontWeight="light">Ni</text>
                    <text x="60" y="270" textAnchor="middle" fill="#6a8eaa" fontSize="12">内倾直觉</text>
                    
                    {/* Se */}
                    <circle cx="500" cy="300" r="30" fill={currentTheme.bgCard} stroke="#6a8eaa" strokeWidth="3" />
                    <text x="500" y="305" textAnchor="middle" fill={currentTheme.text} fontSize="16" fontWeight="light">Se</text>
                    <text x="540" y="270" textAnchor="middle" fill="#6a8eaa" fontSize="12">外倾感觉</text>
                    
                    {/* Ti */}
                    <circle cx="158" cy="158" r="30" fill={currentTheme.bgCard} stroke="#8e6a6a" strokeWidth="3" />
                    <text x="158" y="163" textAnchor="middle" fill={currentTheme.text} fontSize="16" fontWeight="light">Ti</text>
                    <text x="120" y="125" textAnchor="middle" fill="#8e6a6a" fontSize="12">内倾思考</text>
                    
                    {/* Fe */}
                    <circle cx="442" cy="442" r="30" fill={currentTheme.bgCard} stroke="#8e6a6a" strokeWidth="3" />
                    <text x="442" y="447" textAnchor="middle" fill={currentTheme.text} fontSize="16" fontWeight="light">Fe</text>
                    <text x="480" y="480" textAnchor="middle" fill="#8e6a6a" fontSize="12">外倾情感</text>
                    
                    {/* Fi */}
                    <circle cx="442" cy="158" r="30" fill={currentTheme.bgCard} stroke="#8e6a8e" strokeWidth="3" />
                    <text x="442" y="163" textAnchor="middle" fill={currentTheme.text} fontSize="16" fontWeight="light">Fi</text>
                    <text x="480" y="125" textAnchor="middle" fill="#8e6a8e" fontSize="12">内倾情感</text>
                    
                    {/* Te */}
                    <circle cx="158" cy="442" r="30" fill={currentTheme.bgCard} stroke="#8e6a8e" strokeWidth="3" />
                    <text x="158" y="447" textAnchor="middle" fill={currentTheme.text} fontSize="16" fontWeight="light">Te</text>
                    <text x="120" y="480" textAnchor="middle" fill="#8e6a8e" fontSize="12">外倾思考</text>
                    
                    {/* 图例 */}
                    <rect x="50" y="560" width="20" height="3" fill="#7a9e7e" />
                    <text x="80" y="565" fill={currentTheme.textSecondary} fontSize="11">Si-Ne 对</text>
                    
                    <rect x="200" y="560" width="20" height="3" fill="#6a8eaa" />
                    <text x="230" y="565" fill={currentTheme.textSecondary} fontSize="11">Ni-Se 对</text>
                    
                    <rect x="350" y="560" width="20" height="3" fill="#8e6a6a" />
                    <text x="380" y="565" fill={currentTheme.textSecondary} fontSize="11">Ti-Fe 对</text>
                    
                    <rect x="480" y="560" width="20" height="3" fill="#8e6a8e" />
                    <text x="510" y="565" fill={currentTheme.textSecondary} fontSize="11">Fi-Te 对</text>
                  </svg>
                </div>
              </div>
            </FadeInSection>

            {/* 类型表 */}
            <FadeInSection>
              <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-8 ${currentTheme.cardShadow} border ${currentTheme.border}`}>
                <h3 className={`text-xl ${currentTheme.text} mb-6`}>十六种心理类型</h3>
                <p className={`${currentTheme.textSecondary} leading-relaxed mb-6`}>
                  每种心理类型由四个字母组成，分别代表：能量方向（E/I）、信息收集（S/N）、决策方式（T/F）、生活方式（J/P）。
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"].map((type) => (
                    <motion.div
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      className={`px-4 py-3 rounded-lg ${currentTheme.accentBg} ${currentTheme.accent} text-center text-sm font-medium cursor-pointer hover:shadow-md transition-all duration-300`}
                    >
                      {type}
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* 实际应用 */}
          <section id="applications" className="scroll-mt-24">
            <FadeInSection>
              <h2 className={`text-3xl font-light ${currentTheme.text} mb-8`}>实际应用</h2>
              <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-8 ${currentTheme.cardShadow} border ${currentTheme.border} space-y-6`}>
                <div>
                  <h3 className={`text-xl ${currentTheme.text} mb-4`}>自我认知与成长</h3>
                  <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                    了解自己的主导功能和劣势功能，可以帮助我们理解自己的行为模式、沟通风格和学习偏好。通过有意识地发展非主导功能，我们可以实现心理的整合与平衡。
                  </p>
                </div>

                <div>
                  <h3 className={`text-xl ${currentTheme.text} mb-4`}>人际关系</h3>
                  <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                    理解他人的心理类型，可以帮助我们更好地沟通、减少冲突。例如，思考型的人可能需要学习表达对他人的欣赏，而情感型的人可能需要学习直接表达分歧。
                  </p>
                </div>

                <div>
                  <h3 className={`text-xl ${currentTheme.text} mb-4`}>职业选择</h3>
                  <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                    不同的心理功能偏好适合不同的职业环境。例如，主导功能为 Ti 的人可能在研究、分析或编程领域表现出色，而主导功能为 Fe 的人可能在教育、咨询或人力资源领域找到满足感。
                  </p>
                </div>

                <div>
                  <h3 className={`text-xl ${currentTheme.text} mb-4`}>团队协作</h3>
                  <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                    在团队中，不同心理类型的成员可以互补。了解团队成员的类型分布，可以帮助领导者合理分配任务、优化沟通方式、提升团队效能。
                  </p>
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* 延伸资源 */}
          <section id="resources" className="scroll-mt-24">
            <FadeInSection>
              <h2 className={`text-3xl font-light ${currentTheme.text} mb-8`}>延伸资源</h2>
            </FadeInSection>

            <div className="grid md:grid-cols-2 gap-6">
              <FadeInSection>
                <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-8 ${currentTheme.cardShadow} border ${currentTheme.border}`}>
                  <h3 className={`text-xl ${currentTheme.text} mb-6`}>在线测试</h3>
                  <a
                    href="https://www.jungus.cn/zh-hans/test/Standard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 ${currentTheme.accentBg} ${currentTheme.accent} rounded-lg hover:shadow-lg transition-all duration-500`}
                  >
                    荣格认知功能测试 →
                  </a>
                </div>
              </FadeInSection>

              <FadeInSection>
                <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-8 ${currentTheme.cardShadow} border ${currentTheme.border}`}>
                  <h3 className={`text-xl ${currentTheme.text} mb-6`}>推荐阅读</h3>
                  <ul className={`space-y-3 ${currentTheme.textSecondary}`}>
                    <li>• 《心理类型》- 卡尔·荣格</li>
                    <li>• 《荣格心理学入门》- 徐均</li>
                    <li>• 《类型与原型》- 约翰·毕比</li>
                    <li>• 《请理解我》- 大卫·凯尔西</li>
                  </ul>
                </div>
              </FadeInSection>

              <FadeInSection>
                <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-8 ${currentTheme.cardShadow} border ${currentTheme.border}`}>
                  <h3 className={`text-xl ${currentTheme.text} mb-6`}>延伸学习路线</h3>
                  <div className="space-y-3">
                    {[
                      "MBTI 十六种类型详解",
                      "认知功能发展 stages",
                      "原型理论：阴影、阿尼玛、阿尼姆斯",
                      "集体无意识与象征",
                      "个体化过程（Individuation）",
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 ${currentTheme.textSecondary}`}>
                        <span className={currentTheme.accent}>→</span>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInSection>

              <FadeInSection>
                <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-8 ${currentTheme.cardShadow} border ${currentTheme.border}`}>
                  <h3 className={`text-xl ${currentTheme.text} mb-6`}>相关主题</h3>
                  <div className="flex flex-wrap gap-3">
                    {["MBTI", "认知功能", "原型理论", "集体无意识", "个体化", "梦的解析", "炼金术心理学"].map((tag, i) => (
                      <span
                        key={i}
                        className={`px-4 py-2 text-sm rounded-full ${currentTheme.accentBg} ${currentTheme.accent} cursor-pointer hover:shadow-md transition-all duration-300`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInSection>
            </div>
          </section>

          {/* 继续探索 */}
          <section className="pt-12">
            <FadeInSection>
              <div className={`${currentTheme.bgCard} backdrop-blur-lg rounded-2xl p-12 ${currentTheme.cardShadow} border ${currentTheme.border} text-center`}>
                <div className={`text-sm uppercase tracking-[0.3em] ${currentTheme.textMuted} mb-6`}>Continue Exploring</div>
                <h2 className={`text-3xl font-light ${currentTheme.text} mb-8`}>继续探索</h2>
                <p className={`${currentTheme.textSecondary} leading-relaxed mb-8 max-w-2xl mx-auto`}>
                  心理学是一片广阔的海洋，荣格的理论只是其中的一座岛屿。继续探索，你会发现更多关于人类心灵的奥秘。
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/soul">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`px-6 py-3 ${currentTheme.accentBg} ${currentTheme.accent} rounded-lg hover:shadow-lg transition-all duration-500`}
                    >
                      ← 返回 Soul Realm
                    </motion.div>
                  </Link>
                  <Link href="/soul/tests">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`px-6 py-3 border ${currentTheme.border} ${currentTheme.text} rounded-lg hover:${currentTheme.accentBg} hover:${currentTheme.accent} transition-all duration-500`}
                    >
                      更多测试 →
                    </motion.div>
                  </Link>
                </div>
              </div>
            </FadeInSection>
          </section>
        </main>
      </div>

      {/* 页脚 */}
      <footer className={`${currentTheme.border} border-t py-12 px-6`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className={`text-sm ${currentTheme.textMuted} mb-4`}>Carl Jung | 荣格心理类型理论</div>
          <div className={`text-xs ${currentTheme.textMuted}`}>
            A knowledge encyclopedia crafted with care • 一本可交互、可长期维护的在线心理学百科
          </div>
        </div>
      </footer>
    </div>
  );
}

// 滚动渐显组件
function FadeInSection({ children, delay = 0 }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}
