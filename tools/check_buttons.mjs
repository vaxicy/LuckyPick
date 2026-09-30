// 校验结果页按钮文本在各语言（含 4 按钮场景）是否被省略号截断
// 用法：node tools/check_buttons.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png' };

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
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.LP_CHROME || 'C:/Users/16704/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
});

const OPTIONS = {
  zh: ['火锅', '寿司', '沙拉', '烧烤'],
  en: ['Pizza', 'Sushi', 'Salad', 'BBQ'],
  es: ['Pizza', 'Sushi', 'Ensalada', 'Parrilla'],
  fr: ['Pizza', 'Sushi', 'Salade', 'Barbecue'],
  ru: ['Пицца', 'Суши', 'Салат', 'Шашлык']
};

let problems = 0;

for (const lang of ['zh', 'en', 'es', 'fr', 'ru']) {
  const context = await browser.newContext({ viewport: { width: 320, height: 620 } });
  await context.addInitScript((data) => {
    window.chrome = {
      storage: {
        local: {
          get: (keys, cb) => {
            const out = {};
            (Array.isArray(keys) ? keys : [keys]).forEach((k) => { if (k in data.store) out[k] = data.store[k]; });
            setTimeout(() => cb(out), 0);
          },
          set: (obj, cb) => { Object.assign(data.store, obj); if (cb) cb(); }
        },
        onChanged: { addListener() {} }
      },
      i18n: { getUILanguage: () => data.lang },
      runtime: { getURL: (p) => p, lastError: null },
      tabs: { create() {} }
    };
  }, { lang, store: { luckypick_settings: { lang, theme: 'light', mode: 'dice', soundEnabled: false, animSpeed: 'fast', onboarded: true } } });

  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${port}/popup.html`, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const options = OPTIONS[lang];
  for (let i = 0; i < options.length; i += 1) {
    if (i >= 2) await page.click('#btn-add-option');
    await page.fill(`.option-input >> nth=${i}`, options[i]);
  }
  await page.waitForTimeout(200);

  let rows = [];
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await page.click('#btn-roll');
    await page.waitForFunction(() => !document.querySelector('#result-section').classList.contains('hidden'), null, { timeout: 15000 });
    await page.waitForTimeout(250);
    rows = await page.evaluate(() => Array.from(document.querySelectorAll('.result-actions .action-btn'))
      .filter((b) => !b.classList.contains('hidden'))
      .map((b) => ({ text: b.textContent.trim(), clipped: b.scrollWidth > b.clientWidth + 1, client: b.clientWidth, scroll: b.scrollWidth })));
    if (rows.length >= 4) break;
    await page.click('#btn-again');
    await page.waitForTimeout(300);
  }

  const clipped = rows.filter((r) => r.clipped);
  problems += clipped.length;
  console.log(`${lang}: ${rows.length} buttons ->`, rows.map((r) => `${r.text}${r.clipped ? ' [CLIPPED]' : ''}`).join(' | ') || '(none)');
  await context.close();
}

await browser.close();
server.close();
console.log(problems ? `BUTTON TEXT CLIPPED: ${problems}` : 'all button labels fit');
