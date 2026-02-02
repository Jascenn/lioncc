#!/usr/bin/env node

import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import os from 'os';

// 注册 autocomplete 插件
inquirer.registerPrompt('autocomplete', autocomplete);

class OpenClawConfig {
  constructor() {
    this.config = {
      apiKey: '',
      apiEndpoint: 'https://vibecodingapi.ai/v1',
      model: '',
    };
  }

  // 显示 Banner
  showBanner() {
    console.clear();
    console.log(chalk.cyan(`
  ┌─────────────────────────────────────────────┐
  │  _     _              _____ _____            │
  │ | |   (_)            / ____|  __ \\           │
  │ | |    _  ___  _ __ | |    | |  \\/ ___       │
  │ | |   | |/ _ \\| '_ \\| |    | |    / __|      │
  │ | |___| | (_) | | | | |____| |___| (__       │
  │ |_____|_|\\___/|_| |_|\\_____|______|\\___| │
  │                                             │
  │        OpenClaw 配置工具                    │
  └─────────────────────────────────────────────┘
    `));
  }

  // 获取可用模型
  async fetchModels() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${this.config.apiEndpoint}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API_KEY_INVALID');
        } else if (response.status === 404) {
          throw new Error('ENDPOINT_INVALID');
        } else {
          throw new Error(`HTTP_${response.status}`);
        }
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      throw error;
    }
  }

  // 智能推荐最佳模型
  findBestModel(models) {
    const priorities = [
      'claude-opus-4',
      'claude-4-opus',
      'claude-sonnet-4-5',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-sonnet-20240620',
      'claude-3-opus',
      'claude-3-sonnet',
    ];

    for (const priority of priorities) {
      const found = models.find(m => m.id.toLowerCase().includes(priority.toLowerCase()));
      if (found) return found;
    }

    const claudeModel = models.find(m => m.id.toLowerCase().includes('claude'));
    return claudeModel || models[0];
  }

  // 选择模型（支持搜索）
  async selectModel(models) {
    console.log(chalk.yellow('\n你可以：'));
    console.log(chalk.white('  1. 使用推荐的最强模型（自动选择）'));
    console.log(chalk.white('  2. 自己选择模型（支持搜索）\n'));

    const { choice } = await inquirer.prompt([{
      type: 'list',
      name: 'choice',
      message: '请选择:',
      choices: [
        { name: '使用推荐模型（最强，推荐）', value: 'auto' },
        { name: '自己选择模型', value: 'manual' },
      ],
      default: 'auto',
    }]);

    if (choice === 'auto') {
      const bestModel = this.findBestModel(models);
      return bestModel;
    }

    // 手动选择，支持搜索
    const modelChoices = models.map(m => ({
      name: m.id,
      value: m,
    }));

    const { selectedModel } = await inquirer.prompt([{
      type: 'autocomplete',
      name: 'selectedModel',
      message: '搜索并选择模型（输入关键词筛选）:',
      source: async (answersSoFar, input) => {
        input = input || '';
        const filtered = modelChoices.filter(choice =>
          choice.name.toLowerCase().includes(input.toLowerCase())
        );
        return filtered;
      },
    }]);

    return selectedModel;
  }

  // 应用配置到 OpenClaw
  async applyToOpenClaw() {
    try {
      const configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json');
      const configDir = path.dirname(configPath);

      // 确保目录存在
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      // 读取现有配置
      let existingConfig = {};
      if (fs.existsSync(configPath)) {
        try {
          existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          // 备份
          const backupPath = `${configPath}.backup`;
          fs.writeFileSync(backupPath, JSON.stringify(existingConfig, null, 2));
        } catch {
          // 配置文件损坏，创建新的
        }
      }

      // 使用正确的配置格式
      const newConfig = {
        ...existingConfig,
        // anthropic 配置在顶层
        anthropic: {
          apiKey: this.config.apiKey,
          baseURL: this.config.apiEndpoint,
        },
        // agents.defaults 只包含模型配置
        agents: {
          ...(existingConfig.agents || {}),
          defaults: {
            ...(existingConfig.agents?.defaults || {}),
            model: {
              primary: this.config.model,
            },
          },
        },
      };

      // 删除旧格式的配置（如果存在）
      delete newConfig.agent;

      fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');
      return true;
    } catch (error) {
      return false;
    }
  }

  // 一键配置流程
  async quickSetup() {
    console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.cyan('  🚀 OpenClaw 配置向导'));
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    console.log(chalk.gray('只需 3 步，轻松完成配置 😊\n'));

    // 步骤 1: API Key
    console.log(chalk.yellow('📝 第 1 步：输入 API Key'));
    console.log(chalk.gray('这是连接 AI 服务的密钥\n'));

    const { apiKey } = await inquirer.prompt([{
      type: 'password',
      name: 'apiKey',
      message: '请粘贴你的 API Key:',
      validate: (input) => {
        if (!input) return '请输入 API Key';
        if (input.length < 10) return 'API Key 看起来不太对，请检查';
        return true;
      },
    }]);
    this.config.apiKey = apiKey;
    console.log(chalk.green('✅ 已保存\n'));

    // 步骤 2: 选择服务商
    console.log(chalk.yellow('📝 第 2 步：选择服务商'));
    console.log(chalk.gray('选择你购买 API Key 的服务商\n'));

    const { provider } = await inquirer.prompt([{
      type: 'list',
      name: 'provider',
      message: '你的 API Key 来自哪里？',
      choices: [
        { name: 'VibeCoding（推荐，国内快）', value: 'vibecoding' },
        { name: 'Anthropic 官方', value: 'anthropic' },
        { name: 'OpenRouter', value: 'openrouter' },
        { name: '其他', value: 'custom' },
      ],
      default: 'vibecoding',
    }]);

    if (provider === 'custom') {
      const { customUrl } = await inquirer.prompt([{
        type: 'input',
        name: 'customUrl',
        message: '请输入 API 地址:',
        validate: (input) => {
          if (!input.startsWith('http')) return '地址应该以 http:// 或 https:// 开头';
          return true;
        },
      }]);
      this.config.apiEndpoint = customUrl;
    } else {
      const endpoints = {
        vibecoding: 'https://vibecodingapi.ai/v1',
        anthropic: 'https://api.anthropic.com/v1',
        openrouter: 'https://openrouter.ai/api/v1',
      };
      this.config.apiEndpoint = endpoints[provider];
    }
    console.log(chalk.green('✅ 已设置\n'));

    // 步骤 3: 获取模型
    console.log(chalk.yellow('📝 第 3 步：选择 AI 模型'));
    console.log(chalk.gray('正在为你选择最合适的模型...\n'));

    const spinner = ora('连接服务器...').start();

    try {
      const models = await this.fetchModels();

      if (models.length === 0) {
        spinner.fail('获取模型失败');
        console.log(chalk.red('\n❌ 无法获取模型列表\n'));
        console.log(chalk.yellow('可能的原因：'));
        console.log(chalk.white('  1. API Key 不正确'));
        console.log(chalk.white('  2. 服务商地址不对'));
        console.log(chalk.white('  3. 网络连接问题\n'));

        const { retry } = await inquirer.prompt([{
          type: 'confirm',
          name: 'retry',
          message: '要重新配置吗？',
          default: true,
        }]);

        if (retry) {
          return await this.quickSetup();
        }
        return false;
      }

      spinner.succeed(`已获取 ${models.length} 个可用模型`);

      const selectedModel = await this.selectModel(models);
      this.config.model = selectedModel.id;
      console.log(chalk.green(`\n✅ 已选择: ${selectedModel.id}\n`));

    } catch (error) {
      spinner.fail('连接失败');

      if (error.message === 'API_KEY_INVALID') {
        console.log(chalk.red('\n❌ API Key 不正确\n'));
        console.log(chalk.yellow('请检查：'));
        console.log(chalk.white('  • API Key 是否复制完整'));
        console.log(chalk.white('  • API Key 是否已过期\n'));
      } else if (error.message === 'ENDPOINT_INVALID') {
        console.log(chalk.red('\n❌ 服务商地址不正确\n'));
      } else if (error.name === 'AbortError') {
        console.log(chalk.red('\n❌ 连接超时\n'));
        console.log(chalk.yellow('可能是网络太慢或需要代理\n'));
      } else {
        console.log(chalk.red('\n❌ 连接失败\n'));
        console.log(chalk.gray(`错误: ${error.message}\n`));
      }

      const { retry } = await inquirer.prompt([{
        type: 'confirm',
        name: 'retry',
        message: '要重新配置吗？',
        default: true,
      }]);

      if (retry) {
        return await this.quickSetup();
      }
      return false;
    }

    // 显示配置摘要
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.cyan('  📋 配置摘要'));
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
    console.log(chalk.green('✓ API Key: 已设置'));
    console.log(chalk.green(`✓ 服务商: ${this.config.apiEndpoint}`));
    console.log(chalk.green(`✓ AI 模型: ${this.config.model}\n`));

    // 确认
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: '确认应用配置？',
      default: true,
    }]);

    if (!confirm) {
      console.log(chalk.yellow('\n已取消\n'));
      return false;
    }

    // 应用配置
    const applySpinner = ora('正在保存配置...').start();
    const success = await this.applyToOpenClaw();

    if (success) {
      applySpinner.succeed('配置已保存');

      console.log(chalk.green('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.green('  🎉 配置完成！'));
      console.log(chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

      console.log(chalk.cyan('接下来：\n'));
      console.log(chalk.white('1. 启动 OpenClaw:'));
      console.log(chalk.cyan('   openclaw gateway\n'));
      console.log(chalk.white('2. 配置消息平台:'));
      console.log(chalk.cyan('   openclaw channels login\n'));

      return true;
    } else {
      applySpinner.fail('保存失败');
      console.log(chalk.red('\n❌ 配置保存失败\n'));
      return false;
    }
  }

  // 主流程
  async run() {
    this.showBanner();

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: '请选择操作:',
      choices: [
        { name: '🚀 配置 OpenClaw', value: 'config' },
        { name: '🧹 清空当前配置', value: 'clear' },
        { name: '🗑️  完全卸载 OpenClaw', value: 'uninstall' },
        { name: '❌ 退出', value: 'exit' },
      ],
    }]);

    if (action === 'config') {
      await this.quickSetup();
    } else if (action === 'clear') {
      await this.clearConfig();
    } else if (action === 'uninstall') {
      await this.uninstallOpenClaw();
    }

    console.log(chalk.cyan('\n👋 再见！\n'));
  }

  // 清空当前配置
  async clearConfig() {
    console.log(chalk.yellow('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('  🧹 清空当前配置'));
    console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    console.log(chalk.gray('此操作将清空：\n'));
    console.log(chalk.white('  • API Key'));
    console.log(chalk.white('  • API 节点配置'));
    console.log(chalk.white('  • 模型配置\n'));

    console.log(chalk.gray('不会删除：\n'));
    console.log(chalk.white('  • OpenClaw 程序'));
    console.log(chalk.white('  • 会话记录'));
    console.log(chalk.white('  • 其他配置\n'));

    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: '确定要清空配置吗？',
      default: false,
    }]);

    if (!confirm) {
      console.log(chalk.yellow('\n已取消\n'));
      return;
    }

    const spinner = ora('正在清空配置...').start();

    try {
      const configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json');

      if (!fs.existsSync(configPath)) {
        spinner.info('配置文件不存在');
        return;
      }

      // 读取现有配置
      const existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      // 备份
      const backupPath = `${configPath}.backup.${Date.now()}`;
      fs.writeFileSync(backupPath, JSON.stringify(existingConfig, null, 2));

      // 删除 API 相关配置
      delete existingConfig.anthropic;
      if (existingConfig.agents?.defaults?.model) {
        delete existingConfig.agents.defaults.model;
      }

      // 写回配置
      fs.writeFileSync(configPath, JSON.stringify(existingConfig, null, 2), 'utf-8');

      spinner.succeed('配置已清空');

      console.log(chalk.green('\n✅ 配置已清空\n'));
      console.log(chalk.gray(`备份文件: ${path.basename(backupPath)}\n`));

      const { reconfigure } = await inquirer.prompt([{
        type: 'confirm',
        name: 'reconfigure',
        message: '要现在重新配置吗？',
        default: true,
      }]);

      if (reconfigure) {
        console.log('');
        await this.quickSetup();
      }

    } catch (error) {
      spinner.fail('清空失败');
      console.log(chalk.red(`\n错误: ${error.message}\n`));
    }
  }

  // 完全卸载 OpenClaw
  async uninstallOpenClaw() {
    console.log(chalk.red('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.red('  🗑️  完全卸载 OpenClaw'));
    console.log(chalk.red('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    console.log(chalk.yellow('⚠️  警告：此操作将删除：\n'));
    console.log(chalk.white('  • OpenClaw 程序'));
    console.log(chalk.white('  • 所有配置文件'));
    console.log(chalk.white('  • 所有数据和会话记录'));
    console.log(chalk.white('  • 工作区文件\n'));

    console.log(chalk.gray('以下内容将被删除：'));
    console.log(chalk.gray('  ~/.openclaw/'));
    console.log(chalk.gray('  OpenClaw 全局安装\n'));

    const { confirm1 } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm1',
      message: '确定要完全卸载 OpenClaw 吗？',
      default: false,
    }]);

    if (!confirm1) {
      console.log(chalk.yellow('\n已取消卸载\n'));
      return;
    }

    const { confirm2 } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm2',
      message: '再次确认：真的要删除所有数据吗？（此操作不可恢复）',
      default: false,
    }]);

    if (!confirm2) {
      console.log(chalk.yellow('\n已取消卸载\n'));
      return;
    }

    console.log(chalk.cyan('\n开始卸载...\n'));

    // 1. 停止 OpenClaw 服务
    const spinner1 = ora('停止 OpenClaw 服务...').start();
    try {
      const { execSync } = await import('child_process');
      execSync('pkill -f "openclaw gateway"', { stdio: 'pipe' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      spinner1.succeed('服务已停止');
    } catch {
      spinner1.info('服务未运行');
    }

    // 2. 卸载 OpenClaw 程序
    const spinner2 = ora('卸载 OpenClaw 程序...').start();
    try {
      const { execSync } = await import('child_process');

      // 检测系统
      const platform = os.platform();
      let uninstallCmd = 'npm uninstall -g openclaw';

      if (platform === 'linux') {
        uninstallCmd = 'sudo npm uninstall -g openclaw';
      }

      execSync(uninstallCmd, { stdio: 'pipe' });
      spinner2.succeed('程序已卸载');
    } catch (error) {
      spinner2.fail('程序卸载失败');
      console.log(chalk.yellow('\n请手动卸载:'));
      console.log(chalk.cyan('  npm uninstall -g openclaw\n'));
    }

    // 3. 删除配置和数据
    const spinner3 = ora('删除配置和数据...').start();
    try {
      const openclawDir = path.join(os.homedir(), '.openclaw');

      if (fs.existsSync(openclawDir)) {
        // 递归删除目录
        fs.rmSync(openclawDir, { recursive: true, force: true });
        spinner3.succeed('配置和数据已删除');
      } else {
        spinner3.info('配置目录不存在');
      }
    } catch (error) {
      spinner3.fail('删除失败');
      console.log(chalk.yellow('\n请手动删除:'));
      console.log(chalk.cyan(`  rm -rf ${path.join(os.homedir(), '.openclaw')}\n`));
    }

    console.log(chalk.green('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.green('  ✅ 卸载完成'));
    console.log(chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    console.log(chalk.cyan('OpenClaw 已完全卸载\n'));
    console.log(chalk.gray('如需重新安装:'));
    console.log(chalk.white('  npm install -g openclaw\n'));
  }
}

// 启动
const config = new OpenClawConfig();
config.run().catch(error => {
  console.error(chalk.red('\n程序出错:'), error.message);
  process.exit(1);
});
