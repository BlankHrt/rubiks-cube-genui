# 🎲 Rubik's Cube CFOP 3D Trainer (GenUI & AI Agent Skills)

<p align="center">
  <img src="./logo.png" alt="Rubik's Cube Logo" width="120" />
</p>

<p align="center">
  <b>A lightweight, interactive 3D CFOP formula trainer & GenUI widget, powered by cubing.js and AI Agent Skills.</b>
</p>

<p align="center">
  <b>English</b> | <a href="./README_ZH.md">简体中文</a>
</p>

<p align="center">
  <a href="https://www.icubing.com/en"><img src="https://img.shields.io/badge/Live%20Platform-iCubing.com-blue?style=for-the-badge&logo=googlechrome" alt="iCubing.com"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"></a>
  <a href="https://js.cubing.net/cubing/"><img src="https://img.shields.io/badge/Powered%20By-cubing.js-orange?style=for-the-badge" alt="cubing.js"></a>
</p>

---

## 🌟 Overview

**rubiks-cube-genui** is an interactive, responsive 3D Rubik's cube CFOP algorithm quick-reference widget built for **GenUI** conversational applications and web embeddings.

It features full 3D interactive cube playback, gesture rotation, complete CFOP formula stages (41 F2L + 57 OLL + 21 PLL = 119 cases), and built-in **AI Agent Skills** (`.agents/skills`) that teach AI coding assistants (such as Antigravity, Cursor, and Claude Code) how to automatically build, test, and publish interactive cards.

> 🚀 **Looking for advanced algorithm training, Bluetooth Smart Cube timing, and 3D solvers?**  
> Visit our full-featured web platform: **[iCubing.com (English)](https://www.icubing.com/en)** | **[魔方小站 (中文)](https://www.icubing.com)**

---

## ✨ Features

- 🧊 **Interactive 3D Visualizer**: Real-time 3D cube rendering powered by `cubing.js` (`<twisty-player>`), supporting step-by-step playback, speed control, and smooth touch gestures.
- 📖 **Complete CFOP 119 Formulas**: Comprehensive collection of **41 F2L**, **57 OLL**, and **21 PLL** algorithms with standard WCA notation.
- 📱 **GenUI Card Specification**: Ready-to-use GenUI widget adhering to official design standards (`app.json` + `index.html`), optimized for 1:1 aspect ratio embedding in chat and mobile search interfaces.
- 🛡️ **Zero External Network Dependencies**: Bundled with inlined `cubing-twisty` engine, complying with strict CSP and sandbox security rules (`@cosui/genui-toolkit check` 0 risks).
- 🤖 **AI Agent Skills Included**: Bundled with `.agents/skills` (`genui-app-builder`, `genui-creator`, `genui-toolkit`) for automated development, testing, and CLI publishing workflows.

---

## 📁 Project Structure

The project adopts a **modular development source + single-file automated bundling** architecture, ensuring clean maintainability and 100% compliance with Baidu GenUI sandbox rules:

```text
rubiks-cube-genui/
├── src/                        # Modular source code (edit during development)
│   ├── index.template.html     # HTML card template shell
│   ├── style.css               # Card stylesheet (responsive layout & controls)
│   ├── app.js                  # Interactive logic (algorithms, 3D player, masks, mnemonics)
│   ├── cfop-data.js            # Complete CFOP 119 database & mask settings
│   └── lib/
│       └── twisty-player.js    # Offline-bundled cubing.js 3D rendering engine
├── build.js                    # Automated single-file bundler (supports --watch)
├── package.json                # Project scripts and dependencies
├── index.html                  # Built self-contained single-file bundle (production artifact)
├── app.json                    # GenUI metadata & config (viewport, tags, keywords)
├── logo.png                    # 256x256 HD app logo
├── logo.jpg                    # Logo source artwork
├── LICENSE                     # MIT License
├── README.md                   # English documentation
└── README_ZH.md                # Chinese documentation
```

---

## 🛠️ Common Development Commands

| Command | Full Script | Description |
| :--- | :--- | :--- |
| **Build** | `npm run build` | Bundles `src/` modules into the single-file `index.html` |
| **Watch & Dev**| `npm run watch` | Watches `src/` directory and rebuilds automatically on file save |
| **Security Check** | `npm run check` | Runs GenUI Toolkit security and compliance audit on `index.html` |
| **Local Preview** | `npm run preview` | Starts the GenUI local sandbox preview server (default: port 9373) |

### Usage Examples

```bash
# 1. Start live development with watch mode
npm run watch

# 2. Build single-file production index.html
npm run build

# 3. Perform security and compliance validation
npm run check

# 4. Preview interactive card in local browser
npm run preview
```

---

## 🚀 Quick Start

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (>= 18) installed.

### 2. Development & Building

1. Make edits to source files under `src/` (`app.js`, `style.css`, `cfop-data.js`, etc.).
2. Run `npm run build` to compile the single-file `index.html`.
3. Run `npm run preview` to launch the local sandbox and test in the browser.

### 3. Static Security & Compliance Check

Before publishing to Baidu GenUI, verify that your code adheres to sandbox and security rules:

```bash
npm run check
# Or: npx @cosui/genui-toolkit check ./index.html
```

You should see:
```text
代码包已通过安全检测。
```

---

## 🌐 Deploy to Baidu GenUI

1. **Log in to Baidu GenUI CLI**:
   ```bash
   npx @cosui/genui-toolkit login
   ```
2. **Review your `app.json`** metadata and keywords.
3. **Publish / Submit for Review**:
   ```bash
   npx @cosui/genui-toolkit publish
   ```

---

## 🔗 Related Ecosystem

This widget is part of the **[iCubing.com](https://www.icubing.com)** Rubik's Cube training ecosystem:
- 🌐 Web: [https://www.icubing.com](https://www.icubing.com) | [English: https://www.icubing.com/en](https://www.icubing.com/en)
- 📱 WeChat Mini Program: 土豆魔方
- ⏱️ Features: CFOP / Roux / 2-Look algorithms, Bluetooth smart cube connection, multi-category timers, and interactive 3D simulations.

---

## 📄 License

[MIT License](./LICENSE) © 2026 BlankHrt / iCubing
