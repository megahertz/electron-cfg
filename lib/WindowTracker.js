'use strict';

/**
 * Based on electron-window-state package
 */

const electron = require('electron');

class WindowTracker {
  /**
   * @param {Object}  options
   * @param {Config}  store
   * @param {ILogger} logger
   */
  constructor(options, store, logger) {
    this.options = options;
    this.store   = store;
    this.logger  = logger;

    this.onStateChanged = this.onStateChanged.bind(this);
    this.onClose        = this.onClose.bind(this);
    this.onClosed       = this.onClosed.bind(this);
    this.save           = this.save.bind(this);
  }

  /**
   * Shortcut for creating tracked BrowserWindow
   * @param {Electron.BrowserWindowConstructorOptions} options
   * @returns {Electron.BrowserWindow}
   */
  create(options = {}) {
    const BrowserWindow = electron.BrowserWindow
      || (electron.remote ? electron.remote.BrowserWindow : null);

    if (!BrowserWindow) {
      throw new Error(
        "electron-cfg: Can't get electron.BrowserWindow. Make sure this code "
        + 'is called after app#ready is fired. If you use the module in '
        + 'a renderer process, make sure electron.remote is not disabled.'
      );
    }

    const window = new BrowserWindow({
      ...options,
      ...this.windowOptions(),
    });

    this.track(window);

    return window;
  }

  /**
   * Track window dimensions on change
   * @param {Electron.BrowserWindow} window
   */
  track(window) {
    if (this.window) {
      if (window === this.window) {
        return;
      }

      throw new Error(`Another window is already attached as ${this.name}`);
    }

    if (!window) return;

    this.window = window;

    const { isFullScreen, isMaximized } = this.getState();
    const { saveMaximize, saveFullscreen } = this.options;

    if (saveMaximize && isMaximized) {
      window.maximize();
    }

    if (saveFullscreen && isFullScreen) {
      window.setFullScreen(true);
    }

    window.setBounds(this.windowOptions());

    window.on('resize', this.onStateChanged);
    window.on('move',   this.onStateChanged);
    window.on('close',  this.onClose);
    window.on('closed', this.onClosed);
  }

  /**
   * @returns {Electron.Rectangle|Object}
   */
  windowOptions() {
    const state = this.getState();

    if (!validateState(state, this.logger)) {
      return {};
    }

    return {
      width: state.width,
      height: state.height,
      x: state.x,
      y: state.y,
    };
  }

  /**
   * Stop tracking window dimensions change
   */
  untrack() {
    const window = this.window;

    if (!window) {
      return;
    }

    window.removeListener('resize', this.onStateChanged);
    window.removeListener('move', this.onStateChanged);
    clearTimeout(this.onStateChanged);
    window.removeListener('close', this.onClose);
    window.removeListener('closed', this.onClosed);

    this.window = null;
  }

  /**
   * @private
   */
  getState() {
    return this.store.get(`windowState.${this.options.name}`, {});
  }

  /**
   * @private
   */
  setState(value) {
    this.store.set(`windowState.${this.options.name}`, value);
  }

  /**
   * @private
   */
  save() {
    const window = this.window;
    if (!window) return;

    let state;
    try {
      state = {
        isMaximized: window.isMaximized(),
        isFullScreen: window.isFullScreen(),
        ...(isNormal(window) ? window.getBounds() : this.windowOptions()),
      };
    } catch (err) {
      // Don't throw an error when window was closed
    }

    if (state) {
      this.setState(state);
    }
  }

  /**
   * @private
   */
  onStateChanged() {
    clearTimeout(this.stateChangeTimer);
    this.stateChangeTimer = setTimeout(this.save, 300);
  }

  /**
   * @private
   */
  onClose() {
    this.save();
  }

  /**
   * @private
   */
  onClosed() {
    this.untrack();
    this.save();
  }
}

module.exports = WindowTracker;

function isNormal(wnd) {
  return !wnd.isMaximized() && !wnd.isMinimized() && !wnd.isFullScreen();
}

function validateState(state, logger) {
  const isValidValues = (
    state
    && Number.isInteger(state.x)
    && Number.isInteger(state.y)
    && Number.isInteger(state.width) && state.width > 0
    && Number.isInteger(state.height) && state.height > 0
  );

  if (!isValidValues) {
    return false;
  }

  const screen = electron.screen
    || (electron.remote ? electron.remote.screen : null);

  if (!screen) {
    logger && logger.warn(
      "electron-cfg: Can't get electron.screen. Make sure this code is "
      + 'called after app#ready is fired. If you use the module in '
      + 'a renderer process, make sure electron.remote is not disabled.'
    );
    return false;
  }

  return screen.getAllDisplays().some(d => isRectInBounds(state, d.bounds));
}

function isRectInBounds(rect, bounds) {
  return (
    rect.x >= bounds.x
    && rect.y >= bounds.y
    && rect.x + rect.width <= bounds.x + bounds.width
    && rect.y + rect.height <= bounds.y + bounds.height
  );
}
