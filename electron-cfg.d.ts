/// <reference types="electron" />

type IObserver = (newValue: string, oldValue: string, key: string) => any;

interface ILogger {
  debug?(message: any): void;
  info(message: any): void;
  warn(message: any): void;
  error(message: any): void;
}

interface IWindowTrackerOptions {
  name: string;
  saveFullscreen?: boolean;
  saveMaximize?: boolean;
}

interface IWindowTracker {
  create(
    options?: Electron.BrowserWindowConstructorOptions,
  ): Electron.BrowserWindow;
  assign(window: Electron.BrowserWindow);
  options(): Electron.Rectangle | object;
  unassign();
}

interface IElectronCfg {
  get(key: string, defaultValue?: any): any;
  set(key: string, value: any): IElectronCfg;
  delete(key: string): IElectronCfg;
  all(): object;
  file(): string;
  observe(key: string, handler: IObserver): IElectronCfg;
  purge(): IElectronCfg;
  logger(logger: ILogger): ILogger;
  window(opts?: IWindowTrackerOptions): IWindowTracker;
}

declare const _d: IElectronCfg;
export = _d;
