# 🦁 LionCC - VibeCoding API 配置工具

专为 VibeCoding API 设计的 OpenClaw 配置工具，简单、快速、专注。

## ✨ 功能特点

- 🚀 **3步完成配置** - API Key → 模型 → 完成
- 🔍 **智能模型搜索** - 输入关键词实时筛选
- 🧹 **清空配置** - 一键清空并重新配置
- 🗑️ **完全卸载** - 彻底删除 OpenClaw
- 🌍 **跨平台支持** - macOS / Linux / Windows

## 📦 安装

### 前置要求

- **Node.js** 18.0.0 或更高版本

### 检查 Node.js

```bash
node -v
```

如果显示 `v18.x.x` 或更高版本，可以继续。否则请先安装 Node.js：
- 访问 https://nodejs.org/
- 下载并安装 LTS 版本

### 安装方式

#### 方式 1: 全局安装（推荐）

**一次安装，随处使用**

```bash
# 1. 克隆或下载项目
git clone https://github.com/Jascenn/lioncc.git
cd lioncc

# 2. 安装依赖
npm install

# 3. 全局安装
npm link

# 4. 在任何地方使用
lioncc
```

**优点：**
- ✅ 在任何目录都能运行
- ✅ 只需输入 `lioncc` 命令
- ✅ 最方便的使用方式

**卸载：**
```bash
cd lioncc
npm unlink
```

#### 方式 2: npx 运行（无需安装）

**适合偶尔使用**

```bash
# 从 GitHub 直接运行
npx github:Jascenn/lioncc

# 或本地运行
cd lioncc
npx lioncc
```

**优点：**
- ✅ 无需安装
- ✅ 始终运行最新版本
- ✅ 不占用全局命令

#### 方式 3: 本地脚本（最简单）

**双击运行**

```bash
cd lioncc

# macOS/Linux
./start-simple.sh

# Windows
start-simple.bat
```

**优点：**
- ✅ 最简单
- ✅ 无需记命令
- ✅ 适合不熟悉命令行的用户

### 权限问题解决

**macOS/Linux 权限问题：**

```bash
# 方式 1: 使用 sudo
sudo npm link

# 方式 2: 修改 npm 全局目录（推荐）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm link
```

**Windows 权限问题：**

1. 以管理员身份运行 PowerShell 或命令提示符
2. 运行安装命令

**Windows 执行策略限制：**

```powershell
# 临时允许
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 或永久设置（需要管理员权限）
Set-ExecutionPolicy RemoteSigned
```

## 🚀 快速开始

### 首次配置

```bash
# 运行工具
lioncc

# 选择 "🚀 配置 OpenClaw"
# 按提示完成 3 步配置：
# 1. 输入 VibeCoding API Key
# 2. 选择 AI 模型（支持搜索）
# 3. 确认并保存
```

### 启动 OpenClaw

```bash
openclaw gateway
```

### 配置消息平台

```bash
# WhatsApp（推荐）
openclaw channels login

# Telegram
openclaw channels login --channel telegram

# Discord
openclaw channels login --channel discord
```

## 📖 使用指南

### 主菜单

```
? 请选择操作:
  ❯ 🚀 配置 OpenClaw
    🧹 清空当前配置
    🗑️  完全卸载 OpenClaw
    ❌ 退出
```

### 1. 配置 OpenClaw 🚀

**步骤 1: 输入 API Key**
- 粘贴你的 VibeCoding API Key
- 输入会被隐藏保护

**步骤 2: 选择服务商**
- 默认选择 VibeCoding
- 也可以选择其他服务商或自定义

**步骤 3: 选择模型**

**自动推荐（推荐）：**
- 工具会自动选择最强的模型
- 优先级：Claude Opus 4 > Claude Sonnet 4.5 > Claude 3.5 Sonnet

**手动选择：**
- 支持搜索功能
- 输入关键词实时筛选
- 例如：输入 "opus" 只显示 Opus 模型

**搜索示例：**
```
? 搜索并选择模型: opus
  claude-opus-4-5-20251101
❯ claude-opus-4-5-20251101-thinking
  claude-3-opus-20240229
```

### 2. 清空当前配置 🧹

**会清空：**
- ✅ API Key
- ✅ API 节点配置
- ✅ 模型配置

**不会删除：**
- ✅ OpenClaw 程序
- ✅ 会话记录
- ✅ 其他配置

