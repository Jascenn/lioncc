#!/usr/bin/env bash

# LionCC 简化版启动脚本

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NODE_SCRIPT="$SCRIPT_DIR/bin/lioncc.js"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未安装 Node.js${NC}"
    echo ""
    echo -e "${YELLOW}请先安装 Node.js (需要 18.0.0 或更高版本):${NC}"
    echo "  访问 https://nodejs.org/"
    echo ""
    exit 1
fi

# 检查依赖
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo -e "${CYAN}📦 首次运行，正在安装依赖...${NC}"
    echo ""
    cd "$SCRIPT_DIR"
    npm install
    echo ""
fi

# 运行工具
node "$NODE_SCRIPT"
