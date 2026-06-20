# 荣格心理类型理论 - 内容管理说明

## 文件夹结构

```
public/jung-encyclopedia/
├── content/          # 存放 Markdown 或 JSON 格式的内容文件
│   ├── introduction.md
│   ├── biography.md
│   ├── theory.md
│   ├── functions/     # 八种心理功能的详细内容
│   │   ├── si.md
│   │   ├── se.md
│   │   ├── ni.md
│   │   ├── ne.md
│   │   ├── ti.md
│   │   ├── te.md
│   │   ├── fi.md
│   │   └── fe.md
│   ├── relationships.md
│   ├── applications.md
│   └── resources.md
└── images/           # 存放插图、照片等
    ├── hero/
    ├── timeline/
    ├── functions/
    └── diagrams/
```

## 如何使用

### 1. 添加章节内容

在 `content/` 目录下创建 Markdown 文件，例如 `introduction.md`：

```markdown
# 引言

卡尔·古斯塔夫·荣格（Carl Gustav Jung, 1875-1961）是瑞士心理学家...

## 小节标题

内容...
```

### 2. 添加心理功能详细内容

在 `content/functions/` 目录下为每个功能创建文件，例如 `si.md`：

```markdown
# Si - 内倾感觉 (Introverted Sensation)

## 定义

Si 关注过去的经验、身体感受和已知的细节...

## 特点

- 重视传统
- 细节导向
- 依赖经验

## 优势

...

## 盲点

...

## 生活实例

...
```

### 3. 添加图片

将图片放入 `images/` 目录的相应子目录中，然后在 Markdown 中引用：

```markdown
![荣格照片](/jung-encyclopedia/images/hero/jung-portrait.jpg)
```

### 4. 更新页面以加载内容

页面当前使用硬编码数据。要加载 Markdown 内容，需要：

1. 安装 `gray-matter` 和 `react-markdown`：
   ```bash
   cd D:/wsyverse
   npm install gray-matter react-markdown
   ```

2. 创建 API 路由 `src/app/api/jung-encyclopedia/route.js` 来读取 Markdown 文件

3. 修改页面组件，使用 `useEffect` 和 `fetch` 加载内容

## 当前状态

页面当前使用硬编码数据，可以直接查看效果：
- 本地开发：`http://localhost:3000/soul/jung-encyclopedia`
- 线上部署：待 Vercel 部署完成后可访问

## 后续优化建议

1. **添加搜索功能**：在页面顶部添加搜索框，搜索章节内容
2. **添加书签功能**：允许用户书签重要章节
3. **添加评论功能**：使用 Giscus 或 Disqus 添加评论
4. **添加打印样式**：优化打印样式，方便用户打印章节
5. **添加进度保存**：使用 localStorage 保存用户的阅读进度

## 颜色配置

当前页面支持深色和浅色模式，配色方案在 `THEMES` 对象中定义。

如需修改配色，编辑 `src/app/soul/jung-encyclopedia/page.js` 中的 `THEMES` 对象。
