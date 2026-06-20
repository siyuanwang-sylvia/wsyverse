import { readdir, stat } from "fs/promises";
import { join, extname } from "path";

/**
 * GET /api/archive
 *
 * Scans public/archive/{books,notes,clippings} directories
 * and returns file listings with metadata.
 *
 * No code changes needed — just drop files into folders.
 */
export async function GET() {
  const base = join(process.cwd(), "public", "archive");
  const dirs = [
    { key: "books",     label: "BIBLIOTHECA", subtitle: "典藏书阁", desc: "那些改变过意识的文字" },
    { key: "notes",     label: "COGNITIVE CORRIDOR", subtitle: "认知走廊", desc: "碎片化的思绪与感知" },
    { key: "clippings", label: "IMAGE VAULT", subtitle: "影像记忆", desc: "捕捉到的瞬间与灵感" },
  ];

  const result = {};

  for (const dir of dirs) {
    try {
      const folderPath = join(base, dir.key);
      const names = await readdir(folderPath);

      // Filter out hidden files and directories
      const visible = names.filter(
        (n) => !n.startsWith(".") && n !== "README.md"
      );

      const fileInfos = await Promise.all(
        visible.map(async (name) => {
          const filePath = join(folderPath, name);
          try {
            const s = await stat(filePath);
            if (!s.isFile()) return null;
            const ext = extname(name).toLowerCase().replace(".", "");

            // Determine file type category
            const PDF_EXTS = ["pdf"];
            const DOC_EXTS = ["doc", "docx", "txt", "md"];
            const IMG_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];

            let fileType = "other";
            if (PDF_EXTS.includes(ext)) fileType = "pdf";
            else if (DOC_EXTS.includes(ext)) fileType = "document";
            else if (IMG_EXTS.includes(ext)) fileType = "image";

            // Generate display name (remove extension)
            const displayName = name.replace(/\.[^.]+$/, "");

            return {
              name,
              displayName,
              size: s.size,
              modified: s.mtime.toISOString(),
              ext,
              fileType,
              url: `/archive/${dir.key}/${encodeURIComponent(name)}`,
            };
          } catch {
            return null;
          }
        })
      );

      result[dir.key] = {
        ...dir,
        files: fileInfos.filter(Boolean).sort(
          (a, b) => b.modified.localeCompare(a.modified)
        ),
      };
    } catch {
      result[dir.key] = { ...dir, files: [] };
    }
  }

  return Response.json(result);
}
