# LionCC 故障排查文档

## 问题：OpenClaw 配置后无响应

### 症状
- OpenClaw TUI 启动正常，显示 `connected | idle`
- 发送消息后显示 `(no output)`
- Gateway 日志显示 agent 运行但没有 API 调用
- Agent 运行时间约 1 秒后结束，没有任何输出

### 问题原因

**根本原因：baseURL 配置错误导致 API 路径重复**

OpenClaw 在调用 Anthropic Messages API 时，会自动在 `baseUrl` 后添加 `/v1/messages` 路径。

如果 `baseUrl` 配置为：
```json
"baseUrl": "https://vibecodingapi.ai/v1"
```

最终请求的 URL 会变成：
```
https://vibecodingapi.ai/v1/v1/messages  ❌ (路径重复)
```

这导致 API 返回 `HTTP 404 invalid_request_error: Invalid URL`。

### 问题分析过程

1. **初步检查**
   - 配置文件格式正确
   - API Key 有效
   - Gateway 正常启动
   - 模型配置正确

2. **日志分析**
   - Gateway 日志显示 agent 启动：`embedded run start: provider=vibecoding model=claude-opus-4-5-20251101`
   - Agent 快速结束：`durationMs=1000` 左右
   - **关键发现**：没有任何 HTTP 请求日志

3. **直接测试**
   ```bash
   openclaw agent --local --message "Hello" --session-id "test" --json
   ```

   返回错误：
   ```json
   {
     "text": "HTTP 404 invalid_request_error: Invalid URL (POST /v1/v1/messages)"
   }
   ```

   **发现路径重复问题！**

4. **验证 API**
   ```bash
   curl -X POST "https://vibecodingapi.ai/v1/messages" \
     -H "Authorization: Bearer $API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -d '{"model":"claude-opus-4-5-20251101","max_tokens":50,"messages":[{"role":"user","content":"Hi"}]}'
   ```

   API 本身工作正常，确认是 baseUrl 配置问题。

### 解决方案

#### 1. 修复现有配置

编辑 `~/.openclaw/openclaw.json`：

```json
{
  "models": {
    "providers": {
      "VibeCoding": {
        "baseUrl": "https://vibecodingapi.ai",  // ✅ 去掉 /v1
        "apiKey": "sk-xxx",
        "auth": "api-key",
        "api": "anthropic-messages",
        "authHeader": false,
        "models": [...]
      }
    }
  }
}
```

重启 gateway：
```bash
openclaw gateway restart
```

#### 2. 更新 lioncc 工具

修改 `bin/lioncc.js` 中的默认配置：

```javascript
constructor() {
  this.config = {
    apiKey: '',
    apiEndpoint: 'https://vibecodingapi.ai',  // ✅ 不带 /v1
    model: '',
  };
}
```

#### 3. 验证修复

```bash
# 测试 API 调用
openclaw agent --local --message "你好" --session-id "test" --json

# 启动 TUI
openclaw tui
```

成功响应示例：
```json
{
  "payloads": [
    {
      "text": "你好！👋\n\n我刚刚启动..."
    }
  ],
  "meta": {
    "durationMs": 7389,
    "agentMeta": {
      "provider": "VibeCoding",
      "model": "claude-opus-4-5-20251101",
      "usage": {
        "input": 32,
        "output": 123,
        "cacheRead": 14479,
        "cacheWrite": 798
      }
    }
  }
}
```

### 配置要点

#### VibeCoding API 正确配置

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
  }
}
```

#### 关键配置说明

| 字段 | 值 | 说明 |
|------|-----|------|
| `baseUrl` | `https://vibecodingapi.ai` | ⚠️ 不要包含 `/v1`，OpenClaw 会自动添加 |
| `auth` | `api-key` | 使用 API Key 认证 |
| `api` | `anthropic-messages` | VibeCoding 兼容 Anthropic Messages API |
| `authHeader` | `false` | 使用标准 Authorization Bearer header |

### 常见错误

#### ❌ 错误 1：baseUrl 包含 /v1
```json
"baseUrl": "https://vibecodingapi.ai/v1"  // ❌
```
结果：`HTTP 404 /v1/v1/messages`

#### ❌ 错误 2：缺少 model.primary 配置
```json
"agents": {
  "defaults": {
    "models": {...}  // ❌ 缺少 model 字段
  }
}
```
结果：Gateway 使用错误的模型或无法启动

#### ❌ 错误 3：API 类型错误
```json
"api": "openai-chat"  // ❌ VibeCoding 不支持
```
结果：配置验证失败

### 调试技巧

#### 1. 查看 Gateway 日志
```bash
tail -f /tmp/openclaw/openclaw-*.log | grep -E "vibecoding|error|HTTP"
```

#### 2. 测试 API 连接
```bash
curl -X POST "https://vibecodingapi.ai/v1/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model":"claude-opus-4-5-20251101","max_tokens":50,"messages":[{"role":"user","content":"Hi"}]}'
```

#### 3. 直接测试 Agent
```bash
openclaw agent --local --message "测试" --session-id "debug" --json
```

#### 4. 验证配置
```bash
# 查看当前模型配置
cat ~/.openclaw/openclaw.json | python3 -c "
import json, sys
d = json.load(sys.stdin)
print('Primary:', d['agents']['defaults']['model']['primary'])
print('Provider:', d['models']['providers']['VibeCoding']['baseUrl'])
print('API:', d['models']['providers']['VibeCoding']['api'])
"
```

### 后续计划

#### 短期优化
1. ✅ 修复 lioncc 工具的默认 baseUrl
2. ✅ 添加配置验证逻辑
3. ⏳ 在 lioncc 中添加 API 连接测试
4. ⏳ 改进错误提示信息

#### 中期改进
1. 自动检测 baseUrl 是否包含 `/v1` 并警告
2. 添加配置向导的验证步骤
3. 提供配置模板和示例
4. 添加常见问题自动诊断

#### 长期规划
1. 支持更多 API 提供商（OpenRouter、Anthropic 官方等）
2. 提供图形化配置界面
3. 集成配置测试和健康检查
4. 自动化故障排查工具

### 相关资源

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [VibeCoding API 文档](https://vibecodingapi.ai/docs)
- [Anthropic Messages API 规范](https://docs.anthropic.com/claude/reference/messages_post)
- [LionCC GitHub](https://github.com/Jascenn/lioncc)

### 更新日志

- **2026-02-03**: 初始版本，记录 baseUrl 配置问题及解决方案
