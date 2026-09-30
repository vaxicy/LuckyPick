// 校验代码中静态引用的 i18n 键是否都存在于字典（临时校验脚本）
import { readFileSync } from 'node:fs';
import { I18N } from '../js/i18n.js';

const files = ['../popup.js', '../popup.html', '../background.js'];
const known = new Set(Object.keys(I18N.zh));
const used = new Set();

for (const file of files) {
  let text = '';
  try {
    text = readFileSync(new URL(file, import.meta.url), 'utf8');
  } catch (error) {
    continue;
  }
  for (const match of text.matchAll(/\bt\(\s*'([^']+)'/g)) used.add(match[1]);
  for (const match of text.matchAll(/data-i18n(?:-placeholder|-tip|-title)?="([^"]+)"/g)) used.add(match[1]);
}

const missing = [...used].filter((key) => !known.has(key));
console.log('static keys used:', used.size, '| dict keys:', known.size);
console.log(missing.length ? 'MISSING: ' + missing.join(', ') : 'all referenced keys present');
