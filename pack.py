# -*- coding: utf-8 -*-
"""LuckyPick 打包脚本：JS 语法校验 + i18n 键一致性校验 + 打包 + 完整性断言"""
import json
import os
import pathlib
import shutil
import subprocess
import tempfile
import zipfile

BASE = r"d:\迅雷下载\vibe coding\Chrome Extensions\LuckyPick"
# 用户指定：zip 统一输出到 vibe coding 根目录，不放项目子目录
OUT_DIR = r"d:\迅雷下载\vibe coding"

EXCLUDE_DIRS = {'.git', '.codebuddy', 'store-assets', 'store-screenshots', 'scripts', 'tools'}
EXCLUDE_FILES = {'.gitignore', 'create-icons.html', 'pack.py'}
EXCLUDE_EXT = {'.zip', '.tmp', '.bak'}

REQUIRED = ['popup.html', 'popup.js', 'popup.css', 'background.js', 'donate.html',
            '_locales/zh_CN/messages.json', '_locales/en/messages.json',
            '_locales/es/messages.json', 'js/i18n.js', 'assets/赞赏码.png']

JS_TARGETS = ['popup.js', 'background.js', 'js/i18n.js']


def read_version():
    with open(os.path.join(BASE, 'manifest.json'), encoding='utf-8') as handle:
        return json.load(handle)['version']


def check_js_syntax():
    """用 node --check 做语法校验；ESM 文件复制为 .mjs 后检查"""
    node = shutil.which('node')
    if not node:
        print('WARN: node not found, syntax check skipped')
        return
    tmp_dir = tempfile.mkdtemp(prefix='lpcheck_')
    try:
        for rel in JS_TARGETS:
            tmp = os.path.join(tmp_dir, rel.replace('/', '_') + '.mjs')
            shutil.copyfile(os.path.join(BASE, rel), tmp)
            proc = subprocess.run([node, '--check', tmp], capture_output=True, text=True)
            if proc.returncode != 0:
                raise SystemExit('syntax error in %s:\n%s' % (rel, proc.stderr.strip()))
            print('syntax OK:', rel)
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


def check_i18n_keys():
    """三语字典键集合必须完全一致，防止漏翻"""
    node = shutil.which('node')
    if not node:
        return
    i18n_uri = pathlib.Path(os.path.join(BASE, 'js', 'i18n.js')).as_uri()
    script = """
import { I18N } from '%s';
const base = Object.keys(I18N.zh);
let bad = false;
for (const lang of ['en', 'es']) {
  const miss = base.filter((k) => !(k in I18N[lang]));
  const extra = Object.keys(I18N[lang]).filter((k) => !(k in I18N.zh));
  if (miss.length || extra.length) {
    bad = true;
    console.error(lang, '| missing:', miss.join(',') || '-', '| extra:', extra.join(',') || '-');
  }
}
if (bad) process.exit(1);
console.log('i18n keys OK:', base.length);
""" % i18n_uri
    tmp = os.path.join(tempfile.gettempdir(), 'lp_i18n_check.mjs')
    with open(tmp, 'w', encoding='utf-8') as handle:
        handle.write(script)
    proc = subprocess.run([node, tmp], capture_output=True, text=True)
    os.remove(tmp)
    if proc.returncode != 0:
        raise SystemExit('i18n key mismatch:\n' + (proc.stderr or proc.stdout).strip())
    print(proc.stdout.strip())


def check_i18n_usage():
    """代码中静态引用的 i18n 键必须存在于字典"""
    node = shutil.which('node')
    if not node:
        return
    script = os.path.join(BASE, 'tools', 'check_keys.mjs')
    if not os.path.exists(script):
        print('WARN: tools/check_keys.mjs not found, usage check skipped')
        return
    proc = subprocess.run([node, script], capture_output=True, text=True)
    output = (proc.stdout or '') + (proc.stderr or '')
    if proc.returncode != 0 or 'MISSING' in output:
        raise SystemExit('i18n usage problem:\n' + output.strip())
    print(output.strip())


def main():
    version = read_version()
    out = os.path.join(OUT_DIR, 'LuckyPick-v%s.zip' % version)

    check_js_syntax()
    check_i18n_keys()
    check_i18n_usage()

    count = 0
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as archive:
        for root, dirs, files in os.walk(BASE):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for name in files:
                ext = os.path.splitext(name)[1].lower()
                if name in EXCLUDE_FILES or ext in EXCLUDE_EXT:
                    continue
                full = os.path.join(root, name)
                rel = os.path.relpath(full, BASE).replace(os.sep, '/')
                archive.write(full, rel)
                count += 1

    with zipfile.ZipFile(out) as archive:
        bad = archive.testzip()
        assert bad is None, 'corrupt entry: %s' % bad
        names = archive.namelist()
        assert 'manifest.json' in names, 'manifest.json missing at root'
        for required in REQUIRED:
            assert required in names, 'missing: %s' % required
        assert all(not n.lower().endswith('.zip') for n in names), 'nested zip!'
        assert all(not n.startswith('tools/') for n in names), 'dev scripts leaked into package!'
        packed_version = json.loads(archive.read('manifest.json').decode('utf-8'))['version']
        assert packed_version == version, 'version mismatch: %s' % packed_version
        print('entries:', len(names), '| files written:', count)
        print('size: %.1f KB' % (os.path.getsize(out) / 1024))
        print('root files:', sorted(n for n in names if '/' not in n))
        print('VALID ->', out)


if __name__ == '__main__':
    main()
