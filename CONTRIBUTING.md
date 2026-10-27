# 贡献指南 Contributing

`LionCC`：用于配置 OpenClaw 与 VibeCoding API 的跨平台命令行工具。 小改动可以直接提 PR；涉及对外行为、数据结构、发布流程或批量重构时，请先开 Issue 对齐范围。

## 本地验证

```bash
npm ci
node --check bin/lioncc.js
npm start
```

如果 README 的安装步骤无法照做，请把它当作 bug 提交。不要把“在我机器上能跑”当作验证完成。

## 分支与提交

- 分支名使用 `feat/`、`fix/`、`docs/`、`refactor/`、`chore/` 前缀和 kebab-case 描述。
- `main` 只接受 PR；不要直接推送，也不要 force push 已共享的分支。
- 提交标题使用 Conventional Commits，例如 `fix(cli): preserve backup before overwrite`。
- 一个 PR 只解决一个问题。行为变化、格式化、依赖升级不要混在同一次提交里。
- 默认建议 squash merge，让一个 PR 对应 `main` 上的一条可回溯记录。

## 本项目的安全边界

- 不要把 API Key、OpenClaw token、用户配置文件或调试日志提交到仓库。
- 修改配置写入逻辑时，必须先备份旧配置，并验证重复执行、清空配置和完全卸载都能正常工作。
- 保持 macOS、Linux、Windows 的命令与换行兼容；不要只在单一平台验证后发布。
- `npm-publish.yml` 只允许通过 GitHub Release 触发，不要在普通 PR 中修改发布条件或注入新的发布凭据。

## PR 最少要写什么

1. 为什么需要改，关联的 Issue 或具体问题。
2. 改了什么，以及明确没有改什么。
3. 陌生人能照着执行的验证命令和结果。
4. 影响面与回滚方式；涉及页面时附桌面和移动端截图。

## 审查与合并

单人维护时，PR 的价值是给未来的自己留下“当时为什么这样做”。评论建议标注 `【阻塞】`、`【建议】` 或 `【nit】`。安全漏洞不要开公开 Issue，请按 [SECURITY.md](SECURITY.md) 私下报告。

## 范围

本项目主要覆盖：交互式 CLI、OpenClaw 配置写入、跨平台安装脚本、npm 包元数据与发布流程。
