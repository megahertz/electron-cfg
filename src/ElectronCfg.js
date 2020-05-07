'use strict';

const Config = require('./Config');
const ConfigFile = require('./ConfigFile');
const utils = require('./utils');
const WindowTracker = require('./WindowManager');

class ElectronCfg {
  /**
   * @param {string} [fileName]
   * @param {Logger} [logger]
   */
  constructor(fileName, logger) {
    this.loggerInstance = logger;
    this.configFile = new ConfigFile(fileName, logger);
    this.config = new Config(this.configFile);
    this.windows = {};
  }

  /**
   * Create another instance
   * @param {string} fileName
   * @param logger
   * @return {ElectronCfg}
   */
  create(fileName, logger = this.loggerInstance) {
    return new ElectronCfg(fileName, logger);
  }

  /**
   * Returns a value associated with the key.
   * @param {string} key
   * @param {*} [defaultValue]
   * @returns {*}
   */
  get(key, defaultValue = undefined) {
    return this.config.get(key, defaultValue);
  }

  /**
   * Sets a value.
   * @param {string} key
   * @param {*} value
   * @returns {ElectronCfg}
   */
  set(key, value) {
    this.config.set(key, value);
    return module.exports;
  }

  /**
   * Removes values associated with the key.
   * @param {string} key
   * @returns {ElectronCfg}
   */
  delete(key) {
    this.config.delete(key);
    return module.exports;
  }

  /**
   * Gets / Sets the root object of the config
   * @param {Object} [data]
   * @returns {Object|undefined}
   */
  all(data) {
    if (data) {
      this.config.writeData(data);
      return undefined;
    }

    return this.config.all();
  }

  /**
   * Gets / Sets config's file name/path
   * @param {string} [fileName]
   * @returns {string|undefined}
   */
  file(fileName) {
    if (fileName) {
      this.configFile.setFilePath(fileName);
      return undefined;
    }

    return this.configFile.filePath;
  }

  /**
   * Attaches a handler on keyName property changes. Changes are observable
   *   only in the same process.
   * @param {string} key
   * @param {Function} handler (newValue, oldValue, key) => void
   * @returns {ElectronCfg}
   */
  observe(key, handler) {
    this.config.observe(key, handler);
    return module.exports;
  }

  /**
   * Removes all data from config
   * @returns {ElectronCfg}
   */
  purge() {
    this.config.purge();
    return module.exports;
  }

  /**
   * Gets / Sets a logger (object with error, warn and debug methods)
   * @param {Logger} logger
   * @returns {Logger|undefined}
   */
  logger(logger) {
    if (logger) {
      this.loggerInstance = logger;
      this.configFile.setLogger(logger);
      return undefined;
    }

    return this.loggerInstance;
  }

  window(windowOptions) {
    const opts = {
      name: 'main',
      saveFullscreen: true,
      saveMaximize: true,
      ...windowOptions,
    };

    const name = opts.name;

    if (!this.windows[name]) {
      this.windows[name] = new WindowTracker(
        opts,
        this.config,
        this.loggerInstance
      );
    }

    return this.windows[name];
  }

  // eslint-disable-next-line class-methods-use-this
  resolveFilePath(filePath) {
    return utils.resolveFilePath(filePath);
  }
}

module.exports = ElectronCfg;
