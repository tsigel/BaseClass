declare module BaseModule {

    interface IBase {
        on(eventName:string, handler:IHandler, context?:any):IBase;
        once(eventName:string, handler:IHandler, context?:any):IBase;
        off(eventName?:string, handler?:IHandler):IBase;

        listenTo(target:IBase, eventName:string, handler:IHandler, context?:any):IBase;
        listenToOnce(target:IBase, eventName:string, handler:IHandler, context?:any):IBase;
        stopListening(target?:IBase, eventName?:string, handler?:IHandler):IBase;

        trigger(eventName:string, args:Array<any>):IBase;

        onLoad(callback:Callback):IBase;
        loaded():IBase;
        onReady(callback:Callback):IBase;
        ready():IBase;

        onState(state:string, callback:Callback):IBase;
        setState(state:string):IBase;

        hasState(state:string):boolean;
        isLoaded():boolean;
    }

    interface Events {
        [key:string]:Array<HandlerData>;
    }

    interface States {
        [key:string]:boolean|Array<Callback>;
    }

    interface HandlerData {
        context: any;
        handler: IHandler;
        listenTo?: IBase;
    }

    interface IHandler {
        (a?, b?, c?, d?, e?):any;
    }

    interface Callback {
        ():void;
    }

}

declare class Base implements BaseModule.IBase {
    on(eventName:string, handler:BaseModule.IHandler, context?:any):BaseModule.IBase;
    once(eventName:string, handler:BaseModule.IHandler, context?:any):BaseModule.IBase;
    off(eventName?:string, handler?:BaseModule.IHandler):BaseModule.IBase;

    listenTo(target:BaseModule.IBase, eventName:string, handler:BaseModule.IHandler, context?:any):BaseModule.IBase;
    listenToOnce(target:BaseModule.IBase, eventName:string, handler:BaseModule.IHandler, context?:any):BaseModule.IBase;
    stopListening(target?:BaseModule.IBase, eventName?:string, handler?:BaseModule.IHandler):BaseModule.IBase;

    trigger(eventName:string, args:Array<any>):BaseModule.IBase;

    onLoad(callback:BaseModule.Callback):BaseModule.IBase;
    loaded():BaseModule.IBase;
    onReady(callback:BaseModule.Callback):BaseModule.IBase;
    ready():BaseModule.IBase;

    onState(state:string, callback:BaseModule.Callback):BaseModule.IBase;
    setState(state:string):BaseModule.IBase;

    hasState(state:string):boolean;
    isLoaded():boolean;
}