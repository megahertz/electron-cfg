'use strict';

const electron   = require('electron');
const Config     = require('./lib/Config');
const ConfigFile = require('./lib/ConfigFile');

const file   = new ConfigFile();
const config = new Config(file);

module.exports = {
  get(key, defaultValue = undefined) {
    return config.get(key, defaultValue);
  },

  set(key, value) {
    config.set(key, value);
    return module.exports;
  },

  delete(key) {
    config.delete(key);
    return module.exports;
  },

  all(data) {
    if (data) {
      config.writeData(data);
      return undefined;
    }

    return config.all();
  },

  file(filePath) {
    if (filePath) {
      file.setPath(filePath);
      return undefined;
    }

    return file.filePath;
  },

  observe(key, handler) {
    config.observe(key, handler);
    return module.exports;
  },

  purge() {
    config.purge();
    return module.exports;
  },

  logger(logger) {
    if (logger) {
      file.setLogger(logger);
      return undefined;
    }

    return file.logger;
  },

  // eslint-disable-next-line no-unused-vars
  createBrowserWindow(windowOptions = {}, settingsOptions = {}) {
    const BrowserWindow = electron.BrowserWindow ||
      electron.remote.BrowserWindow;

    // TODO: Implement in v0.1.0
    return new BrowserWindow(windowOptions);
  },
};
