chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.get(['settings', 'history', 'savedSets', 'dailyLuck'], function (data) {
    var settings = Object.assign({
      language: 'zh',
      theme: 'light',
      defaultRule: 'high',
      animationEnabled: true,
      historyLimit: 30
    }, data.settings || {});

    if (settings.defaultRule !== 'low') settings.defaultRule = 'high';

    chrome.storage.local.set({
      settings: settings,
      history: Array.isArray(data.history) ? data.history : [],
      savedSets: Array.isArray(data.savedSets) ? data.savedSets : [],
      dailyLuck: data.dailyLuck || null
    });
  });
});
