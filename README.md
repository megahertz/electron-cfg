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
});

config.set('album', { name, photos: photos.length });
```

### Methods

#### `create(filePath, logger = null)`
Create a new config instance with different file path.

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

#### `getAll(): Object`

Gets the root object of the config

#### `setAll(data): ElectronCfg`

Sets the root object of the config

#### `file(filePath = null): string`

Gets / Sets config's file path. If relative, it uses `app.getPath('userData')`
to resolve the full path.

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

#### `window(options?): WindowManager`

Allow to save/restore window size and position. See next section for details

 Param                    | Type             | Description
--------------------------|------------------|------------
 options = {              | object           | 
 -- name: 'main'          | string           | Useful when store settings of multiple windows
 -- saveFullscreen: true  | boolean          | Whether to restore fullscreen state
 -- saveMaximize: true    | boolean          | Whether to restore maximized state
 }                        |                  |

#### `resolveUserDataPath(filePath, useElectronResolver = true)`

Return file path relative to userData directory, similar to

```path.join(app.getPath('userData'), filePath)```

If useElectronResolver is false, it finds userData path without app.getPath.
Could be helpful for some cases when the app isn't packaged.

### Save/restore window state

```js
const { BrowserWindow } = require('electron');
const cfg = require('electron-cfg');

function createWindow() {
  const winCfg = cfg.window();
  const window = new BrowserWindow({
    width: 800,  // default, optional
    height: 600, // default, optional
    ...winCfg.options(),
  });
  winCfg.assign(window);
  return window;
}
```

or it can be simplified using the `create` shortcut:

```js
const cfg = require('electron-cfg');

function createWindow() {
  return cfg.window().create({ width: 800, height: 600 });
}
```

Remarks:
 - Don't set `useContentSize` to true at creating BrowserWindow instance because
   it changes how to calculate window size.
 - Don't call `cfg.window()` before the ready event is fired.
 
#### WindowManager methods
  - **create(options): BrowserWindow** - shortcut (see example above)
  - **assign(window: BrowserWindow)** - start handling size/position change
  - **options(): Rectangle | object** - get options for BrowserWindow
    constructor
  - **unassign()** - stop handling size/position change

## Related project

Here is a few alternatives which you can try:
 - [electron-json-config](https://github.com/de-luca/electron-json-config)
 - [electron-config](https://github.com/sindresorhus/electron-config)
 - [electron-settings](https://github.com/nathanbuchar/electron-settings)

A lot of code of Saving/restoring window state is based on
[electron-window-state](https://github.com/mawie81/electron-window-state)

## License

Licensed under MIT.
