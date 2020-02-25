'use strict';

const Config = require('./Config');
const ConfigFile = require('./ConfigFile');
const WindowTracker = require('./WindowManager');

const file = new ConfigFile();
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
   * @returns {ElectronCfg}
   */
  set(key, value) {
    config.set(key, value);
    return module.exports;
  },

  /**
   * Removes values associated with the key.
   * @param {string} key
   * @returns {ElectronCfg}
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
   * @returns {ElectronCfg}
   */
  observe(key, handler) {
    config.observe(key, handler);
    return module.exports;
  },

  /**
   * Removes all data from config
   * @returns {ElectronCfg}
   */
  purge() {
    config.purge();
    return module.exports;
  },

  /**
   * Gets / Sets a logger (object with error, warn and debug methods)
   * @param {Logger} logger
   * @returns {Logger|undefined}
   */
  logger(logger) {
    if (logger) {
      file.setLogger(logger);
      return undefined;
    }

    return file.logger;
  },

  window(windowOptions) {
    const opts = {
      name: 'main',
      saveFullscreen: true,
      saveMaximize: true,
      ...windowOptions,
    };

    const name = opts.name;

    if (!windows[name]) {
      windows[name] = new WindowTracker(opts, config, module.exports.logger());
    }

    return windows[name];
  },
};

module.exports.default = module.exports;
