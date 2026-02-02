# LionCC 项目概览

> 专为 VibeCoding API 设计的 OpenClaw 配置工具

## 📊 项目统计

### 代码规模

| 类型 | 文件数 | 总行数 | 说明 |
|------|--------|--------|------|
| **核心代码** | 1 | 635 | 主程序 |
| **文档** | 6 | 1,697 | 用户+开发文档 |
| **脚本** | 3 | 136 | 安装+启动脚本 |
| **配置** | 2 | 82 | 项目配置 |
| **总计** | 12 | 2,550 | 不含依赖 |

### 项目结构

```
lioncc/
├── .github/
│   └── workflows/
│       └── npm-publish.yml      # GitHub Actions 自动发布
├── bin/
│   └── lioncc.js                # 主程序 (635 行)
├── docs/                        # 文档目录
│   ├── quick-reference.md       # 快速参考 (177 行)
│   ├── troubleshooting.md       # 故障排查 (289 行)
│   ├── v2.0.0-summary.md        # 版本总结 (319 行)
│   └── project-overview.md      # 项目概览（本文件）
├── CHANGELOG.md                 # 更新日志 (152 行)
├── DEVELOPMENT.md               # 开发文档 (298 行)
├── README.md                    # 用户文档 (462 行)
├── package.json                 # 项目配置
├── .gitignore                   # Git 忽略规则
├── install.sh                   # 一键安装脚本 (66 行)
├── start.sh                     # macOS/Linux 启动 (37 行)
└── start.bat                    # Windows 启动 (33 行)
```

## ✨ 核心功能

### 主程序特性

- ✅ **LIONCC.AI 品牌** - 专业的 ASCII 艺术 banner
- ✅ **交互式配置** - 友好的命令行向导
- ✅ **智能搜索** - 模型选择支持关键词实时筛选
- ✅ **配置验证** - 自动检测配置错误
- ✅ **自动备份** - 配置修改前自动备份
- ✅ **清空配置** - 一键清空并重新配置
- ✅ **完全卸载** - 彻底删除 OpenClaw
- ✅ **格式兼容** - 支持 OpenClaw 2026.2.1 配置格式

### 安装方式

| 方式 | 命令 | 适用场景 |
|------|------|----------|
| **一键安装** | `curl -fsSL https://raw.githubusercontent.com/Jascenn/lioncc/main/install.sh \| bash` | 最简单，推荐 |
| **全局安装** | `git clone && npm install && npm link` | 开发者 |
| **npx 运行** | `npx github:Jascenn/lioncc` | 临时使用 |
| **本地脚本** | `./start.sh` 或 `start.bat` | 小白用户 |

## 📚 文档体系

### 三层文档架构

#### 1. 用户层文档

**README.md** - 主文档
- 功能介绍
- 安装指南（4种方式）
- 快速开始
- 使用指南
- 常见问题
- 配置说明

**docs/quick-reference.md** - 快速参考
- 一键配置指南
- 配置要点（正确/错误示例）
- 常用命令速查
- 快速故障排查

#### 2. 技术层文档

**docs/troubleshooting.md** - 故障排查
- 问题症状描述
- 根本原因分析
- 完整分析过程
- 详细解决方案
- 调试技巧和工具

**docs/v2.0.0-summary.md** - 版本总结
- 完成的工作清单
- 技术实现细节
- 配置格式对比
- 关键代码修改

#### 3. 开发层文档

**DEVELOPMENT.md** - 开发文档
- 版本历史
- 优化过程记录
- 技术架构
- 已知问题和解决方案
- 开发规范
- 未来计划

**CHANGELOG.md** - 更新日志
- 遵循 Keep a Changelog 格式
- 语义化版本
- 未来计划路线图

## 🔧 技术架构

### 技术栈

