'use strict';

const fs = require('fs');
const { afterEach, beforeEach, describe, expect, it } = require('humile');
const os = require('os');
const path = require('path');
const cfg = require('..');

describe('index', () => {
  let tempPath;

  beforeEach(() => {
    tempPath = fs.mkdtempSync(path.join(os.tmpdir(), 'electron-cfg-test-'));
  });

  afterEach(() => {
    fs.rmdirSync(tempPath, { recursive: true });
  });

  it('should create multiple instances', () => {
    const cfg1 = cfg.create(path.join(tempPath, 'cfg1.json'));
    const cfg2 = cfg.create(path.join(tempPath, 'cfg2.json'));

    cfg1.set('val1', 1);
    cfg2.set('val1', 2);

    expect(readFile('cfg1.json')).toEqual({ val1: 1 });
    expect(readFile('cfg2.json')).toEqual({ val1: 2 });
  });

  function readFile(fileName) {
    return JSON.parse(fs.readFileSync(path.join(tempPath, fileName), 'utf8'));
  }
});
