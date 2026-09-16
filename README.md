# 🎲 Rubik's Cube CFOP 3D Trainer (GenUI & AI Agent Skills)

<p align="center">
  <img src="./logo.png" alt="Rubik's Cube Logo" width="120" />
</p>

<p align="center">
  <b>A lightweight, interactive 3D CFOP formula trainer & GenUI widget, powered by cubing.js and AI Agent Skills.</b>
</p>

<p align="center">
  <a href="https://www.icubing.com/en"><img src="https://img.shields.io/badge/Live%20Platform-iCubing.com-blue?style=for-the-badge&logo=googlechrome" alt="iCubing.com"></a>
  <a href="https://github.com/BlankHrt/rubiks-cube-genui"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"></a>
  <a href="https://js.cubing.net/cubing/"><img src="https://img.shields.io/badge/Powered%20By-cubing.js-orange?style=for-the-badge" alt="cubing.js"></a>
</p>

---

## 🌟 Overview

**rubiks-cube-genui** is an interactive, responsive 3D Rubik's cube CFOP algorithm quick-reference widget built for **GenUI** conversational applications and web embeddings.

It features full 3D interactive cube playback, gesture rotation, step-by-step formula explanations (F2L, OLL, PLL), and built-in **AI Agent Skills** (`.agents/skills`) that teach AI coding assistants (such as Antigravity, Cursor, and Claude Code) how to automatically generate, test, and publish interactive cards.

> 🚀 **Looking for advanced algorithm training and Bluetooth Smart Cube connection?**  
> Visit our full-featured web platform: **[iCubing.com (English)](https://www.icubing.com/en)** | **[魔方小站 (中文)](https://www.icubing.com)**

---

## �?Features

- 🧊 **Interactive 3D Visualizer**: Real-time 3D cube rendering powered by `cubing.js` (`twisty-player`), supporting step-by-step playback, speed control, and smooth 3D rotations.
- 📖 **Complete CFOP Formula Library**: Pre-configured with essential CFOP stages (Cross, F2L, OLL, PLL) and multiple solution variations.
- 📱 **GenUI Card Specification**: Ready-to-use GenUI widget adhering to official design standards (`app.json` + `index.html`), optimized for 1:1 aspect ratio embedding in chat and mobile interfaces.
- 🤖 **AI Agent Skills Included**: Comes bundled with `.agents/skills` (`genui-app-builder`, `genui-creator`, `genui-toolkit`) for automated development and CLI publishing workflows.

---

## 📁 Project Structure

```text
.
├── .agents/
�?  └── skills/                  # AI Agent Skills for LLM-assisted workflows
�?      ├── genui-app-builder/   # Main router skill
�?      ├── genui-creator/       # Visual design & code specification skill
�?      └── genui-toolkit/       # CLI preview, check, and publish skill
├── static/
�?  └── cubing-twisty.js         # Bundled 3D twisty-player library
├── app.json                     # GenUI card configuration & metadata
├── index.html                   # Main interactive 3D CFOP trainer
├── logo.png                     # Card icon / logo
└── test-twisty.html             # Standalone 3D component test suite
```

---

## 🚀 Quick Start

### 1. Run Locally
Simply open `index.html` in any modern web browser (Chrome, Edge, Safari, Firefox).

Or launch a local development server:
```bash
# Using Python
python -m http.server 8080

# Or using npx serve
npx serve .
```

### 2. Preview with GenUI Toolkit CLI
If you have `@cosui/genui-toolkit` installed:
```bash
npx @cosui/genui-toolkit preview ./index.html
```

---

## 🔗 Ecosystem & Live Demo

- **Full-featured Smart Cube Platform**: [https://www.icubing.com](https://www.icubing.com)
  - Supports Bluetooth smart cubes (GAN, MoYu, QiYi, etc.)
  - 6,000+ algorithms database (ZBLL, 1LLL, COLL, ELL, etc.)
  - Live solve timer & 3D reconstruction

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
