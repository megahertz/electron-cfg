'use strict';

const fs       = require('fs');
const path     = require('path');
const electron = require('electron');

class ConfigFile {
  constructor(logger, filePath) {
    this.setLogger(logger);
    this.setPath(filePath);
  }

  setPath(filePath) {
    this.filePath = filePath || ConfigFile.defaultPath();
  }

  setLogger(logger) {
    this.logger = logger || console;
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
        fs.mkdirSync(path.dirname(this.filePath));
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, '  '));
        return;
      }

      this.logger.warn(e);

      throw e;
    }
  }

  static defaultPath() {
    const app = electron.app || electron.remote.app;
    return path.join(app.getPath('userData'), 'electron-cfg.json');
  }
}

module.exports = ConfigFile;
