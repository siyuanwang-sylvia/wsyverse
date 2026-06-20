import { NextResponse } from "next/server";
import { readdirSync, statSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

function getFileType(ext) {
  const e = ext.toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "gif", "avif", "svg", "bmp"].includes(e)) return "image";
  if (e === "pdf") return "pdf";
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(e)) return "video";
  if (["mp3", "wav", "ogg", "flac", "aac"].includes(e)) return "audio";
  if (["txt", "md", "mdx"].includes(e)) return "text";
  if (["doc", "docx"].includes(e)) return "doc";
  return "other";
}

function scanDir(dir) {
  let files = [];
  try {
    const items = readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const full = join(dir, item.name);
      if (item.isDirectory()) {
        files = files.concat(scanDir(full));
      } else if (!item.name.startsWith(".")) {
        const ext = item.name.includes(".") ? item.name.split(".").pop() : "";
        let info;
        try { info = statSync(full); } catch { info = null; }
        files.push({
          name: item.name,
          displayName: item.name.replace(/\.[^.]+$/, "").replace(/_/g, " "),
          ext: ext ? `.${ext}` : "",
          fileType: getFileType(ext),
          size: info?.size ?? 0,
          modified: info?.mtime?.toISOString() ?? new Date().toISOString(),
          url: full.replace(join(ROOT, "public"), "").replace(/\\/g, "/"),
        });
      }
    }
  } catch (_) {}
  return files;
}

export async function GET(_request) {
  const knowledgeRoot = join(ROOT, "public", "knowledge");
  let subdirs;
  try {
    subdirs = readdirSync(knowledgeRoot, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith("."))
      .map(d => d.name);
  } catch {
    return NextResponse.json({});
  }

  const result = {};
  for (const dir of subdirs) {
    const dirPath = join(knowledgeRoot, dir);
    const files = scanDir(dirPath);
    result[dir] = {
      files,
      count: files.length,
    };
  }

  return NextResponse.json(result);
}
