/**
 * Baidu GenUI Single-File Builder
 * 
 * 用途：将开发态的模块化源码（HTML、CSS、3D引擎、CFOP数据、交互逻辑）
 * 一键拼装合并成符合百度 GenUI 规范的自包含单文件 index.html。
 * 
 * 运行命令：
 *   node build.js          # 执行一次构建
 *   node build.js --watch  # 监听 src/ 目录，保存即自动构建
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const OUTPUT_HTML = path.join(ROOT_DIR, 'index.html');
const STANDALONE_REPO_HTML = path.resolve(ROOT_DIR, '../../../rubiks-cube-genui/index.html');

function build() {
    const startTime = Date.now();
    try {
        const template = fs.readFileSync(path.join(SRC_DIR, 'index.template.html'), 'utf-8');
        const css = fs.readFileSync(path.join(SRC_DIR, 'style.css'), 'utf-8');
        const twisty = fs.readFileSync(path.join(SRC_DIR, 'lib', 'twisty-player.js'), 'utf-8');
        const data = fs.readFileSync(path.join(SRC_DIR, 'cfop-data.js'), 'utf-8');
        const app = fs.readFileSync(path.join(SRC_DIR, 'app.js'), 'utf-8');

        let result = template
            .split('/* {{INJECT_CSS}} */').join(css)
            .split('/* {{INJECT_TWISTY}} */').join(twisty)
            .split('/* {{INJECT_DATA}} */').join(data)
            .split('/* {{INJECT_APP}} */').join(app);

        fs.writeFileSync(OUTPUT_HTML, result, 'utf-8');

        // 同步至独立开源仓库（如果目录存在）
        const standaloneDir = path.dirname(STANDALONE_REPO_HTML);
        if (fs.existsSync(standaloneDir)) {
            fs.writeFileSync(STANDALONE_REPO_HTML, result, 'utf-8');
            const destSrc = path.join(standaloneDir, 'src');
            fs.cpSync(SRC_DIR, destSrc, { recursive: true, force: true });
            fs.copyFileSync(path.join(ROOT_DIR, 'build.js'), path.join(standaloneDir, 'build.js'));
            fs.copyFileSync(path.join(ROOT_DIR, 'package.json'), path.join(standaloneDir, 'package.json'));
            if (fs.existsSync(path.join(ROOT_DIR, 'README.md'))) {
                fs.copyFileSync(path.join(ROOT_DIR, 'README.md'), path.join(standaloneDir, 'README.md'));
            }
            if (fs.existsSync(path.join(ROOT_DIR, 'README_ZH.md'))) {
                fs.copyFileSync(path.join(ROOT_DIR, 'README_ZH.md'), path.join(standaloneDir, 'README_ZH.md'));
            }
        }

        const sizeKb = (Buffer.byteLength(result, 'utf-8') / 1024).toFixed(1);
        const elapsed = Date.now() - startTime;
        console.log(`[${new Date().toLocaleTimeString()}] ✅ 构建完成！产物体积: ${sizeKb} KB (${elapsed}ms) -> ${OUTPUT_HTML}`);
    } catch (err) {
        console.error(`❌ 构建失败:`, err.message);
    }
}

// 首次执行
build();

// Watch 模式
if (process.argv.includes('--watch') || process.argv.includes('-w')) {
    console.log(`👀 已启动监听模式，正在监听 ${SRC_DIR} ...`);
    let timer = null;
    fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
            console.log(`\n📝 检测到文件变动: ${filename}`);
            build();
        }, 100);
    });
}
