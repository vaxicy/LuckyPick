(function () {
  'use strict';

  const I18N = {
    zh: {
      app_name: 'Lucky Pick',
      mode_label: '\u73A9\u6CD5',
      mode_dice: '\u9AB0\u5B50',
      mode_coin: '\u786C\u5E01',
      mode_wheel: '\u8F6C\u76D8',
      mode_slot: '\u8001\u864E\u673A',
      coin_heads: '\u6B63',
      coin_tails: '\u53CD',
      roll_btn_dice: '\uD83C\uDFB2 \u6447\u9AB0\u51B3\u5B9A',
      roll_btn_coin: '\uD83E\uDE99 \u629B\u786C\u5E01',
      roll_btn_wheel: '\uD83C\uDFA1 \u8F6C\u4E00\u4E0B',
      roll_btn_slot: '\uD83C\uDFB0 \u62C9\u4E00\u4E0B',
      battle_title_dice: '\u6447\u9AB0\u4E2D...',
      battle_title_coin: '\u786C\u5E01\u7FFB\u8F6C\u4E2D...',
      battle_title_wheel: '\u8F6C\u76D8\u65CB\u8F6C\u4E2D...',
      battle_title_slot: '\u8001\u864E\u673A\u8FD0\u884C\u4E2D...',
      winner_label: '\u7ED3\u679C',
      again: '\u518D\u6765\u4E00\u6B21',
      export_btn: '\uD83D\uDDBC \u5BFC\u51FA\u56FE\u7247',
      history_title: '\uD83D\uDCCB \u5386\u53F2\u8BB0\u5F55',
      history_empty: '\u6682\u65E0\u8BB0\u5F55',
      history_incognito: '\u65E0\u75D5\u6A21\u5F0F\u4E0B\u4E0D\u4FDD\u5B58\u8BB0\u5F55',
      clear_history: '\u6E05\u7A7A\u5386\u53F2',
      exported: '\u56FE\u7247\u5DF2\u5BFC\u51FA',
      min_options: '\u81F3\u5C11\u9700\u8981 2 \u4E2A\u9009\u9879',
      max_options: '\u6700\u591A\u652F\u6301 6 \u4E2A\u9009\u9879',
      coin_hint: '\u786C\u5E01\u6A21\u5F0F\u53EA\u4F7F\u7528\u524D 2 \u4E2A\u9009\u9879',
      tie_title: '\u5E73\u5C40\u4E86',
      tie_msg: '\u518D\u6447\u4E00\u6B21\u5427',
      result_msgs_dice: ['Lucky Pick'],
      result_msgs_coin: ['Lucky Pick'],
      result_msgs_wheel: ['Lucky Pick'],
      add_option: '+ \u6DFB\u52A0\u9009\u9879',
      opt_placeholder_a: '\u9009\u9879 A...',
      opt_placeholder_b: '\u9009\u9879 B...',
      opt_placeholder: '\u9009\u9879 {0}...',
      settings_title: '\u2699 \u8BBE\u7F6E',
      settings_tip: '\u8BBE\u7F6E',
      history_tip: '\u5386\u53F2\u8BB0\u5F55',
      language: '\u8BED\u8A00',
      theme_label: '\u6DF1\u8272\u6A21\u5F0F',
      incognito_label: '\u65E0\u75D5\u6A21\u5F0F',
      animation_speed: '\u52A8\u753B\u901F\u5EA6',
      speed_normal: '\u6B63\u5E38',
      speed_fast: '\u5FEB\u901F',
      speed_slow: '\u6162\u901F',
      confirm_cancel: '\u53D6\u6D88',
      confirm_ok: '\u786E\u5B9A',
      confirm_clear: '\u6E05\u7A7A\u6240\u6709\u5386\u53F2\u8BB0\u5F55\uFF1F',
      load_history: '\u52A0\u8F7D\u8FD9\u6761\u8BB0\u5F55\uFF1F',
      rule_export_high: '\u5927\u8005\u80DC'
    },
    en: {
      app_name: 'LuckyPick',
      mode_label: 'Mode',
      mode_dice: 'Dice',
      mode_coin: 'Coin',
      mode_wheel: 'Wheel',
      mode_slot: 'Slot',
      coin_heads: 'Head',
      coin_tails: 'Tail',
      roll_btn_dice: '\uD83C\uDFB2 Roll dice',
      roll_btn_coin: '\uD83E\uDE99 Flip coin',
      roll_btn_wheel: '\uD83C\uDFA1 Spin wheel',
      roll_btn_slot: '\uD83C\uDFB0 Spin',
      battle_title_dice: 'Rolling...',
      battle_title_coin: 'Flipping...',
      battle_title_wheel: 'Spinning...',
      battle_title_slot: 'Spinning...',
      winner_label: 'Result',
      again: 'Again',
      export_btn: '\uD83D\uDDBC Export',
      history_title: '\uD83D\uDCCB History',
      history_empty: 'No records',
      history_incognito: 'Incognito mode: no history saved',
      clear_history: 'Clear history',
      exported: 'Image exported',
      min_options: 'Need at least 2 options',
      max_options: 'Up to 6 options',
      coin_hint: 'Coin mode uses the first 2 options',
      tie_title: 'It is a tie',
      tie_msg: 'Roll again',
      result_msgs_dice: ['Lucky Pick'],
      result_msgs_coin: ['Lucky Pick'],
      result_msgs_wheel: ['Lucky Pick'],
      add_option: '+ Add option',
      opt_placeholder_a: 'Option A...',
      opt_placeholder_b: 'Option B...',
      opt_placeholder: 'Option {0}...',
      settings_title: '\u2699 Settings',
      settings_tip: 'Settings',
      history_tip: 'History',
      language: 'Language',
      theme_label: 'Dark mode',
      incognito_label: 'Incognito',
      animation_speed: 'Animation',
      speed_normal: 'Normal',
      speed_fast: 'Fast',
      speed_slow: 'Slow',
      confirm_cancel: 'Cancel',
      confirm_ok: 'OK',
      confirm_clear: 'Clear all history?',
      load_history: 'Load this record?',
      rule_export_high: 'High wins'
    }
  };

  const MAX_OPTIONS = 6;
  const MAX_HISTORY = 50;
  const RULE = 'high';
  const SPEED = { fast: 0.65, normal: 1, slow: 1.45 };
  const MODES = ['dice', 'coin', 'wheel', 'slot'];
  const WHEEL_COLORS = ['#E88BA8', '#7C6FBE', '#6BAFE0', '#7BC89E', '#F1C56D', '#B58BE8'];
  const STORAGE = {
    settings: 'luckypick_settings',
    history: 'luckypick_history',
    state: 'luckypick_state'
  };

  let lang = 'zh';
  let theme = 'light';
  let mode = 'dice';
  let incognito = false;
  let animSpeed = 'normal';
  let history = [];
  let optionCount = 2;
  let isRolling = false;
  let lastResult = null;
  let saveTimer = null;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const FACE_NUM = { front: 1, back: 6, right: 3, left: 4, top: 2, bottom: 5 };
  const NUM_ROT = {
    1: { x: 0, y: 0 },
    6: { x: 0, y: 180 },
    3: { x: 0, y: -90 },
    4: { x: 0, y: 90 },
    2: { x: -90, y: 0 },
    5: { x: 90, y: 0 }
  };
  const FACE_CLASS = { 1: 'f1', 2: 'f2', 3: 'f3', 4: 'f4', 5: 'f5', 6: 'f6' };

  function t(key) {
    return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  }

  function init() {
    loadSettings(() => {
      applyTheme();
      applyI18n();
      bindRows();
      bindEvents();
      restoreState();
      applyModeUI();
    });
  }

  function bindEvents() {
    on('#btn-add-option', 'click', () => {
      if (mode === 'coin') {
        showToast(t('coin_hint'));
        return;
      }
      if (optionCount >= MAX_OPTIONS) {
        showToast(t('max_options'));
        return;
      }
      addRow('');
      saveStateDebounced();
    });
    on('#btn-roll', 'click', doPick);
    on('#btn-again', 'click', resetToInput);
    on('#btn-export', 'click', exportAsImage);
    on('#btn-history', 'click', openHistoryPanel);
    on('#btn-settings', 'click', openSettingsPanel);
    on('#btn-close-history', 'click', closePanels);
    on('#btn-close-settings', 'click', closePanels);
    on('#panel-overlay', 'click', closePanels);
    on('#btn-clear-history', 'click', clearHistory);

    $$('#set-mode .seg-btn').forEach((button) => {
      button.addEventListener('click', () => {
        setMode(button.dataset.value);
        closePanels();
      });
    });

    $$('#set-lang .seg-btn').forEach((button) => {
      button.addEventListener('click', () => {
        lang = button.dataset.value;
        applyI18n();
        renderSettings();
        applyModeUI();
        saveSettings();
      });
    });

    $$('#set-speed .seg-btn').forEach((button) => {
      button.addEventListener('click', () => {
        animSpeed = button.dataset.value;
        renderSettings();
        saveSettings();
      });
    });

    on('#set-theme', 'click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme();
      renderSettings();
      saveSettings();
    });

    on('#set-incognito', 'click', () => {
      incognito = !incognito;
      renderSettings();
      saveSettings();
    });

    on('#options-list', 'input', (event) => {
      if (event.target.classList.contains('option-input')) saveStateDebounced();
    });
    on('#options-list', 'keydown', (event) => {
      if (event.key === 'Enter') doPick();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.ctrlKey && !isRolling) doPick();
      if (event.key === 'Escape') closePanels();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') saveState();
    });
  }

  function on(selector, event, handler) {
    const node = $(selector);
    if (node) node.addEventListener(event, handler);
  }

  function setMode(nextMode) {
    if (!MODES.includes(nextMode) || nextMode === mode) return;
    mode = nextMode;
    clearResultState();
    applyModeUI();
    renderSettings();
    saveSettings();
    saveStateDebounced();
  }

  function applyModeUI() {
    document.body.dataset.mode = mode;
    setText('#btn-roll', t(`roll_btn_${mode}`));
    const addButton = $('#btn-add-option');
    if (addButton) addButton.classList.toggle('hidden', mode === 'coin');
    reindexRows();
  }

  function applyI18n() {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    setText('#app-name', t('app_name'));
    $$('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    $$('[data-i18n-placeholder]').forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    $$('[data-i18n-title]').forEach((element) => {
      element.title = t(element.dataset.i18nTitle);
    });
    updatePlaceholders();
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function setText(selector, value) {
    const node = $(selector);
    if (node) node.textContent = value;
  }

  function createDice() {
    const dice = document.createElement('div');
    dice.className = 'dice3d';
    ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach((faceName) => {
      const number = FACE_NUM[faceName];
      const face = document.createElement('div');
      face.className = `dice-face face-${faceName} ${FACE_CLASS[number]}`;
      for (let i = 0; i < number; i += 1) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        face.appendChild(dot);
      }
      dice.appendChild(face);
    });
    return dice;
  }

  function setDice(dice, number) {
    const rotation = NUM_ROT[number] || NUM_ROT[1];
    dice.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
  }

  function setDiceRaw(dice, x, y) {
    dice.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  }

  function bindRows() {
    $$('.option-row').forEach(bindRow);
    reindexRows();
  }

  function bindRow(row) {
    const button = row.querySelector('.delete-btn');
    if (!button) return;
    button.addEventListener('click', () => {
      if (mode === 'coin' || optionCount <= 2) return;
      row.remove();
      optionCount -= 1;
      reindexRows();
      saveStateDebounced();
    });
  }

  function addRow(value) {
    optionCount += 1;
    const letter = String.fromCharCode(64 + optionCount);
    const row = document.createElement('div');
    row.className = 'option-row';
    row.innerHTML = `
      <span class="badge">${letter}</span>
      <input class="option-input" placeholder="${escapeAttr(t('opt_placeholder').replace('{0}', letter))}" value="${escapeAttr(value || '')}">
      <button class="delete-btn" type="button">&times;</button>
    `;
    const list = $('#options-list');
    if (!list) return;
    list.appendChild(row);
    bindRow(row);
    reindexRows();
  }

  function reindexRows() {
    $$('.option-row').forEach((row, index) => {
      const badge = row.querySelector('.badge');
      const button = row.querySelector('.delete-btn');
      if (badge) badge.textContent = String.fromCharCode(65 + index);
      row.classList.toggle('hidden', mode === 'coin' && index > 1);
      if (button) button.style.visibility = mode !== 'coin' && optionCount > 2 ? 'visible' : 'hidden';
    });
    updatePlaceholders();
  }

  function updatePlaceholders() {
    $$('.option-input').forEach((input, index) => {
      const letter = String.fromCharCode(65 + index);
      if (index === 0) input.placeholder = t('opt_placeholder_a');
      else if (index === 1) input.placeholder = t('opt_placeholder_b');
      else input.placeholder = t('opt_placeholder').replace('{0}', letter);
    });
  }

  function getAllOptions() {
    return $$('.option-input').map((input) => input.value.trim());
  }

  function getModeOptions() {
    const values = getAllOptions();
    const limit = mode === 'coin' ? 2 : MAX_OPTIONS;
    return values.slice(0, limit).filter(Boolean);
  }

  function doPick() {
    if (isRolling) return;
    const options = getModeOptions();
    if (options.length < 2) {
      showToast(t('min_options'));
      return;
    }

    isRolling = true;
    $('#btn-roll')?.classList.add('rolling');
    document.body.classList.remove('result-mode');
    $('#input-section')?.classList.add('hidden');
    $('#result-section')?.classList.add('hidden');
    $('#battle-section')?.classList.remove('hidden');
    setText('#battle-section .battle-title', t(`battle_title_${mode}`));
    if ($('#progress-bar')) $('#progress-bar').style.width = '0%';

    if (mode === 'coin') runCoin(options);
    else if (mode === 'wheel') runWheel(options);
    else if (mode === 'slot') runSlot(options);
    else runDice(options);
  }

  function runDice(options) {
    const rolls = options.map(() => Math.floor(Math.random() * 6) + 1);
    const winners = getWinners(rolls);
    const winnerIndex = winners.length === 1 ? winners[0] : -1;
    const result = {
      id: Date.now(),
      mode: 'dice',
      options,
      rolls,
      winnerIndex,
      winner: winnerIndex >= 0 ? options[winnerIndex] : null,
      rule: RULE,
      isTie: winnerIndex < 0,
      createdAt: new Date().toISOString()
    };

    buildDiceStage(options);
    animateDice(rolls, winnerIndex, () => finishResult(result));
  }

  function runCoin(options) {
    const winnerIndex = Math.floor(Math.random() * 2);
    const result = {
      id: Date.now(),
      mode: 'coin',
      options: options.slice(0, 2),
      winnerIndex,
      winner: options[winnerIndex],
      coinSide: winnerIndex === 0 ? 'heads' : 'tails',
      isTie: false,
      createdAt: new Date().toISOString()
    };

    buildCoinStage(options);
    animateCoin(winnerIndex, () => finishResult(result));
  }

  function runWheel(options) {
    const winnerIndex = Math.floor(Math.random() * options.length);
    const slice = 360 / options.length;
    const finalRotation = (360 * 5) - (winnerIndex * slice + slice / 2);
    const result = {
      id: Date.now(),
      mode: 'wheel',
      options,
      winnerIndex,
      winner: options[winnerIndex],
      wheelColor: wheelColor(winnerIndex),
      wheelRotation: finalRotation,
      isTie: false,
      createdAt: new Date().toISOString()
    };

    buildWheelStage(options);
    animateWheel(finalRotation, () => finishResult(result));
  }


  function runSlot(options) {
    const idx = Math.floor(Math.random() * options.length);
    const result = {
      id: Date.now(),
      mode: 'slot',
      options,
      winnerIndex: idx,
      winner: options[idx],
      isTie: false,
      createdAt: new Date().toISOString()
    };
    buildSlotStage(options);
    animateSlot(idx, options.length, () => finishResult(result));
  }

  function buildSlotStage(options) {
    const stage = $('#dice-stage');
    if (!stage) return;
    stage.className = 'slot-stage';
    stage.innerHTML = `
      <div class="slot-window" id="slot-window">
        <div class="slot-indicator-top"></div>
        <div class="slot-indicator-bottom"></div>
        <div class="slot-reel" id="slot-reel"></div>
      </div>
    `;
    const reel = $('#slot-reel');
    if (!reel) return;
    // 放 30 份 options 副本，保证 JS 滚动时有足够内容，不会露底
    const COPIES = 30;
    for (let c = 0; c < COPIES; c++) {
      options.forEach((option, index) => {
        const item = document.createElement('div');
        item.className = 'slot-item';
        item.dataset.index = index;
        item.innerHTML = `
          <span class="slot-num">${index + 1}</span>
          <span class="slot-text">${escapeHtml(option)}</span>
        `;
        reel.appendChild(item);
      });
    }
    // 初始位置：随机一个偏移，让每次看起来都不同
    const randomStart = Math.floor(Math.random() * options.length) * 54;
    reel.style.transform = `translateY(-${randomStart}px)`;
  }

  function animateSlot(slotIdx, total, done) {
    const reel = $('#slot-reel');
    if (!reel) return;
    const duration = animDuration(1600);
    const itemHeight = 54;
    const start = performance.now();

    // 添加滚动模糊效果
    reel.classList.add('spinning');

    // 读取当前位置（buildSlotStage 设置的随机偏移）
    const computed = window.getComputedStyle(reel);
    const matrix = new DOMMatrix(computed.transform);
    const currentOffset = -matrix.m42 || 0;

    // 目标：在 currentOffset 基础上，再滚 extraSpins 圈 + 停在 slotIdx
    // 这样既有"循环滚动"感，又能精确停到目标
    const extraSpins = 8;
    const totalHeight = total * itemHeight;
    const finalOffset = currentOffset + extraSpins * totalHeight + (slotIdx * itemHeight);

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      if ($('#progress-bar')) {
        $('#progress-bar').style.width = `${progress * 100}%`;
      }

      if (reel) {
        const offset = currentOffset + (finalOffset - currentOffset) * eased;
        reel.style.transform = `translateY(-${offset}px)`;
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // 移除滚动模糊效果
        reel.classList.remove('spinning');

        // 动画结束：把 reel 重置到第一份副本的对应位置（这样结果展示时 DOM 结构正确）
        if (reel) {
          reel.style.transform = `translateY(-${slotIdx * itemHeight}px)`;
        }

        // 获胜项目添加 winner 类和动画
        const items = $$('#slot-reel .slot-item');
        const winItem = items[slotIdx];
        if (winItem) {
          winItem.classList.add('winner');
          
          // 闪烁效果
          let blink = 0;
          const timer = setInterval(() => {
            winItem.style.background = blink % 2 === 0 ? '#ffd4e3' : '#e8dff8';
            blink++;
            if (blink > 5) {
              clearInterval(timer);
              winItem.style.background = '#ffe4ef';
            }
          }, 180);
        }
        setTimeout(done, 420);
      }
    }

    requestAnimationFrame(tick);
  }
    function finishResult(result) {
    isRolling = false;
    $('#btn-roll')?.classList.remove('rolling');
    lastResult = result;
    renderResult(result);
    saveResultState(result);
    if (!incognito) saveHistory(result);
  }

  function getWinners(rolls) {
    const target = Math.max(...rolls);
    return rolls.map((value, index) => (value === target ? index : -1)).filter((index) => index >= 0);
  }

  function buildDiceStage(options) {
    const stage = $('#dice-stage');
    if (!stage) return;
    stage.className = 'dice-stage';
    stage.innerHTML = '';
    options.forEach((option) => {
      const unit = document.createElement('div');
      unit.className = 'dice-unit';
      const dice = createDice();
      setDiceRaw(dice, Math.random() * 360, Math.random() * 360);
      const label = document.createElement('div');
      label.className = 'unit-label';
      label.textContent = option;
      unit.appendChild(dice);
      unit.appendChild(label);
      stage.appendChild(unit);
    });
  }

  function buildCoinStage(options) {
    const stage = $('#dice-stage');
    if (!stage) return;
    stage.className = 'coin-stage';
    stage.innerHTML = `
      <div class="coin3d" id="coin3d">
        <div class="coin-face head" aria-hidden="true">
          <svg class="coin-svg" viewBox="0 0 64 64">
            <defs>
              <filter id="starShadow" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" flood-color="rgba(0,0,0,.28)"/>
              </filter>
            </defs>
            <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(180,130,0,.30)" stroke-width="1.2"/>
            <polygon points="32,15 35,24 45,24 37,30 40,40 32,34 24,40 27,30 19,24 29,24"
                     fill="#daa20a" filter="url(#starShadow)"/>
            <polygon points="32,15 35,24 45,24 37,30 40,40 32,34 24,40 27,30 19,24 29,24"
                     fill="rgba(255,255,200,.16)" style="mix-blend-mode:soft-light"/>
          </svg>
        </div>
        <div class="coin-face tail" aria-hidden="true">
          <svg class="coin-svg" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(120,120,140,.22)" stroke-width="1"/>
          </svg>
        </div>
      </div>
    `;
  }

  function buildWheelStage(options) {
    const stage = $('#dice-stage');
    if (!stage) return;
    stage.className = 'wheel-stage';
    stage.innerHTML = `
      <div class="wheel-wrap">
        <div class="wheel-pointer"></div>
        <div class="wheel-disc" id="wheel-disc"></div>
        <div class="wheel-hub"></div>
      </div>
    `;
    const wheel = $('#wheel-disc');
    if (wheel) wheel.style.background = wheelGradient(options.length);
  }

  function animateDice(rolls, winnerIndex, done) {
    const units = $$('#dice-stage .dice-unit');
    const diceList = units.map((unit) => unit.querySelector('.dice3d')).filter(Boolean);
    const duration = animDuration(820);
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      if ($('#progress-bar')) $('#progress-bar').style.width = `${progress * 100}%`;

      diceList.forEach((dice, index) => {
        if (progress < 0.82) {
          const spin = elapsed * (1.3 + index * 0.08);
          setDiceRaw(dice, spin, spin * 1.35);
        } else {
          setDice(dice, rolls[index]);
        }
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        units.forEach((unit, index) => {
          unit.classList.toggle('winner', winnerIndex === index);
          unit.classList.toggle('loser', winnerIndex >= 0 && winnerIndex !== index);
        });
        setTimeout(done, 260);
      }
    }

    requestAnimationFrame(tick);
  }

  function animateCoin(winnerIndex, done) {
    const coin = $('#coin3d');
    const duration = animDuration(900);
    const start = performance.now();
    const finalY = 360 * 5 + (winnerIndex === 1 ? 180 : 0);

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      if ($('#progress-bar')) $('#progress-bar').style.width = `${progress * 100}%`;
      if (coin) {
        const wobble = Math.sin(progress * Math.PI * 8) * (1 - progress) * 16;
        coin.style.transform = `rotateY(${finalY * eased}deg) rotateX(${wobble}deg)`;
      }
      if (progress < 1) requestAnimationFrame(tick);
      else setTimeout(done, 220);
    }

    requestAnimationFrame(tick);
  }

  function animateWheel(finalRotation, done) {
    const wheel = $('#wheel-disc');
    const duration = animDuration(1100);
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      if ($('#progress-bar')) $('#progress-bar').style.width = `${progress * 100}%`;
      if (wheel) wheel.style.transform = `rotate(${finalRotation * eased}deg)`;
      if (progress < 1) requestAnimationFrame(tick);
      else setTimeout(done, 220);
    }

    requestAnimationFrame(tick);
  }

  function renderResult(result) {
    $('#battle-section')?.classList.add('hidden');
    $('#result-section')?.classList.remove('hidden');
    document.body.classList.add('result-mode');

    setText('#result-winner', result.isTie ? t('tie_title') : result.winner);

    const visual = $('#result-dice-visual');
    if (!visual) return;
    visual.innerHTML = '';
    visual.className = `result-dice-visual result-${result.mode || 'dice'}-visual`;

    if (result.mode === 'coin') renderCoinVisual(visual, result);
    else if (result.mode === 'wheel') renderWheelVisual(visual, result);
    else if (result.mode === 'slot') renderSlotVisual(visual, result);
    else renderDiceVisual(visual, result);

    spawnConfetti();
  }

  function renderDiceVisual(visual, result) {
    const rolls = Array.isArray(result.rolls) ? result.rolls : [];
    result.options.forEach((option, index) => {
      const chip = document.createElement('div');
      chip.className = 'score-chip';
      if (index === result.winnerIndex) chip.classList.add('win');
      chip.innerHTML = `
        <div class="score-number">${rolls[index] || '-'}</div>
        <div class="score-label">${escapeHtml(option)}</div>
      `;
      visual.appendChild(chip);
    });
  }

  function renderCoinVisual(visual, result) {
    result.options.forEach((option, index) => {
      const chip = document.createElement('div');
      chip.className = 'score-chip';
      if (index === result.winnerIndex) chip.classList.add('win');
      chip.innerHTML = `
        <div class="score-number">${coinSideLabel(index)}</div>
        <div class="score-label">${escapeHtml(option)}</div>
      `;
      visual.appendChild(chip);
    });
  }

  function renderWheelVisual(visual, result) {
    result.options.forEach((option, index) => {
      const chip = document.createElement('div');
      chip.className = 'score-chip';
      if (index === result.winnerIndex) chip.classList.add('win');
      chip.style.setProperty('--chip-color', wheelColor(index));
      chip.innerHTML = `
        <div class="score-number">${String.fromCharCode(65 + index)}</div>
        <div class="score-label">${escapeHtml(option)}</div>
      `;
      visual.appendChild(chip);
    });
  }

  function renderSlotVisual(visual, result) {
    result.options.forEach((option, index) => {
      const chip = document.createElement('div');
      chip.className = 'score-chip';
      if (index === result.winnerIndex) chip.classList.add('win');
      chip.innerHTML = `
        <div class="score-number">
          <span class="slot-num">${index + 1}</span>
        </div>
        <div class="score-label">${escapeHtml(option)}</div>
      `;
      visual.appendChild(chip);
    });
  }

  function resetToInput() {
    $('#result-section')?.classList.add('hidden');
    $('#battle-section')?.classList.add('hidden');
    $('#input-section')?.classList.remove('hidden');
    document.body.classList.remove('result-mode');
    applyModeUI();
    clearResultState();
  }

  function saveHistory(result) {
    history.unshift(result);
    history = history.slice(0, MAX_HISTORY);
    chrome.storage.local.set({ [STORAGE.history]: history });
  }

  function renderHistory() {
    const list = $('#history-list');
    if (!list) return;
    if (incognito) {
      list.innerHTML = `<div class="empty-state">${t('history_incognito')}</div>`;
      if ($('#btn-clear-history')) $('#btn-clear-history').style.display = 'none';
      return;
    }
    if ($('#btn-clear-history')) $('#btn-clear-history').style.display = '';
    if (!history.length) {
      list.innerHTML = `<div class="empty-state">${t('history_empty')}</div>`;
      return;
    }

    list.innerHTML = '';
    history.slice(0, 20).forEach((record) => {
      const item = document.createElement('div');
      item.className = 'history-item';
      const recordMode = record.mode || 'dice';
      const title = record.isTie ? t('tie_title') : record.winner;
      const detail = historyDetail(record);
      item.innerHTML = `
        <div class="history-title">${modeIcon(recordMode)} ${escapeHtml(title)}</div>
        <div class="history-detail">${escapeHtml(detail)}</div>
        <div class="history-meta">${formatTime(record.createdAt)}</div>
      `;
      item.addEventListener('click', () => {
        showConfirm(t('load_history')).then((ok) => {
          if (!ok) return;
          loadHistoryRecord(record);
        });
      });
      list.appendChild(item);
    });
  }

  function historyDetail(record) {
    if ((record.mode || 'dice') === 'dice') {
      const rolls = Array.isArray(record.rolls) ? record.rolls : [];
      return record.options.map((option, index) => `${option} ${rolls[index] || '-'}`).join(' / ');
    }
    if (record.mode === 'coin') return record.options.join(' / ');
    if (record.mode === 'slot') return record.options.map((option, index) => `${index + 1}. ${option}`).join(' / ');
    return record.options.map((option, index) => `${String.fromCharCode(65 + index)} ${option}`).join(' / ');
  }

  function loadHistoryRecord(record) {
    const list = $('#options-list');
    if (!list) return;
    list.innerHTML = '';
    optionCount = 0;
    (record.options || []).slice(0, MAX_OPTIONS).forEach((option) => addRow(option));
    while (optionCount < 2) addRow('');
    mode = MODES.includes(record.mode) ? record.mode : 'dice';
    applyModeUI();
    renderSettings();
    closePanels();
    resetToInput();
    saveSettings();
    saveStateDebounced();
  }

  function clearHistory() {
    showConfirm(t('confirm_clear')).then((ok) => {
      if (!ok) return;
      history = [];
      chrome.storage.local.set({ [STORAGE.history]: [] }, renderHistory);
    });
  }

  function openHistoryPanel() {
    renderHistory();
    $('#history-panel')?.classList.remove('hidden');
    $('#panel-overlay')?.classList.remove('hidden');
  }

  function openSettingsPanel() {
    renderSettings();
    $('#settings-panel')?.classList.remove('hidden');
    $('#panel-overlay')?.classList.remove('hidden');
  }

  function closePanels() {
    $('#history-panel')?.classList.add('hidden');
    $('#settings-panel')?.classList.add('hidden');
    $('#panel-overlay')?.classList.add('hidden');
  }

  function renderSettings() {
    $$('#set-mode .seg-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.value === mode);
    });
    $$('#set-lang .seg-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.value === lang);
    });
    $$('#set-speed .seg-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.value === animSpeed);
    });
    $('#set-theme')?.classList.toggle('on', theme === 'dark');
    $('#set-incognito')?.classList.toggle('on', incognito);
  }

  function loadSettings(done) {
    chrome.storage.local.get([STORAGE.settings, STORAGE.history], (result) => {
      const settings = result[STORAGE.settings] || {};
      lang = settings.lang || 'zh';
      theme = settings.theme || 'light';
      mode = MODES.includes(settings.mode) ? settings.mode : 'dice';
      incognito = Boolean(settings.incognito);
      animSpeed = settings.animSpeed || 'normal';
      history = Array.isArray(result[STORAGE.history]) ? result[STORAGE.history] : [];
      done();
    });
  }

  function saveSettings() {
    chrome.storage.local.set({
      [STORAGE.settings]: { lang, theme, mode, rule: RULE, incognito, animSpeed }
    });
  }

  function getState() {
    return {
      mode,
      options: $$('.option-input').map((input) => input.value),
      lastResult,
      savedAt: Date.now()
    };
  }

  function saveState() {
    chrome.storage.local.set({ [STORAGE.state]: getState() });
  }

  function saveStateDebounced() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveState, 160);
  }

  function saveResultState(result) {
    lastResult = result;
    saveState();
  }

  function clearResultState() {
    lastResult = null;
    saveState();
  }

  function restoreState() {
    chrome.storage.local.get([STORAGE.state], (result) => {
      const state = result[STORAGE.state];
      if (state && MODES.includes(state.mode)) mode = state.mode;
      if (state && Array.isArray(state.options) && state.options.length >= 2) {
        const list = $('#options-list');
        if (list) list.innerHTML = '';
        optionCount = 0;
        state.options.slice(0, MAX_OPTIONS).forEach((option) => addRow(String(option || '')));
      }
      if (state && state.lastResult && Array.isArray(state.lastResult.options)) {
        lastResult = state.lastResult;
      }
      while (optionCount < 2) addRow('');
      applyModeUI();
      renderSettings();
    });
  }

  function exportAsImage() {
    if (!lastResult) return;
    const width = 440;
    const height = 300;
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    const isDark = theme === 'dark';
    const bg = isDark ? '#1A1825' : '#FAFBFF';
    const card = isDark ? '#242135' : '#FFFFFF';
    const sub = isDark ? '#ABA4C9' : '#736D90';
    const accent = '#7C6FBE';
    const pink = '#E88BA8';
    const modeName = t(`mode_${lastResult.mode || 'dice'}`);

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    roundRect(ctx, 22, 20, width - 44, height - 40, 18, card);

    const gradient = ctx.createLinearGradient(50, 0, width - 50, 0);
    gradient.addColorStop(0, accent);
    gradient.addColorStop(1, pink);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(46, 42);
    ctx.lineTo(width - 46, 42);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = accent;
    ctx.font = '800 16px Segoe UI, sans-serif';
    ctx.fillText(`LuckyPick - ${modeName}`, width / 2, 72);

    ctx.fillStyle = pink;
    ctx.font = '900 30px Segoe UI, sans-serif';
    ctx.fillText(lastResult.isTie ? t('tie_title') : lastResult.winner, width / 2, 122);

    ctx.fillStyle = sub;
    ctx.font = '500 14px Segoe UI, sans-serif';
    ctx.fillText(lastResult.isTie ? t('tie_msg') : randomItem(t(`result_msgs_${lastResult.mode || 'dice'}`)), width / 2, 148);

    drawExportChips(ctx, lastResult, isDark, accent, pink, sub, width);

    ctx.fillStyle = sub;
    ctx.font = '600 12px Segoe UI, sans-serif';
    ctx.fillText(exportFooter(lastResult), width / 2, 260);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `luckypick-${lastResult.mode || 'dice'}-${fileDate()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(t('exported'));
    }, 'image/png');
  }

  function drawExportChips(ctx, result, isDark, accent, pink, sub, width) {
    const chipWidth = Math.min(92, Math.floor((width - 96) / result.options.length));
    const startX = (width - chipWidth * result.options.length - 8 * (result.options.length - 1)) / 2;
    result.options.forEach((option, index) => {
      const x = startX + index * (chipWidth + 8);
      const y = 176;
      const isWin = index === result.winnerIndex;
      const isWheel = result.mode === 'wheel';
      const chipFill = isWheel ? wheelColor(index) : (isWin ? '#FFF0F6' : (isDark ? '#2B2840' : '#F5F4FA'));
      roundRect(ctx, x, y, chipWidth, 56, 12, chipFill);
      ctx.fillStyle = isWheel ? '#FFFFFF' : (isWin ? pink : accent);
      ctx.font = '900 22px Segoe UI, sans-serif';
      ctx.fillText(exportChipText(result, index), x + chipWidth / 2, y + 25);
      ctx.fillStyle = isWheel ? 'rgba(255,255,255,.88)' : sub;
      ctx.font = '700 10px Segoe UI, sans-serif';
      ctx.fillText(trimText(ctx, option, chipWidth - 10), x + chipWidth / 2, y + 43);
    });
  }

  function exportChipText(result, index) {
    if ((result.mode || 'dice') === 'dice') return String((result.rolls || [])[index] || '-');
    if (result.mode === 'coin') return coinSideLabel(index);
    if (result.mode === 'slot') return String(index + 1);
    return String.fromCharCode(65 + index);
  }

  function coinSideLabel(index) {
    return index === 0 ? t('coin_heads') : t('coin_tails');
  }

  function exportFooter(result) {
    if ((result.mode || 'dice') === 'dice') return t('rule_export_high');
    if (result.mode === 'slot') return t('mode_slot');
    return t(`mode_${result.mode}`);
  }

  function wheelGradient(count) {
    const step = 360 / count;
    const parts = [];
    for (let i = 0; i < count; i += 1) {
      const start = i * step;
      const end = (i + 1) * step;
      parts.push(`${wheelColor(i)} ${start}deg ${end}deg`);
    }
    return `conic-gradient(from 0deg, ${parts.join(', ')})`;
  }

  function wheelColor(index) {
    return WHEEL_COLORS[index % WHEEL_COLORS.length];
  }

  function roundRect(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function trimText(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let output = text;
    while (output.length > 1 && ctx.measureText(`${output}...`).width > maxWidth) {
      output = output.slice(0, -1);
    }
    return `${output}...`;
  }

  function fileDate() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
  }

  function spawnConfetti() {
    const container = $('#confetti-container');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#E88BA8', '#7C6FBE', '#6BAFE0', '#7BC89E', '#E8BA7A'];
    for (let i = 0; i < 18; i += 1) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.22}s`;
      piece.style.animationDuration = `${0.65 + Math.random() * 0.55}s`;
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
    }
    setTimeout(() => { container.innerHTML = ''; }, 1500);
  }

  function showConfirm(message) {
    return new Promise((resolve) => {
      setText('#confirm-msg', message);
      $('#confirm-overlay')?.classList.remove('hidden');
      $('#confirm-dialog')?.classList.remove('hidden');
      const finish = (ok) => {
        $('#confirm-overlay')?.classList.add('hidden');
        $('#confirm-dialog')?.classList.add('hidden');
        resolve(ok);
      };
      const okButton = $('#confirm-ok');
      const cancelButton = $('#confirm-cancel');
      const overlay = $('#confirm-overlay');
      if (okButton) okButton.onclick = () => finish(true);
      if (cancelButton) cancelButton.onclick = () => finish(false);
      if (overlay) overlay.onclick = () => finish(false);
    });
  }

  function showToast(message) {
    const old = $('.toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  }

  function animDuration(ms) {
    return Math.round(ms * (SPEED[animSpeed] || 1));
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function modeIcon(value) {
    if (value === 'coin') return '\uD83E\uDE99';
    if (value === 'wheel') return '\uD83C\uDFA1';
    if (value === 'slot') return '\uD83C\uDFB0';
    return '\uD83C\uDFB2';
  }

  function formatTime(value) {
    const d = new Date(value);
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
