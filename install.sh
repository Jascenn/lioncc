#!/usr/bin/env bash

# LionCC 一键安装脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🦁 LionCC 一键安装${NC}"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未安装 Node.js${NC}"
    echo ""
    echo -e "${YELLOW}请先安装 Node.js (需要 18.0.0 或更高版本):${NC}"
    echo "  访问 https://nodejs.org/"
    echo ""
    exit 1
fi

# 检查 git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ 未安装 Git${NC}"
    echo ""
    echo -e "${YELLOW}请先安装 Git:${NC}"
    echo "  访问 https://git-scm.com/"
    echo ""
    exit 1
fi

# 设置安装目录
INSTALL_DIR="$HOME/.lioncc"

# 如果已存在，先删除
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}⚠️  检测到已安装的版本，正在更新...${NC}"
    rm -rf "$INSTALL_DIR"
fi

# 克隆仓库
echo -e "${CYAN}📦 正在下载 LionCC...${NC}"
git clone https://github.com/Jascenn/lioncc.git "$INSTALL_DIR"

# 进入目录
cd "$INSTALL_DIR"

# 安装依赖
echo -e "${CYAN}📦 正在安装依赖...${NC}"
npm install

# 全局链接
echo -e "${CYAN}🔗 正在配置全局命令...${NC}"
npm link

echo ""
echo -e "${GREEN}✅ 安装完成！${NC}"
echo ""
echo -e "${CYAN}现在可以在任何地方运行:${NC}"
echo -e "  ${GREEN}lioncc${NC}"
echo ""
