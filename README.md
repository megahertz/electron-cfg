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

#### `get(key, defaultValue = null): any`

Returns a value associated with the key.

Param         | Type   | Description
--------------|--------|------------
key           | string | Key name, use dot in key to return nested value of some object
defaultValue? | any    | Return this values instead if key not found

#### `set(key, value): electron-cfg`

Sets a value.

#### `has(key): boolean`

Is key exists in the config.

#### `delete(key): electron-cfg`

Removes values associated with the key.

#### `all(data = null): Object`

Gets / Sets the root object of the config

#### `file(filePath = null): string`
Gets / Sets config's file path

#### `observe(key, handler): electron-cfg`
Attaches a handler on keyName property changes. Changes are observable
only in the same process.

Param         | Type                              | Description
--------------|-----------------------------------|------------
key           | string                            | Key name
handler       | (newValue, oldValue, key) => void | Observer

#### `purge(): electron-cfg`

Removes all data from config

#### `logger(logger = console)`

Gets / Sets a logger (object with error, warn and debug methods)

#### `createBrowserWindow(windowOptions = {}, settingsOptions = {}): BrowserWindow`

Creates a new BrowserWindow. electron-cfg spies on its state changes.
Will be available in v0.1.0.

 Param                    | Type             | Description
--------------------------|------------------|------------
 windowOptions = {}       | Object           | Passed to BrowserWindow constructor
 settingsOptions = {      | Object \| string | State options
 -- name: 'main'          | string           | Useful when store settings of multiple windows
 -- width: true           | boolean          | Handle window width changes
 -- height: true          | boolean          | Handle window height changes
 -- x: true               | boolean          | Handle window x offset changes
 -- y: true               | boolean          | Handle window y offset changes
 -- maximized: true       | boolean          | Handle window maximized changes
 -- minimized: true       | boolean          | Handle window minimized changes
 -- fullscreen: true      | boolean          | Handle window fullscreen changes
 }                        |                  |

## Related project

Here is a few alternatives which you can try:
- [electron-json-config](https://github.com/de-luca/electron-json-config)
- [electron-config](https://github.com/sindresorhus/electron-config)
- [electron-settings](https://github.com/nathanbuchar/electron-settings)

## License

Licensed under MIT.
