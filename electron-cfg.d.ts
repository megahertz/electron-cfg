import BrowserWindow = Electron.BrowserWindow;

type IObserver = (newValue: string, oldValue: string, key: string) => any;

interface IElectronCfg {
    get(key: string, defaultValue: any = undefined): any;
    set(key: string, value: any): IElectronCfg;
    //noinspection ReservedWordAsName
    delete(key: string): IElectronCfg;
    all(): object;
    file(): string;
    observe(key: string, handler: IObserver): IElectronCfg;
    purge(): IElectronCfg;
    createBrowserWindow(
        windowOptions: object = {},
        settingsOptions: object = {},
    ): BrowserWindow;
}

declare module "electron-cfg" {
    const electronCfg: IElectronCfg;
    export = electronCfg;
}