**核心依赖：**
- `inquirer` (^9.2.12) - 交互式命令行界面
- `inquirer-autocomplete-prompt` (^3.0.1) - 模型搜索功能
- `chalk` (^5.3.0) - 终端颜色输出
- `ora` (^7.0.1) - 加载动画效果

**运行环境：**
- Node.js >= 18.0.0
- ES Modules (type: "module")
- 跨平台支持（macOS/Linux/Windows）

### 配置格式

**OpenClaw 2026.2.1 标准格式：**

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "VibeCoding": {
        "baseUrl": "https://vibecodingapi.ai",
        "apiKey": "sk-xxx",
        "auth": "api-key",
        "api": "anthropic-messages",
        "authHeader": false,
        "models": [
          {
            "id": "claude-opus-4-5-20251101",
            "name": "Claude Opus 4.5",
            "api": "anthropic-messages",
            "reasoning": true,
            "input": ["text"],
            "contextWindow": 200000,
            "maxTokens": 8192,
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            }
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "VibeCoding/claude-opus-4-5-20251101",
        "fallbacks": ["VibeCoding/claude-opus-4-5-20251101"]
      }
    }
  }
}
```

**关键配置说明：**

| 字段 | 值 | 说明 |
|------|-----|------|
| `baseUrl` | `https://vibecodingapi.ai` | ⚠️ 不要包含 `/v1`，OpenClaw 会自动添加 |
| `auth` | `api-key` | 使用 API Key 认证 |
| `api` | `anthropic-messages` | VibeCoding 兼容 Anthropic Messages API |
| `authHeader` | `false` | 使用标准 Authorization Bearer header |

## 🎨 用户体验

### 交互优化

1. **默认选项智能化**
   - 主菜单默认"配置 OpenClaw"
   - 服务商默认 VibeCoding
   - 模型默认"使用推荐模型"（自动选择最强模型）
   - 确认提示默认 Yes（危险操作除外）
   - 支持连续按回车快速完成配置

2. **视觉体验**
   - 专业的 LIONCC.AI ASCII 艺术 banner
   - 彩色输出和图标（✅ ❌ 🚀 等）
   - 优雅的加载动画
   - 清晰的进度提示

3. **错误处理**
   - 详细的错误信息
   - 具体的解决建议
   - 自动重试机制
   - 配置验证和警告

### 配置流程

**3步完成配置：**

```bash
lioncc

# 步骤 1: 输入 API Key
# 步骤 2: 选择模型（或使用推荐）
# 步骤 3: 确认保存

# 完成！
```

## 🔒 安全性

### 安全措施

- ✅ **敏感信息保护** - 所有示例使用占位符 (`sk-xxx`)
- ✅ **配置备份** - 修改前自动备份到 `~/.openclaw/openclaw.json.backup.{timestamp}`
- ✅ **输入隐藏** - API Key 输入时隐藏显示
- ✅ **配置验证** - 自动检测配置错误并提示
- ✅ **无泄露风险** - 代码和文档中无真实敏感信息

### 配置文件位置

```
~/.openclaw/openclaw.json           # 主配置文件
~/.openclaw/openclaw.json.backup.*  # 自动备份文件
```

## 📦 发布状态

### GitHub

- **仓库地址**: https://github.com/Jascenn/lioncc
- **Release**: v2.0.0
- **Stars**: 2
- **License**: MIT

### npm

- **包名**: `lioncc`
- **版本**: 2.0.0
- **状态**: 未发布到 npm（提供 GitHub 直接安装方式）

### 安装统计

**推荐安装方式：**
```bash
curl -fsSL https://raw.githubusercontent.com/Jascenn/lioncc/main/install.sh | bash
```

## 🎯 项目亮点

### 核心优势

1. **🚀 一键安装**
   - 无需 npm 账号
   - 一条命令完成安装
   - 自动配置全局命令

2. **🔍 智能搜索**
   - 模型选择支持关键词筛选
   - 实时搜索结果
   - 自动推荐最强模型

