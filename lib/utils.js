'use strict';

const electron = require('electron');

module.exports = {
  getAppPath() {
    return getModule('app').getPath('userData');
  },

  /**
   * @returns {typeof Electron.BrowserWindow}
   */
  getBrowserWindow() {
    return getModule('BrowserWindow');
  },

  getScreen() {
    return getModule('screen');
  },
};

function getModule(name) {
  const module = electron[name]
    || (electron.remote ? electron.remote[name] : null);

  if (!module) {
    throw new Error(
      `electron-cfg: Can't get electron.${name}. Make sure this code is `
      + 'called after app#ready is fired. If you use the module in '
      + 'a renderer process, make sure electron.remote is not disabled.'
    );
  }

  return module;
}
