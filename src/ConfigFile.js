'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('./utils');

class ConfigFile {
  constructor(filePath, logger) {
    this.uniqueId = new Date().getTime();
    this.setLogger(logger);
    this.setFilePath(filePath);
  }

  setFilePath(filePath) {
    if (path.isAbsolute(filePath)) {
      this.filePath = filePath;
      return;
    }

    try {
      this.filePath = path.join(utils.getAppPath(), filePath);
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
    const text = JSON.stringify(data, null, '  ');

    try {
      this.writeAtomic(text);
    } catch (e) {
      try {
        mkDir(path.dirname(this.filePath));
        this.writeAtomic(text);
      } catch (e2) {
        this.logger && this.logger.warn(e2);
        throw e2;
      }
    }
  }

  writeAtomic(text) {
    this.uniqueId += 1;
    const tempFile = this.filePath + '.' + this.uniqueId;
    fs.writeFileSync(tempFile, text);
    fs.renameSync(tempFile, this.filePath);
  }
}

module.exports = ConfigFile;

function mkDir(dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
}
