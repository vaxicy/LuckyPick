/**
 * 一次性工具：把 popup.js 中的 I18N 字典抽离为独立 ES module (js/i18n.js)。
 * 只做三件事：
 *   1. 生成 js/i18n.js（导出 I18N / t / setLang）
 *   2. 从 popup.js 移除字典块与 t() 定义，顶部补 import
 *   3. 在 lang 赋值处同步调用 setLang(lang)
 * 运行： node tools/extract_i18n.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const popupPath = path.join(root, 'popup.js');
// 统一换行符，避免 CRLF/LF 导致字符串匹配失败
let src = fs.readFileSync(popupPath, 'utf8').replace(/\r\n/g, '\n');

const startMarker = '  const I18N = {';
const start = src.indexOf(startMarker);
if (start < 0) {
  console.error('未找到 I18N 字典块，脚本可能已执行过');
  process.exit(1);
}

// 字典块以「两个空格缩进的 };」结束
const tailMatch = /\n {2}\};\n/.exec(src.slice(start));
if (!tailMatch) {
  console.error('未找到 I18N 字典块结尾');
  process.exit(1);
}

const block = src.slice(start, start + tailMatch.index + tailMatch[0].length);
const dictBody = block.slice(block.indexOf('{') + 1, block.lastIndexOf('};'));

const moduleSource = `export const I18N = {${dictBody}};

let moduleLang = 'zh';

export function setLang(next) {
  if (next === 'zh' || next === 'en') moduleLang = next;
}

export function t(key) {
  return (I18N[moduleLang] && I18N[moduleLang][key]) || I18N.en[key] || key;
}
`;

fs.mkdirSync(path.join(root, 'js'), { recursive: true });
fs.writeFileSync(path.join(root, 'js', 'i18n.js'), moduleSource, 'utf8');

// 从 popup.js 移除字典块
src = src.slice(0, start) + src.slice(start + block.length);

// 移除 t() 定义
const tDefinition = `  function t(key) {
    return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  }

`;
if (src.includes(tDefinition)) {
  src = src.replace(tDefinition, '');
} else {
  console.warn('警告：未匹配到 t() 定义，请手动确认');
}

// lang 赋值处同步模块内语言
const beforeSettings = "lang = settings.lang || 'zh';";
if (src.includes(beforeSettings)) {
  src = src.replace(beforeSettings, `${beforeSettings}\n      setLang(lang);`);
} else {
  console.warn('警告：未匹配到 loadSettings 中的 lang 赋值');
}

const beforeSwitch = 'lang = button.dataset.value;';
if (src.includes(beforeSwitch)) {
  src = src.replace(beforeSwitch, `${beforeSwitch}\n        setLang(lang);`);
} else {
  console.warn('警告：未匹配到语言切换处的 lang 赋值');
}

// 顶部补 import（放在 IIFE 之外，符合 ES module 要求）
src = `import { t, setLang } from './js/i18n.js';\n${src}`;

fs.writeFileSync(popupPath, src, 'utf8');
console.log('已生成 js/i18n.js 并更新 popup.js');
