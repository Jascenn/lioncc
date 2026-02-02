# LionCC 开发文档

> 内部开发版本文档，记录详细的开发过程、优化历史和技术细节

## 📋 项目概述

LionCC 是专为 VibeCoding API 设计的 OpenClaw 配置工具，旨在为用户提供简单、快速的配置体验。

## 🔄 版本历史

### v2.0.0 (2026-02-03)

#### 初始发布
- 🎉 首次发布
- ✅ 专注 VibeCoding API 配置
- 🔍 智能模型搜索功能
- 🧹 清空配置功能
- 🗑️ 完全卸载功能
- 🌍 跨平台支持

#### 优化过程

**1. 配置格式修复**
- **问题**: OpenClaw 2026.2.1 版本配置格式变更
- **错误**: "Unrecognized keys: language, anthropic" in agents.defaults
- **解决方案**:
  - 将 `anthropic` 配置移到顶层
  - 从 `agents.defaults` 中移除 `language` 字段
  - 使用新格式：`agents.defaults.model.primary`

**旧格式（错误）**:
```json
{
  "agents": {
    "defaults": {
      "language": "zh-CN",
      "anthropic": {
        "apiKey": "sk-xxx",
        "baseURL": "https://vibecodingapi.ai/v1"
      },
      "model": {
        "primary": "claude-opus-4-5-20251101"
      }
    }
  }
}
```

**新格式（正确）**:
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

**2. baseURL 配置问题**
- **问题**: 配置 `baseURL: "https://vibecodingapi.ai/v1"` 导致路径重复
- **原因**: OpenClaw 会自动添加 `/v1`，导致实际请求路径为 `/v1/v1/messages`
- **解决方案**:
  - 移除 baseURL 中的 `/v1` 后缀
  - 正确配置：`baseURL: "https://vibecodingapi.ai"`
  - 添加配置验证和警告提示

**3. 文件命名优化**
- **问题**: 文件名包含 `simple` 后缀，不够简洁
- **优化**:
  - `lioncc-simple.js` → `lioncc.js`
  - `start-simple.sh` → `start.sh`
  - `start-simple.bat` → `start.bat`
- **影响**: 更新了所有引用和文档

**4. 文档结构优化**
- **问题**: `INSTALL.md` 和 `README.md` 内容重复
- **优化**:
  - 删除 `INSTALL.md`
  - 将安装说明合并到 `README.md`
  - 优化安装文档结构

**5. 仓库命名优化**
- **问题**: GitHub 仓库名为 `lioncc-`（多余的横杠）
- **优化**: 重命名为 `lioncc`
- **影响**: 更新了所有文档和 Release 说明中的 URL

**6. 一键安装脚本**
- **背景**: 用户无法注册 npm 账号
- **解决方案**: 创建 `install.sh` 一键安装脚本
- **功能**:
  - 自动检查 Node.js 和 Git
  - 克隆仓库到 `~/.lioncc`
  - 自动安装依赖
  - 配置全局命令
  - 支持更新（重新运行脚本）

**7. 交互体验优化**
- **Banner 设计**: 添加 LIONCC.AI ASCII art banner
- **默认选项**:
  - 默认选择 VibeCoding 服务商
  - 默认使用推荐模型（最强模型）
  - 减少用户操作步骤
- **错误提示**: 添加详细的配置验证和错误提示

## 🏗️ 技术架构

### 核心依赖
- `inquirer`: 交互式命令行界面
- `inquirer-autocomplete-prompt`: 模型搜索功能
- `chalk`: 终端颜色输出
- `ora`: 加载动画

### 文件结构
```
lioncc/
├── bin/
│   └── lioncc.js           # 主程序
├── .github/
│   └── workflows/
│       └── npm-publish.yml # npm 自动发布工作流
├── .gitignore
├── README.md               # 用户文档
├── DEVELOPMENT.md          # 开发文档（本文件）
├── package.json
├── package-lock.json
├── install.sh              # 一键安装脚本
├── start.sh                # macOS/Linux 启动脚本
└── start.bat               # Windows 启动脚本
```

