import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Rectangle,
} from "electron";

type IObserver = (newValue: string, oldValue: string, key: string) => any;

interface ILogger {
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
  create(options?: BrowserWindowConstructorOptions): BrowserWindow;
  track(window: BrowserWindow);
  windowOptions(): Rectangle | object;
  untrack();
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
  trackWindow(options?: IWindowTrackerOptions): IWindowTracker;
}

declare module "electron-cfg" {
  const electronCfg: IElectronCfg;
  export = electronCfg;
}
