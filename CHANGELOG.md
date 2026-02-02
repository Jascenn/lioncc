# 更新日志

所有重要的项目更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [2.0.0] - 2026-02-03

### 🐛 修复

- **[关键] 修复 baseUrl 配置错误导致 API 调用失败**
  - 问题：baseUrl 包含 `/v1` 导致最终 URL 变成 `/v1/v1/messages`（404 错误）
  - 解决：将所有 endpoint 配置改为不带 `/v1` 后缀
  - 影响：VibeCoding、Anthropic、OpenRouter 所有服务商
  - 详见：[docs/troubleshooting.md](docs/troubleshooting.md)

### ✨ 新增

- **全新的 LIONCC.AI ASCII 艺术 banner**
  - 更专业的品牌展示
  - 更清晰的视觉识别

- **默认选项优化**
  - 主菜单默认选择"配置 OpenClaw"
  - 服务商默认选择 VibeCoding
  - 模型选择默认"使用推荐模型"
  - 所有确认提示默认 Yes（危险操作除外）
  - 支持快速配置：连续按回车即可完成

- **配置格式优化**
  - 使用 OpenClaw 2026.2.1 标准配置格式
  - 支持 `models.providers` 结构
  - 完整的模型配置（contextWindow、maxTokens、cost 等）
  - 自动生成 gateway 配置和 token

- **配置管理功能**
  - 自动删除旧的 `anthropic` 字段
  - 自动备份配置文件
  - 配置冲突检测

### 📝 文档

- **新增故障排查文档** ([docs/troubleshooting.md](docs/troubleshooting.md))
  - 详细的问题分析过程
  - 完整的解决方案
  - 常见错误和调试技巧
  - 后续改进计划

- **新增快速参考文档** ([docs/quick-reference.md](docs/quick-reference.md))
  - 一键配置指南
  - 配置要点说明
  - 常用命令速查
  - 完整配置示例

- **更新 README**
  - 添加 baseUrl 配置说明
  - 添加故障排查链接
  - 更新配置示例
  - 完善常见问题

### 🔧 改进

- **行尾符修复**
  - 修复 Windows CRLF 导致的 `node\r: No such file or directory` 错误
  - 统一使用 LF 行尾符

- **错误提示优化**
  - 更清晰的错误信息
  - 提供具体的解决建议
  - 添加重试机制

### 🎨 优化

- **交互体验改进**
  - 更友好的提示信息
  - 彩色输出和进度提示
  - 加载动画优化

### 🔒 安全

- **配置验证**
  - API Key 格式验证
  - URL 格式验证
  - 配置完整性检查

## [1.0.0] - 2026-02-02

### ✨ 初始版本

- 基础配置功能
- 支持 VibeCoding API
- 交互式命令行界面
- 模型选择功能
- 配置清空功能
- 完全卸载功能

---

## 版本说明

### 版本号格式

遵循语义化版本 `MAJOR.MINOR.PATCH`：

- **MAJOR**：不兼容的 API 修改
- **MINOR**：向下兼容的功能性新增
- **PATCH**：向下兼容的问题修正

### 变更类型

- `Added` - 新增功能
- `Changed` - 功能变更
- `Deprecated` - 即将废弃的功能
- `Removed` - 已移除的功能
- `Fixed` - 问题修复
- `Security` - 安全相关

## 未来计划

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

## 贡献

欢迎提交 Issue 和 Pull Request！

- 报告问题：[GitHub Issues](https://github.com/Jascenn/lioncc/issues)
- 功能建议：[GitHub Discussions](https://github.com/Jascenn/lioncc/discussions)
- 代码贡献：[Contributing Guide](CONTRIBUTING.md)

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
