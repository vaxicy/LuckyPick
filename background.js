chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.get(['luckypick_settings', 'luckypick_history', 'luckypick_state'], function (data) {
    var settings = Object.assign({
      lang: 'zh',
      theme: 'light',
      mode: 'dice',
      rule: 'high',
      incognito: false,
      animSpeed: 'normal'
    }, data.luckypick_settings || {});

    settings.rule = 'high';
    if (['dice', 'coin', 'wheel'].indexOf(settings.mode) === -1) settings.mode = 'dice';
    if (['fast', 'normal', 'slow'].indexOf(settings.animSpeed) === -1) settings.animSpeed = 'normal';

    chrome.storage.local.set({
      luckypick_settings: settings,
      luckypick_history: Array.isArray(data.luckypick_history) ? data.luckypick_history : [],
      luckypick_state: data.luckypick_state || null
    });
  });
});
