'use strict';

const Config        = require('./lib/Config');
const ConfigFile    = require('./lib/ConfigFile');
const WindowTracker = require('./lib/WindowManager');

const file   = new ConfigFile();
const config = new Config(file);
const windows = {};

module.exports = {
  /**
   * Returns a value associated with the key.
   * @param {string} key
   * @param {*} [defaultValue]
   * @returns {*}
   */
  get(key, defaultValue = undefined) {
    return config.get(key, defaultValue);
  },

  /**
   * Sets a value.
   * @param {string} key
   * @param {*} value
   * @returns {IElectronCfg}
   */
  set(key, value) {
    config.set(key, value);
    return module.exports;
  },

  /**
   * Removes values associated with the key.
   * @param {string} key
   * @returns {IElectronCfg}
   */
  delete(key) {
    config.delete(key);
    return module.exports;
  },

  /**
   * Gets / Sets the root object of the config
   * @param {Object} [data]
   * @returns {Object|undefined}
   */
  all(data) {
    if (data) {
      config.writeData(data);
      return undefined;
    }

    return config.all();
  },

  /**
   * Gets / Sets config's file path
   * @param {string} [filePath]
   * @returns {string|undefined}
   */
  file(filePath) {
    if (filePath) {
      file.setPath(filePath);
      return undefined;
    }

    return file.filePath;
  },

  /**
   * Attaches a handler on keyName property changes. Changes are observable
   *   only in the same process.
   * @param {string} key
   * @param {Function} handler (newValue, oldValue, key) => void
   * @returns {IElectronCfg}
   */
  observe(key, handler) {
    config.observe(key, handler);
    return module.exports;
  },

  /**
   * Removes all data from config
   * @returns {IElectronCfg}
   */
  purge() {
    config.purge();
    return module.exports;
  },

  /**
   * Gets / Sets a logger (object with error, warn and debug methods)
   * @param {ILogger} logger
   * @returns {ILogger|undefined}
   */
  logger(logger) {
    if (logger) {
      file.setLogger(logger);
      return undefined;
    }

    return file.logger;
  },

  window(opts) {
    opts = {
      name: 'main',
      saveFullscreen: true,
      saveMaximize: true,
      ...opts,
    };

    const name = opts.name;

    if (!windows[name]) {
      windows[name] = new WindowTracker(opts, config, module.exports.logger());
    }

    return windows[name];
  },
};
