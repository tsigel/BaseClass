import { IBase, IHandler, ICallback } from './interface';


type TPrivateKeys = '__events' | '__outEvents' | '__states';

export class Base implements IBase {

    private __events: Events = {};
    private __outEvents: Events;
    private __states: IStates = {};


    public on(eventName: string, handler: IHandler, context?: any): IBase {
        this.checkEventKey('__events', eventName);
        this.addEvent({
            eventKey: '__events',
            eventName: eventName,
            handler: handler,
            context: context || this
        });
        return this;
    }

    public once(eventName: string, handler: IHandler, context?: any): IBase {
        this.checkEventKey('__events', eventName);
        this.addEvent({
            eventKey: '__events',
            eventName: eventName,
            handler: handler,
            context: context || this,
            isOnce: true
        });
        return this;
    }

    public off(eventName?: string, handler?: IHandler): IBase {
        if (!eventName) {
            this.__events = {};
            return this;
        }
        this.filterEvent({
            eventKey: '__events',
            eventName: eventName,
            handler: handler
        });
        return this;
    }

    public listenTo(target: IBase, eventName: string, handler: IHandler, context?: any): IBase {
        this.checkEventKey('__outEvents', eventName);
        this.addEvent({
            eventKey: '__outEvents',
            eventName: eventName,
            handler: handler,
            context: context,
            listenTo: target
        });
        target.on(eventName, handler, context);
        return this;
    }

    public listenToOnce(target: IBase, eventName: string, handler: IHandler, context?: any): IBase {
        this.checkEventKey('__outEvents', eventName);
        let proxyHandler = (...args: Array<any>) => {
            handler.apply(context || this, args);
            this.stopListening(target, eventName, handler);
        };
        this.addEvent({
            eventKey: '__outEvents',
            eventName: eventName,
            handler: handler,
            proxyHandler: proxyHandler,
            context: context,
            listenTo: target,
            isOnce: true
        });
        target.once(eventName, proxyHandler, context);
        return this;
    }

    public stopListening(target?: IBase, eventName?: string, handler?: IHandler): IBase {
        if (!eventName) {
            Object.keys(this.__outEvents).forEach((subName: string) => {
                this.filterEvent({
                    eventKey: '__outEvents',
                    eventName: subName,
                    handler: handler,
                    callback: Base.removeCallback,
                    target: target
                });
            });
            return this;
        }
        this.filterEvent({
            eventKey: '__outEvents',
            eventName: eventName,
            handler: handler,
            callback: Base.removeCallback,
            target: target
        });
        return this;
    }

    public trigger(eventName: string, args?: Array<any>): IBase {
        Base.splitEventName(eventName).forEach((eventString: string, i: number) => {
            if (eventString in this.__events) {
                let localArgs = Base.getEventsArgs(eventName, i).concat(args || []);
                this.__events[eventString].slice().forEach((handlerData: IHandlerData) => {
                    handlerData.handler.apply(handlerData.context, localArgs.slice());
                    if (handlerData.isOnce) {
                        this.off(eventString, handlerData.handler);
                    }
                });
            }
        });
        return this;
    }

    public onState(state: string, callback: ICallback): IBase {
        this.checkStateKey(state);
        if (this.hasState(state)) {
            callback();
        } else {
            (<Array<ICallback>>this.__states[state]).push(callback);
        }
        return this;
    }

    public setState(state: string): IBase {
        this.checkStateKey(state);
        if (!this.hasState(state) && this.__states[state]) {
            (<Array<ICallback>>this.__states[state]).forEach((callback: ICallback) => {
                callback();
            });
            this.__states[state] = true;
        }
        return this;
    }

    public onLoad(callback: ICallback): IBase {
        return this.onState('loaded', callback);
    }

    public loaded(): IBase {
        return this.setState('loaded');
    }

    public isLoaded(): boolean {
        return this.hasState('loaded');
    }

    public onReady(callback: ICallback): IBase {
        return this.onState('ready', callback);
    }

    public ready(): IBase {
        return this.setState('ready');
    }

    public isReady(): boolean {
        return this.hasState('ready');
    }

    public hasState(state: string): boolean {
        return !!(this.__states[state] && typeof this.__states[state] === 'boolean');
    }

    private checkEventKey(eventKey: TPrivateKeys, eventName: string): void {
        if (!this[eventKey]) {
            this[eventKey] = {};
        }
        if (!this[eventKey][eventName]) {
            this[eventKey][eventName] = [];
        }
    }

    private checkStateKey(state: string): void {
        this.checkEventKey('__states', state);
    }

    private addEvent(options: IAddEventOptions): void {
        this[options.eventKey][options.eventName].push({
            handler: options.handler,
            context: options.context,
            listenTo: options.listenTo || null,
            isOnce: options.isOnce
        });
    }

    private filterEvent(options: IFilterEventOptions): void {
        if (this[options.eventKey][options.eventName]) {
            this[options.eventKey][options.eventName] =
                this[options.eventKey][options.eventName].filter((handlerData: IHandlerData) => {
                    let needRemove = Base.isNeedRemove(options.target, options.handler, handlerData);
                    if (options.callback && needRemove) {
                        options.callback(handlerData, options.eventName);
                    }
                    return !needRemove;
                });
        }
    }

    private static removeCallback(handlerData: IHandlerData, evenName: string): void {
        handlerData.listenTo.off(evenName, handlerData.handler);
    }

    private static isNeedRemove(target: IBase, handler: IHandler, handlerData: IHandlerData): boolean {
        if (target) {
            return target === handlerData.listenTo && (!handler || this.isRemoveByHandler(handler, handlerData));
        } else {
            return (!handler || this.isRemoveByHandler(handler, handlerData));
        }
    }

    private static isRemoveByHandler(handler: IHandler, handlerData: IHandlerData): boolean {
        return handler === handlerData.handler || handler === handlerData.proxyHandler;
    }

    private static splitEventName(eventName: string): Array<string> {
        let words = eventName.split(':');
        let result = [words.shift()];
        return words.reduce((reduseData: Array<string>, word: string) => {
            reduseData.push(reduseData[reduseData.length - 1] + ':' + word);
            return reduseData;
        }, result);
    }

    private static getEventsArgs(event: string, index: number): Array<string> {
        return event.split(':').slice(index + 1);
    }

}

interface Events {
    [key: string]: Array<IHandlerData>;
}

interface IFilterEventOptions {
    eventKey: TPrivateKeys;
    eventName?: string;
    handler?: IHandler;
    callback?: IFilterCallback;
    target?: IBase;
}

interface IAddEventOptions {
    eventKey: TPrivateKeys;
    eventName: string;
    handler: IHandler;
    proxyHandler?: IHandler;
    context: any;
    listenTo?: IBase;
    isOnce?: boolean;
}

interface IFilterCallback {
    (handlerData: IHandlerData, eventName: string): void;
}

interface IHandlerData {
    context: any;
    handler: IHandler;
    listenTo?: IBase;
    isOnce?: boolean;
    proxyHandler?: IHandler;
}

interface IStates {
    [key: string]: boolean | Array<ICallback>;
}
