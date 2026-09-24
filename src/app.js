    /* ── 状态管理 ── */
    var state = {
        currentType: 'F2L',
        currentCaseIndex: 0,
        showChinese: false,
        maskEnabled: true,
        tokens: [],
        currentStep: 0,
        isPlaying: false
    };

    function sendLog(area) {
        if (window.genui && typeof window.genui.sendLog === 'function') {
            window.genui.sendLog({ area: area || 'operation' });
        }
    }

    /* ── DOM 引用 ── */
    var player = document.getElementById('cube-player');
    var caseBadgeId = document.getElementById('case-badge-id');
    var caseBadgeName = document.getElementById('case-badge-name');
    var btnCaseSelect = document.getElementById('btn-case-select');
    var btnCasePrev = document.getElementById('btn-case-prev');
    var btnCaseNext = document.getElementById('btn-case-next');

    var formulaTokensEl = document.getElementById('formula-tokens');
    var progressFill = document.getElementById('progress-fill');
    var progressText = document.getElementById('progress-text');

    var btnPlay = document.getElementById('pb-play');
    var btnPrev = document.getElementById('pb-prev');
    var btnNext = document.getElementById('pb-next');
    var btnStart = document.getElementById('pb-start');
    var btnEnd = document.getElementById('pb-end');

    var toolMask = document.getElementById('tool-mask');
    var toolView = document.getElementById('tool-view');
    var toolLang = document.getElementById('tool-lang');

    var caseModal = document.getElementById('case-modal');
    var modalGrid = document.getElementById('modal-grid');
    var modalTitle = document.getElementById('modal-title');
    var btnModalClose = document.getElementById('btn-modal-close');

    /* ── 规则提示气泡交互 (对齐 layout.html 官方规范) ── */
    var tipsTrigger = document.getElementById('vc-component-tips');
    var tipsTooltip = document.getElementById('vc-component-tips-tooltip');
    var tipsBoundary = document.getElementById('vc-container');
    var isPC = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    var TIPS_PADDING = 12;

    function getBoundaryRect() {
        return tipsBoundary
            ? tipsBoundary.getBoundingClientRect()
            : { left: 0, right: window.innerWidth || document.documentElement.clientWidth };
    }

    function showTipsTooltip() {
        if (!tipsTooltip) return;
        tipsTooltip.style.marginLeft = '';
        tipsTooltip.style.removeProperty('--vc-tooltip-arrow-shift');
        var boundary = getBoundaryRect();
        tipsTooltip.style.setProperty(
            '--vc-tooltip-max-width',
            (boundary.right - boundary.left - TIPS_PADDING * 2) + 'px'
        );
        tipsTooltip.classList.add('visible');
        (window.requestAnimationFrame || function (cb) { return setTimeout(cb, 0); })(adjustTipsTooltipPosition);
    }

    function adjustTipsTooltipPosition() {
        if (!tipsTooltip || !tipsTooltip.classList.contains('visible')) return;
        var rect = tipsTooltip.getBoundingClientRect();
        var boundary = getBoundaryRect();
        var shift = 0;
        if (rect.right > boundary.right - TIPS_PADDING) {
            shift = -(rect.right - (boundary.right - TIPS_PADDING));
        } else if (rect.left < boundary.left + TIPS_PADDING) {
            shift = (boundary.left + TIPS_PADDING) - rect.left;
        }
        if (shift !== 0) {
            tipsTooltip.style.marginLeft = shift + 'px';
            tipsTooltip.style.setProperty('--vc-tooltip-arrow-shift', (-shift) + 'px');
        }
    }

    function hideTipsTooltip() {
        if (!tipsTooltip) return;
        tipsTooltip.classList.remove('visible');
        tipsTooltip.style.marginLeft = '';
        tipsTooltip.style.removeProperty('--vc-tooltip-arrow-shift');
        tipsTooltip.style.removeProperty('--vc-tooltip-max-width');
    }

    function toggleTipsTooltip() {
        if (tipsTooltip && tipsTooltip.classList.contains('visible')) {
            hideTipsTooltip();
        } else {
            showTipsTooltip();
        }
    }

    if (tipsTrigger && tipsTooltip) {
        if (isPC) {
            tipsTrigger.addEventListener('mouseenter', showTipsTooltip);
            tipsTrigger.addEventListener('mouseleave', hideTipsTooltip);
            tipsTrigger.addEventListener('focus', showTipsTooltip);
            tipsTrigger.addEventListener('blur', hideTipsTooltip);
        } else {
            tipsTrigger.addEventListener('click', function (evt) {
                evt.stopPropagation();
                toggleTipsTooltip();
            });
            document.addEventListener('click', hideTipsTooltip);
            tipsTooltip.addEventListener('click', function (evt) {
                evt.stopPropagation();
            });
        }
    }

    /* ── 表头重置按钮 (计算演示类必选，对齐 layout.html) ── */
    var resetTrigger = document.getElementById('vc-component-reset');
    var resetIcon = resetTrigger && resetTrigger.querySelector('.cos-icon-refresh');

    function spinResetIcon() {
        if (!resetIcon) return;
        resetIcon.classList.remove('vc-component-icon-rotating');
        void resetIcon.offsetWidth;
        resetIcon.classList.add('vc-component-icon-rotating');
    }

    function handleReset() {
        spinResetIcon();
        if (player) {
            if (state.isPlaying && typeof player.pause === 'function') {
                player.pause();
            }
            player.setAttribute('camera-latitude', '25');
            player.setAttribute('camera-longitude', '20');
            player.setAttribute('camera-distance', '5.2');
        }
        state.isPlaying = false;
        jumpToStep(0);
        sendLog('operation');
    }

    if (resetTrigger) {
        resetTrigger.addEventListener('click', function (evt) {
            evt.stopPropagation();
            handleReset();
        });
    }

    /* ── 公式解析与名称逻辑 ── */
    function parseTokens(algStr) {
        return algStr.replace(/[()]/g, '').trim().split(/\s+/).filter(Boolean);
    }

    function getCurrentCase() {
        var list = FORMULA_DATABASE[state.currentType] || [];
        return list[state.currentCaseIndex] || list[0];
    }

    function formatMove(move) {
        if (state.showChinese) {
            return CHINESE_MOVE_NAMES[move] || move;
        }
        return move;
    }

    function loadCurrentCase(keepPlayState) {
        var item = getCurrentCase();
        if (!item) return;

        state.tokens = parseTokens(item.alg);
        state.currentStep = 0;
        if (!keepPlayState) state.isPlaying = false;

        if (caseBadgeId) caseBadgeId.textContent = item.id;
        if (caseBadgeName) caseBadgeName.textContent = state.showChinese ? item.cn : item.cn;

        renderTokensRibbon();
        updateProgressUI();
        updatePlayBtnUI();
        applyCubeState();
    }

    function renderTokensRibbon() {
        if (!formulaTokensEl) return;
        var moves = state.tokens;
        var html = '';
        moves.forEach(function (m, idx) {
            var cls = 'move-token ';
            if (idx < state.currentStep) {
                cls += 'move-done';
            } else if (idx === state.currentStep) {
                cls += 'move-current';
            } else {
                cls += 'move-pending';
            }
            html += '<button class="' + cls + '" data-step="' + idx + '" aria-label="第' + (idx + 1) + '步: ' + m + '">' + formatMove(m) + '</button>';
        });
        formulaTokensEl.innerHTML = html;

        var tokenBtns = formulaTokensEl.querySelectorAll('.move-token');
        tokenBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var step = parseInt(btn.getAttribute('data-step'), 10);
                jumpToStep(step);
                sendLog('operation');
            });
        });
    }

    function updateProgressUI() {
        if (!progressFill || !progressText) return;
        var total = state.tokens.length;
        var cur = state.currentStep;
        var pct = total === 0 ? 0 : Math.min(100, Math.round((cur / total) * 100));
        progressFill.style.width = pct + '%';
        progressText.textContent = cur + ' / ' + total;
    }

    function updatePlayBtnUI() {
        if (!btnPlay) return;
        if (state.isPlaying) {
            btnPlay.classList.add('playing');
            btnPlay.textContent = '⏸';
            btnPlay.title = '暂停';
        } else {
            btnPlay.classList.remove('playing');
            btnPlay.textContent = '▶';
            btnPlay.title = '播放';
        }
    }

    var FACE_INDEX = { U: 0, L: 1, F: 2, R: 3, B: 4, D: 5 };
    var customFaceColors = {
        U: 0xffff00, // 黄顶
        D: 0xffffff, // 白底
        L: 0xff0000, // 红
        R: 0xff8000, // 橙
        F: 0x00ff00, // 绿
        B: 0x0000ff  // 蓝
    };

    function applyCustomColors(el) {
        if (!el) return;
        try {
            var root = el.shadow || el.shadowRoot;
            if (!root) return;
            var wrapper = root.querySelector('twisty-3d-scene-wrapper');
            if (!wrapper) {
                var scene = root.querySelector('twisty-scene');
                if (scene) {
                    var sceneRoot = scene.shadow || scene.shadowRoot;
                    if (sceneRoot) wrapper = sceneRoot.querySelector('twisty-3d-scene-wrapper');
                }
            }
            if (!wrapper || typeof wrapper.experimentalTwisty3DPuzzleWrapper !== 'function') return;
            wrapper.experimentalTwisty3DPuzzleWrapper().then(function (pw) {
                if (!pw) return;
                return pw.twisty3DPuzzle();
            }).then(function (p3d) {
                if (p3d && typeof p3d.experimentalSetFaceColor === 'function') {
                    for (var face in customFaceColors) {
                        p3d.experimentalSetFaceColor(FACE_INDEX[face], customFaceColors[face]);
                    }
                }
            }).catch(function () {});
        } catch (e) {}
    }

    function applyCubeState() {
        var item = getCurrentCase();
        if (!item || !player) return;

        player.setAttribute('camera-latitude', '25');
        player.setAttribute('camera-longitude', '20');
        player.setAttribute('hint-facelets', 'floating');
        player.removeAttribute('backface-opacity');

        if (state.maskEnabled) {
            var customMask = item.mask;
            var stepType = (state.currentType || '').toUpperCase();
            var stickering = customMask || stepType;
            if (stickering) {
                player.setAttribute('experimental-stickering', stickering);
            } else {
                player.removeAttribute('experimental-stickering');
            }
            if (toolMask) toolMask.classList.add('active');
        } else {
            player.removeAttribute('experimental-stickering');
            if (toolMask) toolMask.classList.remove('active');
        }

        player.setAttribute('alg', item.alg);
        player.setAttribute('experimental-setup-anchor', 'end');

        if (typeof player.jumpToStart === 'function') {
            player.jumpToStart();
        }

        applyCustomColors(player);
    }

    function jumpToStep(targetIndex) {
        if (!player) return;
        state.isPlaying = false;
        updatePlayBtnUI();

        if (typeof player.jumpToStart === 'function') {
            player.jumpToStart();
        }

        state.currentStep = Math.max(0, Math.min(targetIndex, state.tokens.length));
        for (var i = 0; i < state.currentStep; i++) {
            if (player.controller && player.controller.animationController) {
                player.controller.animationController.play({ direction: 1, untilBoundary: 1 });
            } else if (typeof player.stepForward === 'function') {
                player.stepForward();
            }
        }
        renderTokensRibbon();
        updateProgressUI();
    }

    /* ── 播放器事件 ── */
    if (btnPlay) {
        btnPlay.addEventListener('click', function () {
            if (!player) return;
            if (state.isPlaying) {
                if (typeof player.pause === 'function') player.pause();
                state.isPlaying = false;
            } else {
                if (state.currentStep >= state.tokens.length) {
                    if (typeof player.jumpToStart === 'function') player.jumpToStart();
                    state.currentStep = 0;
                }
                if (typeof player.play === 'function') player.play();
                state.isPlaying = true;
            }
            updatePlayBtnUI();
            sendLog('operation');
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', function () {
            if (!player) return;
            state.isPlaying = false;
            updatePlayBtnUI();
            if (player.controller && player.controller.animationController) {
                player.controller.animationController.play({ direction: -1, untilBoundary: 1 });
            } else if (typeof player.stepBackward === 'function') {
                player.stepBackward();
            }
            if (state.currentStep > 0) state.currentStep--;
            renderTokensRibbon();
            updateProgressUI();
            sendLog('operation');
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', function () {
            if (!player) return;
            state.isPlaying = false;
            updatePlayBtnUI();
            if (player.controller && player.controller.animationController) {
                player.controller.animationController.play({ direction: 1, untilBoundary: 1 });
            } else if (typeof player.stepForward === 'function') {
                player.stepForward();
            }
            if (state.currentStep < state.tokens.length) state.currentStep++;
            renderTokensRibbon();
            updateProgressUI();
            sendLog('operation');
        });
    }

    if (btnStart) {
        btnStart.addEventListener('click', function () {
            if (!player) return;
            state.isPlaying = false;
            updatePlayBtnUI();
            if (typeof player.jumpToStart === 'function') player.jumpToStart();
            state.currentStep = 0;
            renderTokensRibbon();
            updateProgressUI();
            sendLog('operation');
        });
    }

    if (btnEnd) {
        btnEnd.addEventListener('click', function () {
            if (!player) return;
            state.isPlaying = false;
            updatePlayBtnUI();
            if (typeof player.jumpToEnd === 'function') player.jumpToEnd();
            state.currentStep = state.tokens.length;
            renderTokensRibbon();
            updateProgressUI();
            sendLog('operation');
        });
    }

    /* ── 辅助工具按钮 ── */
    if (toolView) {
        toolView.addEventListener('click', function () {
            if (!player) return;
            player.setAttribute('camera-latitude', '25');
            player.setAttribute('camera-longitude', '20');
            player.setAttribute('camera-distance', '5.2');
            sendLog('operation');
        });
    }

    if (toolMask) {
        toolMask.addEventListener('click', function () {
            state.maskEnabled = !state.maskEnabled;
            applyCubeState();
            sendLog('operation');
        });
    }

    if (toolLang) {
        toolLang.addEventListener('click', function () {
            state.showChinese = !state.showChinese;
            toolLang.classList.toggle('active', state.showChinese);
            loadCurrentCase(true);
            sendLog('operation');
        });
    }

    /* ── 公式切换与选公式 ── */
    if (btnCasePrev) {
        btnCasePrev.addEventListener('click', function () {
            var list = FORMULA_DATABASE[state.currentType] || [];
            state.currentCaseIndex = (state.currentCaseIndex - 1 + list.length) % list.length;
            loadCurrentCase();
            sendLog('operation');
        });
    }

    if (btnCaseNext) {
        btnCaseNext.addEventListener('click', function () {
            var list = FORMULA_DATABASE[state.currentType] || [];
            state.currentCaseIndex = (state.currentCaseIndex + 1) % list.length;
            loadCurrentCase();
            sendLog('operation');
        });
    }

    if (btnCaseSelect) {
        btnCaseSelect.addEventListener('click', function () {
            renderModalGrid();
            caseModal.classList.add('open');
            sendLog('operation');
        });
    }

    /* ── 分类 Tabs 切换 ── */
    var switchBtns = document.querySelectorAll('#type-switch .switch-btn');
    switchBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            switchBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.currentType = btn.getAttribute('data-type');
            state.currentCaseIndex = 0;
            loadCurrentCase();
            sendLog('operation');
        });
    });

    /* ── 弹窗抽屉 ── */
    if (btnModalClose) {
        btnModalClose.addEventListener('click', function () {
            caseModal.classList.remove('open');
        });
    }

    if (caseModal) {
        caseModal.addEventListener('click', function (e) {
            if (e.target === caseModal) {
                caseModal.classList.remove('open');
            }
        });
    }

    function renderModalGrid() {
        if (!modalTitle || !modalGrid) return;
        modalTitle.textContent = '选择公式 (' + state.currentType + ')';
        var list = FORMULA_DATABASE[state.currentType] || [];
        var html = '';
        list.forEach(function (item, idx) {
            var isSel = idx === state.currentCaseIndex;
            html += '<div class="modal-case-item ' + (isSel ? 'selected' : '') + '" data-idx="' + idx + '">';
            html += '  <div class="modal-item-id">' + item.id + '</div>';
            html += '  <div class="modal-item-name">' + (state.showChinese ? item.cn : item.cn) + '</div>';
            html += '</div>';
        });
        modalGrid.innerHTML = html;

        var items = modalGrid.querySelectorAll('.modal-case-item');
        items.forEach(function (el) {
            el.addEventListener('click', function () {
                var idx = parseInt(el.getAttribute('data-idx'), 10);
                state.currentCaseIndex = idx;
                loadCurrentCase();
                caseModal.classList.remove('open');
                sendLog('operation');
            });
        });
    }

    /* ── 监听 3D 组件注册完毕并精准执行首屏打乱与朝向 ── */
    customElements.whenDefined('twisty-player').then(function () {
        loadCurrentCase();
        setTimeout(function () {
            if (typeof player.jumpToStart === 'function') {
                player.jumpToStart();
            }
        }, 50);

        var timeline = player.experimentalModel && player.experimentalModel.coarseTimelineInfo;
        if (timeline && typeof timeline.subscribe === 'function') {
            timeline.subscribe(function (info) {
                if (info) {
                    if (info.atEnd) {
                        state.isPlaying = false;
                        state.currentStep = state.tokens.length;
                        renderTokensRibbon();
                        updateProgressUI();
                        updatePlayBtnUI();
                    } else if (typeof info.playing === 'boolean' && info.playing !== state.isPlaying) {
                        state.isPlaying = info.playing;
                        updatePlayBtnUI();
                    }
                }
            });
        }
    });

    loadCurrentCase();
