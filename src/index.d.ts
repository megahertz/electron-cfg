import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
} from "electron";

type Observer = (newValue: string, oldValue: string, key: string) => any;

interface Logger {
  debug?(message: any): void;
  info(message: any): void;
  warn(message: any): void;
  error(message: any): void;
}

interface WindowTrackerOptions {
  name: string;
  saveFullscreen?: boolean;
  saveMaximize?: boolean;
}

interface WindowTracker {
  create(options?: BrowserWindowConstructorOptions): BrowserWindow;
  assign(window: Electron.BrowserWindow): void;
  options(): Electron.Rectangle | object;
  unassign(): void;
}

interface ElectronCfg {
  get(key: string, defaultValue?: any): any;
  set(key: string, value: any): ElectronCfg;
  delete(key: string): ElectronCfg;
  all(): object;
  file(): string;
  observe(key: string, handler: Observer): ElectronCfg;
  purge(): ElectronCfg;
  logger(logger: Logger): Logger;
  window(opts?: WindowTrackerOptions): WindowTracker;
}

// Merge namespace with interface
declare const ElectronCfg: ElectronCfg & {
  default: ElectronCfg;
}

export = ElectronCfg;