3. **📚 完整文档**
   - 三层文档体系（用户/技术/开发）
   - 详细的故障排查指南
   - 快速参考手册

4. **🔒 安全可靠**
   - 配置验证机制
   - 自动备份功能
   - 完善的错误处理

5. **🌍 跨平台**
   - macOS/Linux/Windows 全支持
   - 统一的用户体验
   - 平台特定的启动脚本

6. **🎨 专业品牌**
   - LIONCC.AI 视觉识别
   - 统一的设计语言
   - 专业的交互体验

## 📊 质量评估

### 文档覆盖率: ⭐⭐⭐⭐⭐

- ✅ 用户文档完整（安装、使用、FAQ）
- ✅ 开发文档详细（架构、规范、历史）
- ✅ 故障排查全面（症状、原因、解决）
- ✅ 快速参考便捷（命令、配置、示例）

### 代码质量: ⭐⭐⭐⭐⭐

- ✅ 结构清晰（模块化设计）
- ✅ 注释完整（关键逻辑说明）
- ✅ 错误处理完善（try-catch + 重试）
- ✅ 用户体验优秀（默认选项 + 视觉优化）

### 安全性: ⭐⭐⭐⭐⭐

- ✅ 无敏感信息泄露
- ✅ 配置验证完善
- ✅ 自动备份机制
- ✅ 输入保护（API Key 隐藏）

### 可维护性: ⭐⭐⭐⭐⭐

- ✅ 代码结构清晰
- ✅ 文档体系完整
- ✅ 版本管理规范
- ✅ 开发流程明确

## 🚀 使用场景

### 适用人群

1. **VibeCoding API 用户**
   - 需要快速配置 OpenClaw
   - 希望简化配置流程
   - 需要模型搜索功能

2. **OpenClaw 新手**
   - 不熟悉配置文件格式
   - 需要交互式配置向导
   - 需要详细的文档指导

3. **开发者**
   - 需要快速切换配置
   - 需要批量配置管理
   - 需要自动化工具

### 典型工作流

```bash
# 1. 安装
curl -fsSL https://raw.githubusercontent.com/Jascenn/lioncc/main/install.sh | bash

# 2. 配置
lioncc
# 按提示输入 API Key，选择模型

# 3. 启动 OpenClaw
openclaw gateway

# 4. 使用
openclaw tui

# 5. 需要时重新配置
lioncc  # 选择"清空当前配置"
```

## 📈 未来规划

### v2.1.0（计划中）

- [ ] API 连接测试功能
- [ ] 配置导入/导出
- [ ] 多配置文件支持
- [ ] 配置模板库

### v2.2.0（计划中）

- [ ] 自动检测配置问题
- [ ] 智能配置建议
- [ ] 性能优化
- [ ] 更多服务商支持

### v3.0.0（长期规划）

- [ ] 图形化配置界面
- [ ] 配置同步功能
- [ ] 插件系统
- [ ] 多语言支持

## 🤝 贡献指南

### 报告问题

- GitHub Issues: https://github.com/Jascenn/lioncc/issues
- 提供详细的错误信息和复现步骤
- 包含系统信息（OS、Node.js 版本）

### 提交代码

1. Fork 仓库
2. 创建功能分支
3. 提交代码并测试
4. 创建 Pull Request
5. 等待代码审查

### 文档贡献

- 改进现有文档
- 添加使用示例
- 翻译文档
- 补充常见问题

## 📄 许可证

MIT License

## 👥 维护者

- **凌一** (Jascenn)
- GitHub: https://github.com/Jascenn

## 📚 相关资源

- [OpenClaw 官网](https://openclaw.ai/)
- [OpenClaw 文档](https://docs.openclaw.ai/)
- [VibeCoding API](https://vibecodingapi.ai/)
- [LionCC GitHub](https://github.com/Jascenn/lioncc)

---

**最后更新**: 2026-02-03
**项目版本**: v2.0.0
**文档版本**: 1.0.0
