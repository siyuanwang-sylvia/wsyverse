# Passion Lab — 宇宙海洋群岛

> "The body's expedition log. The soul's garden of light."

Passion Lab 不是固定栏目。
它是漂浮在宇宙海洋中的**热爱生态群岛**。

每座岛屿 = 一个热爱容器
每个容器里 = 漂浮的内容碎片（图片/PDF/视频/感悟……）

---

## 四大岛屿

| 岛屿 | 文件夹 | 领域 | 视觉主题 |
|------|--------|------|----------|
| Celestarium | `celestarium/` | 天文 | deep-cosmos（深蓝黑、星轨、极光） |
| The Sound Reef | `the-sound-reef/` | 音乐 | ocean-cave（深海音洞、声波纹理） |
| Motion Garden | `motion-garden/` | 艺术 | dream-garden（梦境花园、有机生长） |
| Playground | `playground/` | 运动 | dynamic-terrain（多变地貌、五大地形） |

## 技术架构

- **主入口**：`/passion` — 宇宙海洋视差页面，四岛漂浮海面之上
- **岛屿页**：`/passion/[island]` — 动态路由，主题化视觉+内容展示
- **API**：`/api/passion-lab` — 扫描 `public/passion/` 目录，返回岛屿列表
- **API**：`/api/passion-lab/[island]` — 扫描单个岛屿，返回文件+主题+sections
- **无码增内容**：在 `public/passion/` 下新建文件夹 = 新建岛屿

## 两大宇宙对比

| | Soul Realm | Passion Lab |
|---|---|---|
| 视觉 | 禁书馆 · 暗金 · 深邃 | 宇宙海洋 · 漂浮群岛 · 极光 |
| 气质 | 内省 · 沉静 | 热爱 · 探索 · 呼吸 |
| 参考 | 修道院 · 档案馆 | Sky光遇 · 宇宙星图 · 海洋 |

## 岛屿结构

每个岛屿通过 `island.json` 定义：
```json
{
  "name": "Celestarium",
  "subtitle": "The Quiet Orbit",
  "desc": "...",
  "color": "#0a1a3a",
  "glow": "#4a7aaa",
  "icon": "🔭",
  "realm": "celestial",
  "theme": {
    "bg": "#020818",
    "accent": "#4a8aaa",
    "particleColor": "rgba(120,180,220,0.5)",
    "atmosphere": "deep-cosmos"
  },
  "sections": [
    { "id": "star-charts", "name": "Star Charts", "icon": "⭐" }
  ],
  "instruments": [...]  // Sound Reef 专属
}
```

## 演化系统

基于文件数量自动进化：
- 0 文件 → UNCHARTED（未发现）
- 1-5 → DISCOVERED（初现）
- 6-15 → SETTLING（定居）
- 16-30 → THRIVING（繁盛）
- 31+ → CIVILIZATION（文明）

岛屿大小、光环、轨道环随演化等级增长。

## 雾系统

- < 3 天未更新：无雾
- 3-14 天：轻雾
- 14-30 天：中雾
- 30+ 天：重雾覆盖

## 开发历史

- [x] 岛屿文件夹结构（4岛 + 子区域）
- [x] island.json 身份文件（含 sections / theme / instruments）
- [x] Passion Lab 主页面 — 宇宙海洋群岛沉浸式体验
- [x] 岛屿详情页 — 主题化视觉 + sections 展示 + 乐器展示
- [x] API routes 更新（sections / theme / instruments 透传）
- [x] 到达动画 + 主题粒子 + 星云 + 极光系统
- [x] Unknown Island 保留
- [ ] 内容填充（用户放置文件）
- [ ] 声音天气系统（Sound Reef 专属）
- [ ] 岛屿生长可视化（树/灯塔/建筑）
- [ ] 可拖拽画布（未来）
