/// <reference path='./Base.ts' />

export interface IBase {
    on(eventName: string, handler: IHandler, context?: any):IBase;
    once(eventName: string, handler: IHandler, context?: any):IBase;
    off(eventName?: string, handler?: IHandler):IBase;

    listenTo(target: IBase, eventName: string, handler: IHandler, context?: any):IBase;
    listenToOnce(target: IBase, eventName: string, handler: IHandler, context?: any):IBase;
    stopListening(target?: IBase, eventName?: string, handler?: IHandler):IBase;

    trigger(eventName: string, args?: Array<any>):IBase;

    onLoad(callback: Callback):IBase;
    loaded():IBase;
    onReady(callback: Callback):IBase;
    ready():IBase;

    onState(state: string, callback: Callback):IBase;
    setState(state: string):IBase;

    hasState(state: string):boolean;
    isLoaded():boolean;
}

export interface Events {
    [key:string]:Array<HandlerData>;
}

export interface States {
    [key:string]:boolean|Array<Callback>;
}

export interface HandlerData {
    context: any;
    handler: IHandler;
    listenTo?: IBase;
}

export interface IHandler {
    (a?, b?, c?, d?, e?):any;
}

export interface Callback {
    ():void;
}
