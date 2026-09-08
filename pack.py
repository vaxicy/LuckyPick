# -*- coding: utf-8 -*-
import os
import zipfile

BASE = r"d:\迅雷下载\vibe coding\Chrome Extensions\LuckyPick"
OUT = r"d:\迅雷下载\vibe coding\LuckyPick-v1.0.5.zip"

EXCLUDE_DIRS = {'.git', '.codebuddy', 'store-assets', 'store-screenshots', 'scripts'}
EXCLUDE_FILES = {'.gitignore', 'create-icons.html', 'pack.py'}
EXCLUDE_EXT = {'.zip', '.tmp', '.bak'}

count = 0
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(BASE):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for name in files:
            ext = os.path.splitext(name)[1].lower()
            if name in EXCLUDE_FILES or ext in EXCLUDE_EXT:
                continue
            full = os.path.join(root, name)
            rel = os.path.relpath(full, BASE).replace(os.sep, '/')
            z.write(full, rel)
            count += 1

# 校验
with zipfile.ZipFile(OUT) as z:
    bad = z.testzip()
    assert bad is None, f'corrupt entry: {bad}'
    names = z.namelist()
    assert 'manifest.json' in names, 'manifest.json missing at root'
    for required in ['popup.html', 'popup.js', 'popup.css', 'background.js', 'donate.html',
                     '_locales/zh_CN/messages.json', '_locales/en/messages.json',
                     '_locales/es/messages.json', 'js/i18n.js', 'assets/赞赏码.png']:
        assert required in names, f'missing: {required}'
    assert all(not n.lower().endswith('.zip') for n in names), 'nested zip!'
    print('entries:', len(names), '| files written:', count)
    print('size: %.1f KB' % (os.path.getsize(OUT) / 1024))
    print('root files:', sorted(n for n in names if '/' not in n))
    print('VALID')
