# 🎲 魔方 CFOP 3D 公式速查与教学卡片 (GenUI 智能体微应用)

<p align="center">
  <img src="./logo.png" alt="Rubik's Cube Logo" width="120" />
</p>

<p align="center">
  <b>基于 cubing.js 与 GenUI 规范构建的轻量级 3D 魔方 CFOP 公式速查微应用，内置 AI Agent 自动化开发技能。</b>
</p>

<p align="center">
  <a href="./README.md">English Documentation</a> | <b>简体中文</b>
</p>

<p align="center">
  <a href="https://www.icubing.com"><img src="https://img.shields.io/badge/官方网站-土豆魔方%20iCubing.com-blue?style=for-the-badge&logo=googlechrome" alt="iCubing.com"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/开源协议-MIT-green?style=for-the-badge" alt="License"></a>
  <a href="https://js.cubing.net/cubing/"><img src="https://img.shields.io/badge/3D引擎-cubing.js-orange?style=for-the-badge" alt="cubing.js"></a>
</p>

---

## 🌟 项目简介

**rubiks-cube-genui** 是专为 **GenUI（生成式 UI / 搜索直达卡片）** 规范打造的 3D 魔方 CFOP 公式速查微应用。

项目采用 1:1 自适应正方形卡片设计，采用**单文件全内联架构**（无外部 CDN 脚本，通过严格的沙箱安全策略与 CSP 检查），支持移动端与 PC 端百度搜索 0 位直达展示、AI 对话页面无缝嵌入与手势 3D 旋转推导。

> 🚀 **想要体验完整的魔方计时器、智能蓝牙魔方硬件连接与全套高阶公式？**  
> 欢迎访问我们的多端平台：**[土豆魔方 (中文站)](https://www.icubing.com)** | **[iCubing.com (国际站)](https://www.icubing.com/en)**

---

## ✨ 核心特性

- 🧊 **3D 实时交互渲染**：基于 `cubing.js` (`<twisty-player>`) 引擎，支持流畅手势拖拽旋转、单步递进、反向回退与连续动画演示。
- 📖 **完整 CFOP 119 公式库**：收录官方标准的 **41 个 F2L**、**57 个 OLL** 与 **21 个 PLL** 公式，支持中文/英文别名与步骤分组。
- 📱 **适配 GenUI 卡片规范**：针对移动端对话与搜索 1:1 卡片优化，去除干扰元素，纯净无滚动条视觉，极致紧凑。
- 🛡️ **严格合规安全策略**：静态代码全内联，零外部网络请求，符合沙箱安全规则，已通过 `@cosui/genui-toolkit check` 零风险静态校验。
- 🤖 **内置 AI Agent Skills**：内置 `.agents/skills`（`genui-app-builder`、`genui-creator`、`genui-toolkit`），可供 Antigravity、Cursor、Claude Code 等 AI 助手直接调用，实现代码自迭代与自动化发布。

---

## 📁 目录结构

项目采用 **模块化源码开发 + 一键打包单文件** 的架构设计，兼顾开发可维护性与百度平台单文件沙箱合规：

```text
rubiks-cube-genui/
├── src/                        # 模块化源码（开发阶段编辑）
│   ├── index.template.html     # 卡片 HTML 骨架模版
│   ├── style.css               # 卡片样式表（响应式与控件美化）
│   ├── app.js                  # 交互逻辑（公式选择、3D播放、遮罩渲染、土豆中英口诀）
│   ├── cfop-data.js            # 完整 CFOP 119 公式数据库与遮罩配置
│   └── lib/
│       └── twisty-player.js    # 离线打包的 cubing.js 3D 魔方渲染引擎
├── build.js                    # 单文件自动化合并构建脚本（支持增量与监听）
├── package.json                # 项目配置与常用快捷脚本
├── index.html                  # 构建生成的自包含单文件（上线发布产物）
├── app.json                    # GenUI 规范元数据配置文件（卡片尺寸、标签、搜索关键词）
├── logo.png                    # 256x256 高清应用图标（平台展示用）
├── logo.jpg                    # 图标原图素材
├── LICENSE                     # MIT 开源许可证
├── README.md                   # 英文说明文档
└── README_ZH.md                # 中文说明文档
```

---

## 🛠️ 常用开发命令

| 命令 | 完整指令 | 说明 |
| :--- | :--- | :--- |
| **构建产物** | `npm run build` | 将 `src/` 中的模块合并打包生成单一内联文件 `index.html` |
| **监听开发** | `npm run watch` | 监听 `src/` 目录变动，保存源码即自动重新构建 |
| **安全检查** | `npm run check` | 调用 GenUI Toolkit 对 `index.html` 执行严格安全与合规检测 |
| **本地预览** | `npm run preview` | 启动 GenUI 本地预览沙箱服务器（默认端口 9373） |

### 命令使用示例

```bash
# 1. 启动监听开发（边改代码边自动编译）
npm run watch

# 2. 手动单次打包构建
npm run build

# 3. 提交前进行合规与安全检测（必须显示"代码包已通过安全检测"）
npm run check

# 4. 本地启动沙箱预览卡片效果
npm run preview
```

---

## 🚀 快速上手

### 1. 环境准备

确保本地已安装 [Node.js](https://nodejs.org/) (推荐 >= 18)。

### 2. 开发与构建

1. 修改 `src/` 目录下的代码（如 `app.js`、`style.css`、`cfop-data.js`）。
2. 执行 `npm run build` 编译出符合规范的 `index.html`。
3. 执行 `npm run preview` 打开浏览器进行交互验证。

### 3. 静态安全与合规检测

在提交到百度 GenUI 平台审核前，必须运行静态安全检查：

```bash
npm run check
# 或: npx @cosui/genui-toolkit check ./index.html
```

校验通过将显示：
```text
代码包已通过安全检测。
```

---

## 🌐 部署与发布到百度 GenUI

1. **登录百度开放平台账号**：
   ```bash
   npx @cosui/genui-toolkit login
   ```
2. **确认 `app.json` 配置**：
   检查应用名称、简介、关键词（如“魔方公式”、“CFOP公式”等）。
3. **提交审核与发布**：
   ```bash
   npx @cosui/genui-toolkit publish
   ```

---

## 🔗 相关生态

本项目为 **[土豆魔方 iCubing.com](https://www.icubing.com)** 开源生态的一部分：
- 🌐 Web 官网：[https://www.icubing.com](https://www.icubing.com) | [英文版: https://www.icubing.com/en](https://www.icubing.com/en)
- 📱 微信小程序：土豆魔方
- ⏱️ 核心功能：CFOP / Roux / 二阶至七阶全公式库、智能蓝牙魔方秒连、专业竞速计时器与 3D 还原解法推导。

---

## 📄 开源协议

本项目采用 [MIT 许可证](./LICENSE) © 2026 BlankHrt / iCubing
