'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

let electron;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies,global-require
  electron = require('electron');
} catch (e) {
  electron = {};
}

module.exports = {
  getAppPath() {
    const app = getModule('app', false);
    if (app && app.name && app.name.toLowerCase() !== 'electron') {
      return app.getPath('userData');
    }

    return getAppPath();
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

function getModule(name, throwOnError = true) {
  const module = electron[name]
    || (electron.remote ? electron.remote[name] : null);

  if (!module) {
    if (!throwOnError) {
      return null;
    }

    throw new Error(
      `electron-cfg: Can't get electron.${name}. Make sure this code is `
      + 'called after app#ready is fired. If you use the module in '
      + 'a renderer process, make sure electron.remote is not disabled.'
    );
  }

  return module;
}

function getAppPath() {
  const home = os.homedir();
  const appName = getAppName();

  switch (process.platform) {
    case 'win32':
      return path.join(home, 'AppData/Roaming', appName);
    case 'darwin':
      return path.join(home, 'Library/Application Support', appName);
    default: {
      if (process.env.XDG_CONFIG_HOME) {
        return path.join(process.env.XDG_CONFIG_HOME, appName);
      }

      return path.join(home, '.config', appName);
    }
  }
}

function getAppName() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.productName || packageJson.name;
  } catch (e) {
    throw new Error('Can\'t detect application path.');
  }
}
