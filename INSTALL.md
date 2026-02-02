# 📦 LionCC 安装指南

多种安装方式，选择最适合你的！

## 🚀 推荐安装方式

### 方式 1: 全局安装（最方便）

**一次安装，随处使用**

```bash
# 进入项目目录
cd lioncc-cli

# 全局安装
npm link

# 现在可以在任何地方运行
lioncc
```

**优点：**
- ✅ 在任何目录都能运行
- ✅ 只需输入 `lioncc` 命令
- ✅ 自动更新到最新版本

**使用：**
```bash
# 在任何目录运行
lioncc
```

**卸载：**
```bash
cd lioncc-cli
npm unlink
```

---

### 方式 2: npx 运行（无需安装）

**适合偶尔使用**

```bash
# 进入项目目录
cd lioncc-cli

# 直接运行
npx lioncc
```

**优点：**
- ✅ 无需安装
- ✅ 始终运行最新版本
- ✅ 不占用全局命令

---

### 方式 3: 本地脚本（最简单）

**双击运行**

```bash
# macOS/Linux
./start-simple.sh

# Windows
start-simple.bat
```

**优点：**
- ✅ 最简单
- ✅ 无需记命令
- ✅ 适合不熟悉命令行的用户

---

### 方式 4: npm 脚本

**使用 npm 命令**

```bash
# 进入项目目录
cd lioncc-cli

# 运行
npm start
```

**优点：**
- ✅ 标准的 npm 方式
- ✅ 适合开发者

---

## 🎯 安装方式对比

| 方式 | 便利性 | 适合人群 | 命令 |
|------|--------|----------|------|
| 全局安装 | ⭐⭐⭐⭐⭐ | 经常使用 | `lioncc` |
| npx 运行 | ⭐⭐⭐⭐ | 偶尔使用 | `npx lioncc` |
| 本地脚本 | ⭐⭐⭐ | 小白用户 | `./start-simple.sh` |
| npm 脚本 | ⭐⭐⭐ | 开发者 | `npm start` |

## 📝 详细步骤

### 全局安装详细步骤

**1. 克隆或下载项目**
```bash
git clone <repository-url>
cd lioncc-cli
```

**2. 安装依赖**
```bash
npm install
```

**3. 全局链接**
```bash
npm link
```

**4. 验证安装**
```bash
lioncc --version
# 或直接运行
lioncc
```

**5. 使用**
```bash
# 在任何目录运行
cd ~
lioncc
```

---

### macOS/Linux 系统特别说明

**如果遇到权限问题：**

```bash
# 方式 1: 使用 sudo
sudo npm link

# 方式 2: 修改 npm 全局目录（推荐）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# 然后重新链接
npm link
```

---

### Windows 系统特别说明

**如果遇到权限问题：**

1. 以管理员身份运行 PowerShell 或命令提示符
2. 运行安装命令

**如果遇到执行策略限制：**

```powershell
# 临时允许
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 或永久设置（需要管理员权限）
Set-ExecutionPolicy RemoteSigned
```

---

## 🔧 高级安装

### 创建系统别名

**macOS/Linux (bash/zsh):**

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
alias oc-config='cd /path/to/lioncc-cli && ./start-simple.sh'

# 重新加载配置
source ~/.zshrc
```

**使用：**
```bash
oc-config
```

---

### 添加到 PATH

**macOS/Linux:**

```bash
# 创建符号链接
sudo ln -s /path/to/lioncc-cli/start-simple.sh /usr/local/bin/lioncc

# 使用
lioncc
```

**Windows:**

1. 右键 "此电脑" → "属性"
2. "高级系统设置" → "环境变量"
3. 在 "Path" 中添加项目目录
4. 重启终端

---

## 📦 发布到 npm（可选）

如果想让其他人也能使用：

```bash
# 1. 登录 npm
npm login

# 2. 发布
npm publish

# 3. 其他人安装
npm install -g lioncc

# 4. 使用
lioncc
```

---

## 🎯 推荐方案

### 个人使用
**推荐：全局安装**
```bash
cd lioncc-cli
npm install
npm link
lioncc
```

### 团队使用
**推荐：发布到 npm**
```bash
npm install -g lioncc
lioncc
```

### 小白用户
**推荐：本地脚本**
```bash
./start-simple.sh  # macOS/Linux
start-simple.bat   # Windows
```

---

## 💡 使用技巧

### 快速配置
```bash
# 全局安装后
lioncc
# 选择 "🚀 配置 OpenClaw"
# 3步完成配置
```

### 清空重配
```bash
lioncc
# 选择 "🧹 清空当前配置"
```

### 完全卸载
```bash
lioncc
# 选择 "🗑️ 完全卸载 OpenClaw"
```

---

## 🔍 故障排查

### Q: npm link 失败？
**A:**
```bash
# 检查 npm 全局目录
npm config get prefix

# 如果是系统目录，使用 sudo
sudo npm link

# 或修改全局目录（推荐）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

### Q: 命令找不到？
**A:**
```bash
# 检查是否在 PATH 中
echo $PATH

# 重新加载配置
source ~/.zshrc  # 或 ~/.bashrc
```

### Q: Windows 上无法运行？
**A:**
1. 以管理员身份运行
2. 检查执行策略
3. 使用 .bat 脚本

---

## 📚 相关文档

- [README.md](./README.md) - 主文档
- [README-SIMPLE.md](./README-SIMPLE.md) - 使用文档

---

**选择最适合你的安装方式，开始使用！** 🚀
