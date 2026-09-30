// 界面验证：本地静态服务 + 无头 Chromium，截图核对结果页配色、tooltip、历史统计条
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const outDir = path.join(root, 'store-assets', 'source-captures', 'verify');
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
// 复用已缓存的浏览器内核（版本号与 playwright-core 期望值不一致，故显式指定）
const EXECUTABLE = process.env.LP_CHROME ||
  'C:/Users/16704/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const browser = await chromium.launch({ headless: true, executablePath: EXECUTABLE });
const context = await browser.newContext({ viewport: { width: 320, height: 620 }, deviceScaleFactor: 2 });

const now = Date.now();
const mockStore = {
  luckypick_settings: {
    lang: 'zh', theme: 'light', mode: 'dice', incognito: false,
    soundEnabled: false, animSpeed: 'fast', onboarded: true
  },
  luckypick_history: [
    { mode: 'dice', winner: '火锅', options: ['火锅', '寿司'], rolls: [5, 2], winnerIndex: 0, isTie: false, createdAt: now - 60000 },
    { mode: 'coin', winner: '寿司', options: ['火锅', '寿司'], winnerIndex: 1, isTie: false, createdAt: now - 300000 },
    { mode: 'dice', winner: '火锅', options: ['火锅', '烧烤'], rolls: [6, 1], winnerIndex: 0, isTie: false, createdAt: now - 900000 }
  ]
};

await context.addInitScript((store) => {
  window.chrome = {
    storage: {
      local: {
        get: (keys, cb) => {
          const out = {};
          (Array.isArray(keys) ? keys : [keys]).forEach((k) => { if (k in store) out[k] = store[k]; });
          setTimeout(() => cb(out), 0);
        },
        set: (obj, cb) => { Object.assign(store, obj); if (cb) cb(); },
        remove: (keys, cb) => { if (cb) cb(); }
      },
      onChanged: { addListener() {} }
    },
    i18n: { getUILanguage: () => 'zh-CN' },
    runtime: { getURL: (p) => p, lastError: null },
    tabs: { create() {} }
  };
}, mockStore);

const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto(`http://127.0.0.1:${port}/popup.html`, { waitUntil: 'load' });
await page.waitForTimeout(600);

const shots = [];
async function shoot(name, clipHeight) {
  const file = path.join(outDir, `${name}.png`);
  const box = await page.evaluate(() => {
    const body = document.body;
    const panel = document.querySelector('.panel:not(.hidden)');
    let height = Math.max(body.scrollHeight, body.getBoundingClientRect().height);
    if (panel) height = Math.max(height, panel.getBoundingClientRect().bottom + 12);
    return { width: 320, height: Math.ceil(height) };
  });
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 320, height: clipHeight || box.height } });
  shots.push(file);
}

// 1) 主界面 + 权重 tooltip（应出现在按钮左侧）
await page.fill('.option-input >> nth=0', '火锅');
await page.fill('.option-input >> nth=1', '寿司');
await page.hover('.weight-btn >> nth=0');
await page.waitForTimeout(400);
await shoot('01-main-tooltip');

// 2) 历史面板（应显示统计条）
await page.click('#btn-history');
await page.waitForTimeout(500);
await shoot('02-history-stats');
await page.click('#btn-close-history');
await page.waitForTimeout(300);

// 3) 结果页 - 骰子（紫粉强调色）
await page.click('#btn-roll');
await page.waitForTimeout(2600);
await shoot('03-result-dice');

// 4) 结果页 - 硬币（金色强调色）
await page.click('#btn-again');
await page.waitForTimeout(400);
await page.click('#btn-settings');
await page.waitForTimeout(400);
await page.click('#set-mode .seg-btn[data-value="coin"]');
await page.waitForTimeout(400);
await page.click('#btn-roll');
await page.waitForTimeout(2600);
await shoot('04-result-coin');
const coinColors = await page.evaluate(() => {
  const section = document.querySelector('#result-section');
  const style = getComputedStyle(section);
  return {
    mode: section.dataset.mode,
    rc1: style.getPropertyValue('--rc-1').trim(),
    rc2: style.getPropertyValue('--rc-2').trim(),
    chips: Array.from(document.querySelectorAll('.score-number')).map((n) => getComputedStyle(n).color)
  };
});
console.log('coin result colors:', JSON.stringify(coinColors));

// 5) 深色模式结果页（校验按模式换色在深色下的可读性）
const darkContext = await browser.newContext({ viewport: { width: 320, height: 620 }, deviceScaleFactor: 2 });
const darkStore = JSON.parse(JSON.stringify(mockStore));
darkStore.luckypick_settings.theme = 'dark';
darkStore.luckypick_settings.mode = 'wheel';
await darkContext.addInitScript((store) => {
  window.chrome = {
    storage: {
      local: {
        get: (keys, cb) => {
          const out = {};
          (Array.isArray(keys) ? keys : [keys]).forEach((k) => { if (k in store) out[k] = store[k]; });
          setTimeout(() => cb(out), 0);
        },
        set: (obj, cb) => { Object.assign(store, obj); if (cb) cb(); },
        remove: (keys, cb) => { if (cb) cb(); }
      },
      onChanged: { addListener() {} }
    },
    i18n: { getUILanguage: () => 'zh-CN' },
    runtime: { getURL: (p) => p, lastError: null },
    tabs: { create() {} }
  };
}, darkStore);
const darkPage = await darkContext.newPage();
await darkPage.goto(`http://127.0.0.1:${port}/popup.html`, { waitUntil: 'load' });
await darkPage.waitForTimeout(500);
await darkPage.fill('.option-input >> nth=0', '火锅');
await darkPage.fill('.option-input >> nth=1', '寿司');
const darkHeight = await darkPage.evaluate(() => Math.ceil(document.body.getBoundingClientRect().height) + 40);
await darkPage.click('#btn-roll');
await darkPage.waitForTimeout(2600);
const darkFile = path.join(outDir, '05-result-wheel-dark.png');
await darkPage.screenshot({ path: darkFile, clip: { x: 0, y: 0, width: 320, height: darkHeight } });
shots.push(darkFile);

await browser.close();
server.close();

console.log('shots:');
shots.forEach((s) => console.log(' -', s));
console.log(errors.length ? 'page errors:\n' + errors.join('\n') : 'no page errors');
