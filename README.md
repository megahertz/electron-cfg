# electron-cfg
[![Build Status](https://travis-ci.org/megahertz/electron-cfg.svg?branch=master)](https://travis-ci.org/megahertz/electron-cfg)
[![npm version](https://badge.fury.io/js/electron-cfg.svg)](https://badge.fury.io/js/electron-cfg)
[![Dependencies status](https://david-dm.org/megahertz/electron-cfg/status.svg)](https://david-dm.org/megahertz/electron-cfg)

## Description

Just a very easy solution for storing settings for an electron
application.

### Key features

 - Settings observer
 - Built-in helper for saving and restoring window state
 - No dependencies

## Installation

Install with [npm](https://npmjs.org/package/electron-cfg):

    npm install --save electron-cfg

## Usage

```js
const config = require('electron-cfg');

const downloadsPath = config.get('downloads.path', process.cwd());

config.observe('album', (current, old) => {
  console.log(`Previous: ${old.name}, current: ${current.name}`);
}

config.set('album', { name, photos: photos.length });
```

### Methods

#### get(key, defaultValue = null): any

Return a value.

**key** Use dot in key to return nested value of some object

**defaultValue** Return this

#### set(key, value): electron-cfg

#### has(key): boolean

#### delete(key): electron-cfg

#### all(): Object
Return the root element of config

#### file(): string
Return path to the settings json file

#### observe(key, handler): electron-cfg
Attach a handler on keyName property changes. Changes are observable
only in the same process.

#### createBrowserWindow(windowOptions = {}, settingsOptions = {}): BrowserWindow

#### purge(): electron-cfg
Remove all data from config

Will be available in v0.1.0 Creates a new BrowserWindow. electron-cfg
spies on its state changes.

**windowOptions** is passed to BrowserWindow constructor

**settingsOptions** contains boolean options, if it set to false,
electron cfg will not handle this state changes:

 - width: true
 - height: true
 - x: true
 - y: true
 - maximized: true
 - minimized: false
 - fullscreen: true
 - name is useful when you want to save state of multiple windows

## Related project

Here is a few alternatives which you can try:
- [electron-json-config](https://github.com/de-luca/electron-json-config)
- [electron-config](https://github.com/sindresorhus/electron-config)
- [electron-settings](https://github.com/nathanbuchar/electron-settings)

## License

Licensed under MIT.
