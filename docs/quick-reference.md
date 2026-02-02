# LionCC 快速参考

## 一键配置

```bash
lioncc
```

按回车使用默认选项，3 步完成配置。

## 配置要点

### ✅ 正确的 baseUrl 配置

```json
{
  "baseUrl": "https://vibecodingapi.ai"  // ✅ 不带 /v1
}
```

### ❌ 错误的 baseUrl 配置

```json
{
  "baseUrl": "https://vibecodingapi.ai/v1"  // ❌ 会导致 404 错误
}
```

**原因：** OpenClaw 会自动添加 `/v1/messages`，如果 baseUrl 已包含 `/v1`，最终 URL 会变成 `/v1/v1/messages`。

## 支持的服务商

| 服务商 | baseUrl | 说明 |
|--------|---------|------|
| VibeCoding | `https://vibecodingapi.ai` | 国内快速 |
| Anthropic | `https://api.anthropic.com` | 官方服务 |
| OpenRouter | `https://openrouter.ai/api` | 多模型支持 |

## 常用命令

```bash
# 配置 OpenClaw
lioncc

# 清空配置
lioncc  # 选择 "清空当前配置"

# 重启 Gateway
openclaw gateway restart

# 测试配置
openclaw agent --local --message "Hello" --session-id "test" --json

# 启动 TUI
openclaw tui

# 查看日志
tail -f /tmp/openclaw/openclaw-*.log
```

## 故障排查

### 问题：OpenClaw 无响应

**症状：** TUI 显示 `(no output)`

**解决：**
1. 检查 baseUrl 是否正确（不带 `/v1`）
2. 重启 gateway：`openclaw gateway restart`
3. 查看详细文档：[docs/troubleshooting.md](troubleshooting.md)

### 问题：404 错误

**错误信息：** `HTTP 404 invalid_request_error: Invalid URL (POST /v1/v1/messages)`

**原因：** baseUrl 包含了 `/v1`

**解决：** 编辑 `~/.openclaw/openclaw.json`，将 baseUrl 改为不带 `/v1` 的格式。

### 问题：API Key 无效

**错误信息：** `HTTP 401 api_error: Invalid API Key`

**解决：**
1. 检查 API Key 是否正确
2. 重新运行 `lioncc` 配置

## 配置文件位置

```
~/.openclaw/openclaw.json
```

## 完整配置示例

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
      },
      "models": {
        "VibeCoding/claude-opus-4-5-20251101": {
          "alias": "VibeCoding"
        }
      },
      "workspace": "/Users/xxx/.openclaw/workspace"
    }
  },
  "gateway": {
    "mode": "local",
    "port": 18789,
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "xxx"
    }
  }
}
```

## 验证配置

```bash
# 查看当前配置
cat ~/.openclaw/openclaw.json | python3 -c "
import json, sys
d = json.load(sys.stdin)
print('Primary:', d['agents']['defaults']['model']['primary'])
print('Provider:', d['models']['providers']['VibeCoding']['baseUrl'])
print('API:', d['models']['providers']['VibeCoding']['api'])
"

# 测试 API 连接
curl -X POST "https://vibecodingapi.ai/v1/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model":"claude-opus-4-5-20251101","max_tokens":50,"messages":[{"role":"user","content":"Hi"}]}'
```

## 更多帮助

- 完整文档：[README.md](../README.md)
- 故障排查：[troubleshooting.md](troubleshooting.md)
- GitHub Issues：[提交问题](https://github.com/Jascenn/lioncc/issues)
