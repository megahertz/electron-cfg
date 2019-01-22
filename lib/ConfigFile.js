'use strict';

const fs       = require('fs');
const path     = require('path');
const utils    = require('./utils');

class ConfigFile {
  constructor(logger, filePath) {
    this.setLogger(logger);
    this.setPath(filePath);
  }

  setPath(filePath) {
    if (filePath) {
      this.filePath = filePath;
      return;
    }

    try {
      this.filePath = path.join(utils.getAppPath(), 'electron-cfg.json');
    } catch (e) {
      throw new Error(`Can't get config path automatically. ${e.message}`);
    }
  }

  setLogger(logger = undefined) {
    this.logger = logger === undefined ? console : logger;
  }

  read() {
    try {
      return Object.assign(
        Object.create(null),
        JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
      );
    } catch (e) {
      return Object.create(null);
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, '  '));
    } catch (e) {
      if (e.name === 'ENOENT') {
        fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, '  '));
        return;
      }

      this.logger && this.logger.warn(e);

      throw e;
    }
  }
}

module.exports = ConfigFile;
