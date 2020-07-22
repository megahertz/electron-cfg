import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
} from "electron";

type Observer<Key, Value> = (
  newValue: Value,
  oldValue: Value,
  key: Key,
) => void;

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

interface ElectronCfg<T = any> {
  create<NewType = any>(
    fileName: string,
    logger?: Logger,
  ): ElectronCfg<NewType>;
  get<Key extends keyof T>(key: Key, defaultValue?: T[Key]): T[Key];
  set<Key extends keyof T>(key: Key, value: T[Key]): ElectronCfg;
  getAll(): T;
  setAll(data: T): ElectronCfg;
  delete<Key extends keyof T>(key: Key): ElectronCfg;
  file(filePath?: string): string;
  observe<Key extends keyof T>(
    key: Key,
    handler: Observer<Key, T[Key]>
  ): ElectronCfg;
  purge(): ElectronCfg;
  logger(logger: Logger): Logger;
  window(opts?: WindowTrackerOptions): WindowTracker;
  resolveUserDataPath(filePath: string, useElectronResolver?: boolean): string;
}

// Merge namespace with interface
declare const ElectronCfg: ElectronCfg & {
  default: ElectronCfg;
}

export = ElectronCfg;
