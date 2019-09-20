function setSetting(setting, value) {
  var settingsLock = navigator.mozSettings.createLock();
  var setting = settingsLock.set({setting: value});
  return new Promise((resolve, reject) => {
      setting.onsuccess = resolve;
      setting.onerror = (err) => {reject(err)};
  });
}
function getSetting(setting) {
  var settingsLock = navigator.mozSettings.createLock();
  var setting = settingsLock.get(setting);
  return new Promise((resolve, reject) => {
      setting.onsuccess = () => {resolve(setting.result)};
      setting.onerror = () => {reject(setting.error)};
  });
}