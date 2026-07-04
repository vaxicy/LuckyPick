(function () {
  'use strict';

  const I18N = {
    zh: {
      app_name: '\u522B\u7EA0\u7ED3\u4E86',
      roll_btn: '\uD83C\uDFB2 \u6447\u9AB0\u51B3\u5B9A',
      battle_title: '\u6447\u9AB0\u4E2D...',
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
      tie_title: '\u5E73\u5C40\u4E86',
      tie_msg: '\u518D\u6447\u4E00\u6B21\u5427',
      result_msgs: ['\u547D\u8FD0\u7684\u5C0F\u9AB0\u5B50\u70B9\u5934\u4E86', '\u522B\u7EA0\u7ED3\uFF0C\u5C31\u662F\u5B83', '\u597D\u8FD0\u7AD9\u5728\u5B83\u8FD9\u8FB9', '\u9AB0\u5B50\u5DF2\u7ECF\u66FF\u4F60\u51B3\u5B9A\u5566'],
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
      roll_btn: '\uD83C\uDFB2 Roll dice',
      battle_title: 'Rolling...',
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
      tie_title: 'It is a tie',
      tie_msg: 'Roll again',
      result_msgs: ['The dice have spoken', 'No more overthinking', 'Luck picked this one', 'Tiny fate approves'],
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
  const STORAGE = {
    settings: 'luckypick_settings',
    history: 'luckypick_history',
    state: 'luckypick_state'
  };

  let lang = 'zh';
  let theme = 'light';
  let incognito = false;
  let animSpeed = 'normal';
  let history = [];
  let optionCount = 2;
  let isRolling = false;
  let lastResult = null;
  let saveTimer = null;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const has = (selector) => Boolean($(selector));

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
    });
  }

  function bindEvents() {
    on('#btn-add-option', 'click', () => {
      if (optionCount >= MAX_OPTIONS) {
        showToast(t('max_options'));
        return;
      }
      addRow('');
      saveStateDebounced();
    });
    on('#btn-roll', 'click', doRoll);
    on('#btn-again', 'click', resetToInput);
    on('#btn-export', 'click', exportAsImage);
    on('#btn-history', 'click', openHistoryPanel);
    on('#btn-settings', 'click', openSettingsPanel);
    on('#btn-close-history', 'click', closePanels);
    on('#btn-close-settings', 'click', closePanels);
    on('#panel-overlay', 'click', closePanels);
    on('#btn-clear-history', 'click', clearHistory);

    $$('#set-lang .seg-btn').forEach((button) => {
      button.addEventListener('click', () => {
        lang = button.dataset.value;
        applyI18n();
        renderSettings();
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
      if (event.key === 'Enter') doRoll();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.ctrlKey && !isRolling) doRoll();
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
      if (optionCount <= 2) return;
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
      if (button) button.style.visibility = optionCount > 2 ? 'visible' : 'hidden';
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

  function getOptions() {
    return $$('.option-input').map((input) => input.value.trim()).filter(Boolean);
  }

  function doRoll() {
    if (isRolling) return;
    const options = getOptions();
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
    setText('#battle-section .battle-title', t('battle_title'));
    if ($('#progress-bar')) $('#progress-bar').style.width = '0%';

    const rolls = options.map(() => Math.floor(Math.random() * 6) + 1);
    const winners = getWinners(rolls);
    const winnerIndex = winners.length === 1 ? winners[0] : -1;
    const result = {
      id: Date.now(),
      options,
      rolls,
      winnerIndex,
      winner: winnerIndex >= 0 ? options[winnerIndex] : null,
      rule: RULE,
      isTie: winnerIndex < 0,
      createdAt: new Date().toISOString()
    };

    buildBattleStage(options);
    animateRoll(rolls, winnerIndex, () => {
      isRolling = false;
      $('#btn-roll')?.classList.remove('rolling');
      lastResult = result;
      renderResult(result);
      saveResultState(result);
      if (!incognito) saveHistory(result);
    });
  }

  function getWinners(rolls) {
    const target = Math.max(...rolls);
    return rolls.map((value, index) => (value === target ? index : -1)).filter((index) => index >= 0);
  }

  function buildBattleStage(options) {
    const stage = $('#dice-stage');
    if (!stage) return;
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

  function animateRoll(rolls, winnerIndex, done) {
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
        setTimeout(done, 300);
      }
    }

    requestAnimationFrame(tick);
  }

  function renderResult(result) {
    $('#battle-section')?.classList.add('hidden');
    $('#result-section')?.classList.remove('hidden');
    document.body.classList.add('result-mode');

    setText('#result-winner', result.isTie ? t('tie_title') : result.winner);
    setText('#result-msg', result.isTie ? t('tie_msg') : randomItem(t('result_msgs')));

    const visual = $('#result-dice-visual');
    if (!visual) return;
    visual.innerHTML = '';
    result.options.forEach((option, index) => {
      const chip = document.createElement('div');
      chip.className = 'score-chip';
      if (index === result.winnerIndex) chip.classList.add('win');
      chip.innerHTML = `
        <div class="score-number">${result.rolls[index]}</div>
        <div class="score-label">${escapeHtml(option)}</div>
      `;
      visual.appendChild(chip);
    });

    spawnConfetti();
  }

  function resetToInput() {
    $('#result-section')?.classList.add('hidden');
    $('#battle-section')?.classList.add('hidden');
    $('#input-section')?.classList.remove('hidden');
    document.body.classList.remove('result-mode');
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
      const title = record.isTie ? t('tie_title') : record.winner;
      const detail = record.options.map((option, index) => `${option} ${record.rolls[index]}`).join(' / ');
      item.innerHTML = `
        <div class="history-title">&#127922; ${escapeHtml(title)}</div>
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

  function loadHistoryRecord(record) {
    const list = $('#options-list');
    if (!list) return;
    list.innerHTML = '';
    optionCount = 0;
    record.options.forEach((option) => addRow(option));
    closePanels();
    resetToInput();
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
      incognito = Boolean(settings.incognito);
      animSpeed = settings.animSpeed || 'normal';
      history = Array.isArray(result[STORAGE.history]) ? result[STORAGE.history] : [];
      done();
    });
  }

  function saveSettings() {
    chrome.storage.local.set({
      [STORAGE.settings]: { lang, theme, rule: RULE, incognito, animSpeed }
    });
  }

  function getState() {
    return {
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
      if (state && Array.isArray(state.options) && state.options.length >= 2) {
        const list = $('#options-list');
        if (list) list.innerHTML = '';
        optionCount = 0;
        state.options.slice(0, MAX_OPTIONS).forEach((option) => addRow(String(option || '')));
      }
      if (state && state.lastResult && Array.isArray(state.lastResult.options)) {
        lastResult = state.lastResult;
      }
      reindexRows();
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
    ctx.fillText('\uD83C\uDFB2 LuckyPick', width / 2, 72);

    ctx.fillStyle = pink;
    ctx.font = '900 30px Segoe UI, sans-serif';
    ctx.fillText(lastResult.isTie ? t('tie_title') : lastResult.winner, width / 2, 122);

    ctx.fillStyle = sub;
    ctx.font = '500 14px Segoe UI, sans-serif';
    ctx.fillText(lastResult.isTie ? t('tie_msg') : randomItem(t('result_msgs')), width / 2, 148);

    const chipWidth = Math.min(92, Math.floor((width - 96) / lastResult.options.length));
    const startX = (width - chipWidth * lastResult.options.length - 8 * (lastResult.options.length - 1)) / 2;
    lastResult.options.forEach((option, index) => {
      const x = startX + index * (chipWidth + 8);
      const y = 176;
      roundRect(ctx, x, y, chipWidth, 56, 12, index === lastResult.winnerIndex ? '#FFF0F6' : (isDark ? '#2B2840' : '#F5F4FA'));
      ctx.fillStyle = index === lastResult.winnerIndex ? pink : accent;
      ctx.font = '900 22px Segoe UI, sans-serif';
      ctx.fillText(String(lastResult.rolls[index]), x + chipWidth / 2, y + 25);
      ctx.fillStyle = sub;
      ctx.font = '700 10px Segoe UI, sans-serif';
      ctx.fillText(trimText(ctx, option, chipWidth - 10), x + chipWidth / 2, y + 43);
    });

    ctx.fillStyle = sub;
    ctx.font = '600 12px Segoe UI, sans-serif';
    ctx.fillText(t('rule_export_high'), width / 2, 260);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `luckypick-dice-${fileDate()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(t('exported'));
    }, 'image/png');
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

  function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
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