**自动备份：**
- 清空前会自动备份配置
- 备份文件：`~/.openclaw/openclaw.json.backup.{timestamp}`

### 3. 完全卸载 OpenClaw 🗑️

**会删除：**
- ✅ OpenClaw 程序
- ✅ 所有配置文件
- ✅ 所有数据和会话记录
- ✅ 工作区文件

**操作流程：**
1. 两次确认（防止误操作）
2. 自动停止服务
3. 卸载程序
4. 删除所有数据

## 💡 常见问题

### 安装相关

**Q: 提示 "command not found"？**

**A:** 检查 Node.js 是否安装：
```bash
node -v
npm -v
```

**Q: npm link 失败？**

**A:** 参考上面"权限问题解决"部分。

**Q: Windows 上无法运行？**

**A:** 参考上面"权限问题解决"部分。

### 使用相关

**Q: 如何获取 VibeCoding API Key？**

**A:** 访问 VibeCoding 官网注册并获取 API Key。

**Q: 配置后 OpenClaw 没有生效？**

**A:**
1. 确保配置已保存
2. 重启 OpenClaw：
   ```bash
   pkill -f "openclaw gateway"
   openclaw gateway
   ```

**Q: 如何切换 API Key？**

**A:** 直接运行 `lioncc` 重新配置，会覆盖旧配置。

**Q: 如何查看当前配置？**

**A:** 查看配置文件：
```bash
cat ~/.openclaw/openclaw.json
```

**Q: 模型搜索不显示结果？**

**A:**
- 确保 API Key 正确
- 检查网络连接
- 关键词会匹配模型 ID 的任何部分

### 卸载相关

**Q: 如何卸载 LionCC？**

**A:**
```bash
cd lioncc-cli
npm unlink
```

**Q: 卸载 OpenClaw 后如何重新安装？**

**A:**
```bash
npm install -g openclaw
```

## 🔧 配置文件

### 位置
```
~/.openclaw/openclaw.json
```

### 格式
```json
{
  "anthropic": {
    "apiKey": "sk-xxx",
    "baseURL": "https://vibecodingapi.ai/v1"
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "claude-opus-4-5-20251101"
      }
    }
  }
}
```

### 备份
- 每次修改配置时自动备份
- 备份文件：`~/.openclaw/openclaw.json.backup`

## 🌍 系统支持

| 系统 | 状态 | 安装方式 |
|------|------|----------|
| macOS Intel | ✅ | `npm link` |
| macOS Apple Silicon | ✅ | `npm link` |
| Linux | ✅ | `sudo npm link` |
| Windows 10/11 | ✅ | 管理员权限 `npm link` |

## 📝 命令参考

### LionCC 命令
```bash
lioncc              # 运行工具
lioncc --version    # 查看版本
```

### OpenClaw 命令
```bash
openclaw gateway                    # 启动服务
openclaw channels login             # 配置 WhatsApp
openclaw channels login --channel telegram  # 配置 Telegram
openclaw status                     # 查看状态
openclaw doctor                     # 故障诊断
openclaw --help                     # 查看帮助
```

## 🎯 使用技巧

### 快速配置
```bash
lioncc
# 选择 "🚀 配置 OpenClaw"
# 3步完成
```

### 模型搜索
```bash
# 选择 "自己选择模型"
# 输入关键词：
# - "opus" → 只显示 Opus 模型
# - "sonnet" → 只显示 Sonnet 模型
# - "4-5" → 只显示 4.5 版本模型
```

### 清空重配
```bash
lioncc
# 选择 "🧹 清空当前配置"
# 自动备份后清空
# 可选择立即重新配置
```

### 完全卸载
```bash
lioncc
# 选择 "🗑️ 完全卸载 OpenClaw"
# 两次确认
# 自动完成所有卸载步骤
```

## 📚 相关资源

- **OpenClaw 官网**: https://openclaw.ai/
- **OpenClaw 文档**: https://docs.openclaw.ai/
- **VibeCoding**: https://vibecodingapi.ai/

## 🔄 更新日志

### v2.0.0 (2026-02-03)
- ✅ 简化版发布
- ✅ 专注 VibeCoding API
- ✅ 模型搜索功能
- ✅ 清空配置功能
- ✅ 完全卸载功能
- ✅ 跨平台支持

## 📄 许可证

MIT

## 🙏 致谢

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Anthropic](https://www.anthropic.com/)
- VibeCoding

---

**简单、快速、专注 VibeCoding API** 🚀

如有问题，欢迎反馈！
