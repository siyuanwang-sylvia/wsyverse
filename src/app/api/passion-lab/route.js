import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const PASSION_ROOT = path.join(process.cwd(), "public/passion");

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const EVOLUTION_LEVELS = [
  { level: 0, name: "UNCHARTED", nameCN: "未发现", size: 50, fog: 0.8, desc: "Lost in the cosmic fog" },
  { level: 1, name: "DISCOVERED", nameCN: "初现", size: 80, fog: 0.4, desc: "Breaking through the mist" },
  { level: 2, name: "SETTLING", nameCN: "定居", size: 120, fog: 0, desc: "First structures rising" },
  { level: 3, name: "THRIVING", nameCN: "繁盛", size: 170, fog: 0, desc: "A living ecosystem" },
  { level: 4, name: "CIVILIZATION", nameCN: "文明", size: 220, fog: 0, desc: "A world of its own" },
];

const COSMOS_LANGUAGE = {
  image: { en: "Echoes", cn: "回响", icon: "◇" },
  video: { en: "Fragments", cn: "碎片", icon: "△" },
  pdf: { en: "Archives", cn: "档案", icon: "□" },
  text: { en: "Field Notes", cn: "野记", icon: "▽" },
  audio: { en: "Signals", cn: "信号", icon: "○" },
  doc: { en: "Archives", cn: "档案", icon: "□" },
  other: { en: "Relics", cn: "遗物", icon: "☆" },
};

function hashColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  const s = 50 + (h % 20);
  const l = 40 + (h % 15);
  return {
    h, s, l,
    bg: `hsl(${h},${s}%,${l}%)`,
    glow: `hsl(${h},${s + 10}%,${l + 15}%)`,
    light: `hsl(${h},${s - 10}%,${l + 30}%)`,
  };
}

function readIslandJson(folderPath) {
  const jp = path.join(folderPath, "island.json");
  if (fs.existsSync(jp)) {
    try { return JSON.parse(fs.readFileSync(jp, "utf8")); } catch (_) {}
  }
  return null;
}

function getEvolutionLevel(fileCount) {
  if (fileCount === 0) return EVOLUTION_LEVELS[0];
  if (fileCount <= 5) return EVOLUTION_LEVELS[1];
  if (fileCount <= 15) return EVOLUTION_LEVELS[2];
  if (fileCount <= 30) return EVOLUTION_LEVELS[3];
  return EVOLUTION_LEVELS[4];
}

function getFileTypeBreakdown(files) {
  const types = { image: 0, pdf: 0, text: 0, video: 0, audio: 0, doc: 0, other: 0 };
  files.forEach(f => { types[f.type] = (types[f.type] || 0) + 1; });
  return types;
}

function getFogLevel(latestMtime, baseFog) {
  if (baseFog > 0) return baseFog;
  const now = Date.now();
  const daysSinceActive = (now - latestMtime) / (1000 * 60 * 60 * 24);
  if (daysSinceActive < 3) return 0;
  if (daysSinceActive < 14) return 0.25;
  if (daysSinceActive < 30) return 0.45;
  return 0.65;
}

function getFeatures(fileTypes) {
  const features = [];
  if (fileTypes.image > 0) features.push({ type: "echoes", count: fileTypes.image, label: "Echoes" });
  if (fileTypes.pdf > 0 || fileTypes.doc > 0) features.push({ type: "archives", count: fileTypes.pdf + fileTypes.doc, label: "Archives" });
  if (fileTypes.text > 0) features.push({ type: "fieldNotes", count: fileTypes.text, label: "Field Notes" });
  if (fileTypes.video > 0) features.push({ type: "fragments", count: fileTypes.video, label: "Fragments" });
  if (fileTypes.audio > 0) features.push({ type: "signals", count: fileTypes.audio, label: "Signals" });
  return features;
}

function scanIslands() {
  if (!fs.existsSync(PASSION_ROOT)) return [];
  const dirs = fs.readdirSync(PASSION_ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== "node_modules")
    .map(d => d.name);

  const islands = dirs.map(name => {
    const folder = path.join(PASSION_ROOT, name);
    const custom = readIslandJson(folder);
    const c = hashColor(name);

    let fileCount = 0;
    let latestMtime = 0;
    const files = [];

    function walk(p) {
      try {
        fs.readdirSync(p, { withFileTypes: true }).forEach(f => {
          if (f.isDirectory()) walk(path.join(p, f.name));
          else {
            fileCount++;
            const full = path.join(p, f.name);
            const ext = f.name.split(".").pop().toLowerCase();
            let type = "other";
            if (["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext)) type = "image";
            else if (["pdf"].includes(ext)) type = "pdf";
            else if (["mp4", "webm", "mov", "avi"].includes(ext)) type = "video";
            else if (["mp3", "wav", "ogg", "flac", "aac"].includes(ext)) type = "audio";
            else if (["txt", "md", "mdx"].includes(ext)) type = "text";
            else if (["doc", "docx"].includes(ext)) type = "doc";
            const stats = fs.statSync(full);
            if (stats.mtimeMs > latestMtime) latestMtime = stats.mtimeMs;
            files.push({ type });
          }
        });
      } catch (_) {}
    }
    walk(folder);

    const evolution = getEvolutionLevel(fileCount);
    const fileTypes = getFileTypeBreakdown(files);
    const fogLevel = getFogLevel(latestMtime, evolution.fog);
    const features = getFeatures(fileTypes);

    return {
      id: name,
      name: custom?.name || name.replace(/-/g, " ").replace(/\b\w/g, ch => ch.toUpperCase()),
      subtitle: custom?.subtitle || "",
      desc: custom?.desc || "",
      color: custom?.color || c.bg,
      glow: custom?.glow || c.glow,
      light: custom?.light || c.light,
      icon: custom?.icon || "◇",
      realm: custom?.realm || "",
      fileCount,
      fileTypes,
      evolution,
      fogLevel,
      features,
      latestMtime,
      hasCustom: !!custom,
    };
  });

  // Golden-angle positioning for cosmic map
  const total = islands.length;
  islands.forEach((island, i) => {
    const r = 15 + Math.sqrt(i / Math.max(total, 1)) * 28;
    const angle = i * GOLDEN_ANGLE;
    island.position = {
      x: 50 + r * Math.cos(angle),
      y: 50 + r * Math.sin(angle),
    };
  });

  return islands;
}

export async function GET() {
  const islands = scanIslands();
  return NextResponse.json({ islands, language: COSMOS_LANGUAGE });
}
