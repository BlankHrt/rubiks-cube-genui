# 🎲 三阶魔方 CFOP 3D 公式速查与教学卡片 (GenUI 微应用)

<p align="center">
  <img src="./logo.png" alt="Rubik's Cube Logo" width="120" />
</p>

<p align="center">
  <b>基于 3D 实时渲染与 Web Component 的三阶魔方 CFOP 交互式教学工具，完全自包含单文件架构，适配百度搜索直达 (GenUI VCard) 与 AI Agent 自动化开发工作流。</b>
</p>

<p align="center">
  <a href="./README.md">English Documentation</a> | <b>简体中文</b>
</p>

<p align="center">
  <a href="https://www.icubing.com"><img src="https://img.shields.io/badge/官方主站-土豆魔方%20iCubing.com-blue?style=for-the-badge&logo=googlechrome" alt="iCubing.com"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/开源协议-MIT-green?style=for-the-badge" alt="License"></a>
  <a href="https://js.cubing.net/cubing/"><img src="https://img.shields.io/badge/3D引擎-cubing.js-orange?style=for-the-badge" alt="cubing.js"></a>
</p>

---

## 🌟 项目简介

**rubiks-cube-genui** 是专为 **GenUI（生成式 UI / 智能体搜索直达卡片）** 规范打造的三阶魔方 CFOP 算法 3D 互动速查微应用。

项目采用 1:1 响应式正方形卡片容器，全自包含单文件结构（零外部 CDN 脚本依赖，通过百度官方最严格的沙盒安全与 CSP 检测），支持在手机端百度搜索第 0 位直达展示、AI 智能体对话流或任意网页无缝嵌入。

> 🚀 **想要体验完整的魔方计时器、智能蓝牙魔方硬件连接与全流派算法库？**  
> 欢迎访问我们的多端主站平台：**[土豆魔方 (中文官网)](https://www.icubing.com)** | **[iCubing.com (International)](https://www.icubing.com/en)**

---

## ✨ 核心特性

- 🧊 **3D 交互式可视化引擎**：基于 `cubing.js` (`twisty-player`) 定制优化，单指/鼠标 360° 拖拽旋转，支持平滑一键复位视角。
- 📚 **100% 完整收录 CFOP 119 式大库**：
  - **F2L（前两层）**：全套 41 种基本型与进阶入槽解法（标态、分离、合并、角下棱上、棱下角上等）；
  - **OLL（顶层朝向）**：全套 57 种翻面形态（点形、十字、田字、小闪电、鱼形、小L、T形等）；
  - **PLL（顶层排列）**：全套 21 种标准置换（Aa、Ab、T、Ua、Ub、H、Z、Y 等）。
- 🎛️ **对齐专业竞速训练的步进控制**：
  - **Move Tokens 步骤缎带**：当前转动步骤高亮放大、已转步骤淡化、未转步骤半透明；
  - **5 键圆盘步进播放器**：支持起始、单步后退、播放/暂停、单步前进、跳到结尾；
  - **解法/打乱一键切换**：支持正向解法演示与逆推打乱演练。
- 🛡️ **严格遵循百度 GenUI 规范**：
  - **100% 单文件自包含**：所有 3D 逻辑、样式、SVG 图标与 119 式数据均内嵌在 `index.html` 中；
  - **无外部跨域网络请求**：彻底杜绝 CSP 安全阻断；
  - **官方交互打点**：各核心交互按钮均注入 `window.genui.sendLog`，获得搜索推荐算法流量加权；
  - **256×256 官方标准 Logo**：附带符合平台规范的纯净高清图标。
- 🤖 **内置完整 AI Agent Skills (`.agents/skills`)**：
  - 内置 `genui-creator`、`genui-toolkit` 和 `genui-app-builder`，支持在 Antigravity、Cursor 等 AI 编程助手上一键执行自动检查、代码重构与 CLI 一键发版。

---

## 📁 目录结构

```text
rubiks-cube-genui/
├── .agents/                    # 百度 GenUI 官方 AI Agent Skills
│   └── skills/
│       ├── genui-app-builder/  # GenUI 生产工具总控路由
│       ├── genui-creator/      # 创作者视觉与代码规范、安全红线与检查清单
│       └── genui-toolkit/      # CLI 工具规范 (preview / check / publish)
├── static/                     # 3D 核心渲染资源
│   └── cubing-twisty.js
├── app.json                    # 百度 GenUI 应用元数据配置文件
├── index.html                  # 核心入口应用 (全自包含 3D CFOP 速查卡片)
├── logo.png                    # 256×256 官方标准高清图标
├── logo.jpg                    # 高清原图素材
├── LICENSE                     # MIT 开源协议
├── README.md                   # 英文说明文档
└── README_ZH.md                # 中文说明文档
```

---

## 🚀 快速上手与本地预览

### 1. 克隆代码仓库

```bash
git clone https://github.com/BlankHrt/rubiks-cube-genui.git
cd rubiks-cube-genui
```

### 2. 启动本地沙盒预览

使用百度官方提供的 `@cosui/genui-toolkit` 启动模拟移动端搜索流预览：

```bash
npx @cosui/genui-toolkit preview
```

终端将输出本地访问地址（例如 `http://127.0.0.1:9373/pages/shim.html`）并在浏览器自动打开，您可以直接在网页或用手机连接同一局域网体验真实的搜索卡片交互。

### 3. 运行静态代码安全检测

提交前运行官方安全规则合规性审查：

```bash
npx @cosui/genui-toolkit check index.html
```

当输出 `代码包已通过安全检测。` 时，代表代码完全符合规范，无任何违规 API 或安全隐患。

---

## 📦 发布上线到百度搜索直达 (GenUI)

如果您拥有百度搜索资源平台 / 智能体开发者账号，可以通过以下步骤将本应用发布至百度搜索：

1. **登录百度账号**：
   ```bash
   npx @cosui/genui-toolkit login
   ```
2. **预演发布参数（不实际提交）**：
   ```bash
   npx @cosui/genui-toolkit publish --dry-run
   ```
3. **正式提交审核**：
   ```bash
   npx @cosui/genui-toolkit publish --yes
   ```
4. **查看发布状态**：
   ```bash
   npx @cosui/genui-toolkit list
   ```
   或前往 [百度智能体平台控制台](https://ziyuan.baidu.com/aitoolset/index) 查看审核进度。

---

## 🤝 鸣谢与致谢

- **3D 引擎支持**：感谢 [cubing.js](https://github.com/cubing/cubing.js) 开源社区提供的卓越 3D 魔方渲染能力。
- **算法数据支持**：[土豆魔方 iCubing.com](https://www.icubing.com) 官方算法研发团队。
- **开发规范与工具**：感谢百度 CosUI 团队提供的 GenUI 架构与官方 AI Toolkit。

---

## 📄 开源许可

本项目基于 [MIT 许可证](./LICENSE) 开源。
