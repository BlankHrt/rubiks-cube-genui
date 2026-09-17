/* ── 状态管理 ── */
    var state = {
        currentType: 'OLL',
        currentCaseIndex: 0,
        displayMode: 'solution',
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
    var formulaCard = document.getElementById('formula-card');
    var cardCaseId = document.getElementById('card-case-id');
    var cardCaseName = document.getElementById('card-case-name');
    var cardCaseGroup = document.getElementById('card-case-group');
    var formulaText = document.getElementById('formula-text');
    var modeBadge = document.getElementById('mode-badge');
    var hintToggleMode = document.getElementById('hint-toggle-mode');
    var stepHintCn = document.getElementById('step-hint-cn');
    var formulaTokensEl = document.getElementById('formula-tokens');
    var progressFill = document.getElementById('progress-fill');
    var progressText = document.getElementById('progress-text');

    var btnPlay = document.getElementById('pb-play');
    var btnPrev = document.getElementById('pb-prev');
    var btnNext = document.getElementById('pb-next');
    var btnStart = document.getElementById('pb-start');
    var btnEnd = document.getElementById('pb-end');

    var toolView = document.getElementById('tool-view');
    var toolMask = document.getElementById('tool-mask');
    var toolLang = document.getElementById('tool-lang');
    var toolNext = document.getElementById('tool-next');
    var toolList = document.getElementById('tool-list');
    var toolReset = document.getElementById('tool-reset');

    var caseModal = document.getElementById('case-modal');
    var modalGrid = document.getElementById('modal-grid');
    var modalTitle = document.getElementById('modal-title');
    var btnModalClose = document.getElementById('btn-modal-close');


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

        if (cardCaseId) cardCaseId.textContent = item.id;
        if (cardCaseName) cardCaseName.textContent = state.showChinese ? item.cn : item.en;
        if (cardCaseGroup) cardCaseGroup.textContent = item.group || '';

        renderFormulaDisplay();
        renderTokensRibbon();
        updateProgressUI();
        updatePlayBtnUI();
        applyCubeState();
    }

    function renderFormulaDisplay() {
        if (!formulaCard || !formulaText) return;
        var item = getCurrentCase();
        var isSol = state.displayMode === 'solution';

        formulaCard.className = 'formula-area ' + (isSol ? 'solution-active' : '');
        if (modeBadge) {
            modeBadge.className = 'mode-badge ' + (isSol ? 'solution' : 'scramble');
            modeBadge.textContent = isSol ? '解法' : '打乱';
        }
        if (hintToggleMode) {
            hintToggleMode.textContent = isSol ? '切打乱' : '切解法';
        }

        var moves = state.tokens;
        var html = '';
        moves.forEach(function (m) {
            html += '<span class="formula-move">' + formatMove(m) + '</span>';
        });
        formulaText.className = 'formula-text ' + (isSol ? 'solution' : 'scramble');
        formulaText.innerHTML = html;
    }

    function renderTokensRibbon() {
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
            html += '<button class="' + cls + '" data-step="' + idx + '">' + formatMove(m) + '</button>';
        });
        formulaTokensEl.innerHTML = html;

        if (stepHintCn) {
            if (state.currentStep >= 0 && state.currentStep < state.tokens.length) {
                var currentMove = state.tokens[state.currentStep];
                stepHintCn.textContent = '当前第 ' + (state.currentStep + 1) + ' 步: ' + currentMove + ' (' + (CHINESE_MOVE_NAMES[currentMove] || '转动') + ')';
            } else if (state.currentStep >= state.tokens.length) {
                stepHintCn.textContent = '🎉 公式演示完成！';
            } else {
                stepHintCn.textContent = '点击播放或步进练习';
            }
        }

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
        var total = state.tokens.length;
        var cur = state.currentStep;
        var pct = total === 0 ? 0 : Math.min(100, Math.round((cur / total) * 100));
        progressFill.style.width = pct + '%';
        progressText.textContent = cur + ' / ' + total;
    }

    function updatePlayBtnUI() {
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
            var MASK_MAP = {
                'FB': 'FirstBlock',
                'SB': 'SecondBlock',
                'LSE': 'L6E',
                'CMLL': 'CMLL'
            };
            var stickering = customMask || MASK_MAP[stepType] || stepType;
            if (stickering) {
                player.setAttribute('experimental-stickering', stickering);
            } else {
                player.removeAttribute('experimental-stickering');
            }
            toolMask.classList.add('active');
        } else {
            player.removeAttribute('experimental-stickering');
            toolMask.classList.remove('active');
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

    /* ── 事件监听 ── */
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

    toolView.addEventListener('click', function () {
        if (!player) return;
        player.setAttribute('camera-latitude', '25');
        player.setAttribute('camera-longitude', '20');
        player.setAttribute('camera-distance', '5.2');
        sendLog('operation');
    });

    toolMask.addEventListener('click', function () {
        state.maskEnabled = !state.maskEnabled;
        applyCubeState();
        sendLog('operation');
    });

    toolLang.addEventListener('click', function () {
        state.showChinese = !state.showChinese;
        toolLang.classList.toggle('active', state.showChinese);
        loadCurrentCase(true);
        sendLog('operation');
    });

    toolNext.addEventListener('click', function () {
        var list = FORMULA_DATABASE[state.currentType] || [];
        state.currentCaseIndex = (state.currentCaseIndex + 1) % list.length;
        loadCurrentCase();
        sendLog('operation');
    });

    toolReset.addEventListener('click', function () {
        jumpToStep(0);
        sendLog('operation');
    });

    if (formulaCard) {
        formulaCard.addEventListener('click', function () {
            state.displayMode = state.displayMode === 'solution' ? 'scramble' : 'solution';
            renderFormulaDisplay();
            sendLog('operation');
        });
    }

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

    toolList.addEventListener('click', function () {
        renderModalGrid();
        caseModal.classList.add('open');
        sendLog('operation');
    });

    btnModalClose.addEventListener('click', function () {
        caseModal.classList.remove('open');
    });

    caseModal.addEventListener('click', function (e) {
        if (e.target === caseModal) {
            caseModal.classList.remove('open');
        }
    });

    function renderModalGrid() {
        modalTitle.textContent = '选择公式 (' + state.currentType + ')';
        var list = FORMULA_DATABASE[state.currentType] || [];
        var html = '';
        list.forEach(function (item, idx) {
            var isSel = idx === state.currentCaseIndex;
            html += '<div class="modal-case-item ' + (isSel ? 'selected' : '') + '" data-idx="' + idx + '">';
            html += '  <div class="modal-item-id">' + item.id + '</div>';
            html += '  <div class="modal-item-name">' + (state.showChinese ? item.cn : item.en) + '</div>';
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



    customElements.whenDefined('twisty-player').then(function () {
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
