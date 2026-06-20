# SYLVIA'S UNIVERSE — 自动同步脚本
# 检查变更 → 提交 → 推送到 GitHub → Vercel 自动部署

$ErrorActionPreference = "Stop"
Set-Location "D:/wsyverse"

# 检查是否有变更
$status = git status --porcelain 2>&1
if (-not $status) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] No changes, skip."
    exit 0
}

# 有变更 → 提交
git add -A 2>&1 | Out-Null
$count = ($status | Measure-Object).Count
git commit -m "auto: sync — $count files" 2>&1 | Out-Null

# 推送到 GitHub（使用 PAT 认证）
git push origin main 2>&1

Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Synced $count file(s) → Vercel deploying..."