### 配置文件位置
- OpenClaw 配置: `~/.openclaw/openclaw.json`
- 备份文件: `~/.openclaw/openclaw.json.backup.{timestamp}`

## 🐛 已知问题和解决方案

### 1. Line Ending 问题
**问题**: macOS 上运行脚本报错 `env: bash\r: No such file or directory`
**原因**: Windows 风格的行尾符（CRLF）
**解决方案**:
```bash
sed -i '' 's/\r$//' start.sh
```

### 2. npm link 权限问题
**问题**: macOS/Linux 上 `npm link` 失败
**解决方案**:
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

### 3. OpenClaw 配置不生效
**问题**: 配置后 OpenClaw 仍使用旧配置
**解决方案**: 重启 OpenClaw Gateway
```bash
openclaw gateway restart
```

### 4. OpenClaw 无响应或显示 (no output)
**问题**: OpenClaw 运行但没有输出
**原因**:
- baseURL 配置错误（包含 `/v1`）
- API Key 无效
- 模型配置错误

**解决方案**: 参考 `docs/troubleshooting.md`

## 📝 开发规范

### Git Commit 规范
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `refactor:` 代码重构
- `style:` 代码格式调整
- `chore:` 构建/工具链更新

### 代码风格
- 使用 ES6+ 语法
- 使用 `async/await` 处理异步
- 错误处理使用 try-catch
- 配置文件使用 JSON 格式

### 测试流程
1. 本地测试所有功能
2. 测试跨平台兼容性（macOS/Linux/Windows）
3. 测试不同 Node.js 版本（18.x, 20.x, 22.x）
4. 测试安装脚本
5. 更新文档和 Release 说明

## 🔧 开发环境设置

### 本地开发
```bash
# 克隆仓库
git clone https://github.com/Jascenn/lioncc.git
cd lioncc

# 安装依赖
npm install

# 本地测试
node bin/lioncc.js

# 全局链接（用于测试）
npm link
lioncc
```

### 发布流程
1. 更新版本号（`package.json`）
2. 更新 `README.md` 和 `DEVELOPMENT.md`
3. 提交代码
4. 创建 Git tag
5. 推送到 GitHub
6. 创建/更新 GitHub Release
7. （可选）发布到 npm

```bash
# 创建新版本
git tag v2.1.0
git push origin v2.1.0

# 创建 Release
gh release create v2.1.0 -F release-notes.md
```

## 📚 参考资料

### OpenClaw 相关
- [OpenClaw 官网](https://openclaw.ai/)
- [OpenClaw 文档](https://docs.openclaw.ai/)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)

### VibeCoding API
- [VibeCoding 官网](https://vibecodingapi.ai/)
- API 端点: `https://vibecodingapi.ai`

### 技术文档
- [inquirer 文档](https://github.com/SBoudrias/Inquirer.js)
- [chalk 文档](https://github.com/chalk/chalk)
- [ora 文档](https://github.com/sindresorhus/ora)

## 🎯 未来计划

### v2.1.0 计划
- [ ] 支持多个 API 服务商配置
- [ ] 配置文件导入/导出功能
- [ ] 配置历史记录和回滚
- [ ] 更详细的错误诊断
- [ ] 支持自定义模型列表

### v2.2.0 计划
- [ ] Web UI 配置界面
- [ ] 配置模板功能
- [ ] 批量配置管理
- [ ] 配置同步功能

## 🤝 贡献指南

### 报告问题
- 使用 GitHub Issues
- 提供详细的错误信息和复现步骤
- 包含系统信息（OS、Node.js 版本）

### 提交代码
1. Fork 仓库
2. 创建功能分支
3. 提交代码并测试
4. 创建 Pull Request
5. 等待代码审查

## 📄 许可证

MIT License

## 👥 维护者

- 凌一 (Jascenn)

---

**最后更新**: 2026-02-03
