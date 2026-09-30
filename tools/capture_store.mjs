// 商店素材源图捕获：起本地服务 + 无头 Chromium，按语言输出真实界面截图
// 用法：node tools/capture_store.mjs [lang]   默认 fr
// 输出：store-assets/source-captures/<lang>/capture-*.png（640 宽，2x 缩放）
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const lang = (process.argv[2] || 'fr').toLowerCase();
const outDir = path.join(root, 'store-assets', 'source-captures', lang);
fs.mkdirSync(outDir, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(root, url === '/' ? 'popup.html' : url.replace(/^\//, ''));
  if (!file.startsWith(root) || !fs.existsSync(file)) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

const pw = await import('file:///C:/Users/16704/pw/node_modules/playwright-core/index.js');
const chromium = pw.chromium || (pw.default && pw.default.chromium);
const EXECUTABLE = process.env.LP_CHROME ||
  'C:/Users/16704/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';

const browser = await chromium.launch({ headless: true, executablePath: EXECUTABLE });
const context = await browser.newContext({ viewport: { width: 320, height: 620 }, deviceScaleFactor: 2 });

const now = Date.now();
// 各语言的示例选项（中文用中文，俄语用西里尔，其余用拉丁）
const OPTIONS = {
  zh: ['火锅', '寿司'],
  en: ['Pizza', 'Sushi'],
  es: ['Pizza', 'Sushi'],
  fr: ['Pizza', 'Sushi'],
  ru: ['Пицца', 'Суши']
};
const [optionA, optionB] = OPTIONS[lang] || ['Pizza', 'Sushi'];
const store = {
  luckypick_settings: {
    lang, theme: 'light', mode: 'dice', incognito: false,
    soundEnabled: false, animSpeed: 'fast', onboarded: true
  },
  luckypick_history: [
    { mode: 'dice', winner: optionA, options: [optionA, optionB], rolls: [5, 2], winnerIndex: 0, isTie: false, createdAt: now - 120000 },
    { mode: 'coin', winner: optionB, options: [optionA, optionB], winnerIndex: 1, isTie: false, createdAt: now - 600000 }
  ]
};

await context.addInitScript((data) => {
  window.chrome = {
    storage: {
      local: {
        get: (keys, cb) => {
          const out = {};
          (Array.isArray(keys) ? keys : [keys]).forEach((k) => { if (k in data) out[k] = data[k]; });
          setTimeout(() => cb(out), 0);
        },
        set: (obj, cb) => { Object.assign(data, obj); if (cb) cb(); },
        remove: (keys, cb) => { if (cb) cb(); }
      },
      onChanged: { addListener() {} }
    },
    i18n: { getUILanguage: () => lang },
    runtime: { getURL: (p) => p, lastError: null },
    tabs: { create() {} }
  };
}, store);

const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));

await page.goto(`http://127.0.0.1:${port}/popup.html`, { waitUntil: 'load' });
await page.waitForTimeout(600);

async function shoot(name, withPanel = false) {
  const height = await page.evaluate((panelMode) => {
    const body = document.body;
    let h = Math.max(body.scrollHeight, Math.ceil(body.getBoundingClientRect().height));
    const panel = document.querySelector('.panel:not(.hidden)');
    if (panelMode && panel) h = Math.max(h, panel.getBoundingClientRect().bottom + 12);
    return Math.ceil(h);
  }, withPanel);
  await page.screenshot({
    path: path.join(outDir, `${name}.png`),
    clip: { x: 0, y: 0, width: 320, height }
  });
  console.log('  saved', name, `(320x${height})`);
}

const resultVisible = () => page.waitForFunction(
  () => !document.querySelector('#result-section').classList.contains('hidden'),
  null, { timeout: 15000 }
);

async function pickMode(value) {
  await page.click('#btn-settings');
  await page.waitForTimeout(350);
  await page.click(`#set-mode .seg-btn[data-value="${value}"]`);
  await page.waitForTimeout(350);
}

await page.fill('.option-input >> nth=0', optionA);
await page.fill('.option-input >> nth=1', optionB);
await page.waitForTimeout(200);

// 1) 主界面
await shoot('capture-main');

// 2) 骰子结果
await page.click('#btn-roll');
await resultVisible();
await page.waitForTimeout(400);
await shoot('capture-dice');

// 3) 硬币结果
await page.click('#btn-again');
await page.waitForTimeout(300);
await pickMode('coin');
await page.click('#btn-roll');
await resultVisible();
await page.waitForTimeout(400);
await shoot('capture-coin');

// 4) 转盘结果
await page.click('#btn-again');
await page.waitForTimeout(300);
await pickMode('wheel');
await page.click('#btn-roll');
await resultVisible();
await page.waitForTimeout(400);
await shoot('capture-wheel');

// 5) 猜拳输入态
await page.click('#btn-again');
await page.waitForTimeout(300);
await pickMode('rps');
await page.waitForTimeout(300);
await shoot('capture-rps-input');

// 6) 猜拳出拳阶段
await page.click('#btn-roll');
await page.waitForSelector('#rps-choices .rps-choice', { state: 'visible' });
await page.waitForTimeout(350);
await shoot('capture-rps-battle');

// 7) 猜拳结果（平局会自动回到出拳阶段，需重试）
for (let attempt = 0; attempt < 6; attempt += 1) {
  await page.click('#rps-choices .rps-choice >> nth=0');
  await page.waitForTimeout(1800);
  const done = await page.evaluate(() => !document.querySelector('#result-section').classList.contains('hidden'));
  if (done) break;
  await page.waitForSelector('#rps-choices .rps-choice', { state: 'visible' });
}
await page.waitForTimeout(300);
await shoot('capture-rps-result');

// 8) 设置面板
await page.click('#btn-again');
await page.waitForTimeout(300);
await page.click('#btn-settings');
await page.waitForTimeout(500);
await shoot('capture-settings', true);

await browser.close();
server.close();

console.log(errors.length ? 'page errors:\n' + errors.join('\n') : 'no page errors');
