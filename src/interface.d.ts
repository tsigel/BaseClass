/// <reference path='./Base.ts' />

export interface IBase {
    on(eventName: string, handler: IHandler, context?: any): IBase;
    once(eventName: string, handler: IHandler, context?: any): IBase;
    off(eventName?: string, handler?: IHandler): IBase;

    listenTo(target: IBase, eventName: string, handler: IHandler, context?: any): IBase;
    listenToOnce(target: IBase, eventName: string, handler: IHandler, context?: any): IBase;
    stopListening(target?: IBase, eventName?: string, handler?: IHandler): IBase;

    trigger(eventName: string, args?: Array<any>): IBase;

    onLoad(callback: ICallback): IBase;
    loaded(): IBase;
    isLoaded(): boolean;

    onReady(callback: ICallback): IBase;
    ready(): IBase;
    isReady(): boolean;

    onState(state: string, callback: ICallback): IBase;
    setState(state: string): IBase;
    hasState(state: string): boolean;
}

export interface IHandler {
    (...args: Array<any>): any;
}

export interface ICallback {
    (): void;
}
