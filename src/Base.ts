import {IBase, Events, IHandler, States, Callback, HandlerData} from './interface';

export class Base implements IBase {

    private events: Events;
    private outEvents: Events;
    private states: States;


    public on(eventName: string, handler: IHandler, context?: any): IBase {
        this.checkEventKey('events', eventName);
        this.addEvent('events', eventName, handler, context || this);
        return this;
    }

    public once(eventName: string, handler: IHandler, context?: any): IBase {
        this.checkEventKey('events', eventName);
        let proxyHandler = (...args: Array<any>) => {
            handler.apply(context || this, Array.prototype.slice.call(args));
            this.off(eventName, proxyHandler);
        };
        this.addEvent('events', eventName, proxyHandler, this);
        return this;
    }

    public off(eventName?: string, handler?: IHandler): IBase {
        if (!eventName) {
            this.events = {};
            return this;
        }
        this.filterEvent({
            eventKey: 'events',
            eventName: eventName,
            handler: handler
        });
        return this;
    }

    public listenTo(target: IBase, eventName: string, handler: IHandler, context?: any): IBase {
        this.checkEventKey('outEvents', eventName);
        this.addEvent('outEvents', eventName, handler, this, target);
        target.on(eventName, handler, context);
        return this;
    }

    public listenToOnce(target: IBase, eventName: string, handler: IHandler, context?: any): IBase {
        this.checkEventKey('outEvents', eventName);
        let onceHandler = (...args: Array<any>) => {
            handler.apply(context || this, args);
            this.stopListening(target, eventName, onceHandler);
        };
        this.listenTo(target, eventName, onceHandler);
        return this;
    }

    public stopListening(target?: IBase, eventName?: string, handler?: IHandler): IBase {
        if (!eventName) {
            Object.keys(this.outEvents).forEach((subName: string) => {
                this.filterEvent({
                    eventKey: 'outEvents',
                    eventName: subName,
                    handler: handler,
                    callback: Base.removeCallback,
                    target: target
                });
            });
            return this;
        }
        this.filterEvent({
            eventKey: 'outEvents',
            eventName: eventName,
            handler: handler,
            callback: Base.removeCallback,
            target: target
        });
        return this;
    }

    public trigger(eventName: string, args?: Array<any>): IBase {
        Base.splitEventName(eventName).forEach((eventString: string, i: number) => {
            if (eventString in this.events) {
                let localArgs = Base.getEventsArgs(eventName, i).concat(args || []);
                this.events[eventString].slice().forEach((handlerData: HandlerData) => {
                    handlerData.handler.apply(handlerData.context, localArgs.slice());
                });
            }
        });
        return this;
    }

    public onState(state: string, callback: Callback): IBase {
        this.checkStateKey(state);
        if (this.hasState(state)) {
            callback();
        } else {
            (<Array<Callback>>this.states[state]).push(callback);
        }
        return this;
    }

    public setState(state: string): IBase {
        this.checkStateKey(state);
        if (!this.hasState(state) && this.states[state]) {
            (<Array<Callback>>this.states[state]).forEach((callback: Callback) => {
                callback();
            });
            this.states[state] = true;
        }
        return this;
    }

    public onLoad(callback: Callback): IBase {
        return this.onState('loaded', callback);
    }

    public loaded(): IBase {
        return this.setState('loaded');
    }

    public isLoaded(): boolean {
        return this.hasState('loaded');
    }

    public onReady(callback: Callback): IBase {
        return this.onState('ready', callback);
    }

    public ready(): IBase {
        return this.setState('ready');
    }

    public hasState(state: string): boolean {
        return this.states[state] && typeof this.states[state] === 'boolean';
    }

    private checkEventKey(eventKey: string, eventName: string): void {
        if (!this[eventKey]) {
            this[eventKey] = {};
        }
        if (!this[eventKey][eventName]) {
            this[eventKey][eventName] = [];
        }
    }

    private checkStateKey(state: string): void {
        this.checkEventKey('states', state);
    }

    private addEvent(eventKey: string, eventName: string, handler: IHandler, context: any, listenTo?: IBase): void {
        this[eventKey][eventName].push({
            handler: handler,
            context: context,
            listenTo: listenTo || null
        });
    }

    private filterEvent(options?: IFilterEventOptions): void {
        options = options || {};
        if (this[options.eventKey][options.eventName]) {
            this[options.eventKey][options.eventName] =
                this[options.eventKey][options.eventName].filter((handlerData: HandlerData) => {
                    let needRemove = Base.isNeedRemove(options.target, options.handler, handlerData);
                    if (options.callback && needRemove) {
                        options.callback(handlerData, options.eventName);
                    }
                    return !needRemove;
                });
        }
    }

    private static removeCallback(handlerData: HandlerData, evenName: string): void {
        handlerData.listenTo.off(evenName, handlerData.handler);
    }

    private static isNeedRemove(target: IBase, handler: IHandler, handlerData: HandlerData): boolean {
        if (target) {
            return target === handlerData.listenTo && (!handler || this.isRemoveByHandler(handler, handlerData));
        } else {
            return (!handler || this.isRemoveByHandler(handler, handlerData));
        }
    }

    private static isRemoveByHandler(handler: IHandler, handlerData: HandlerData): boolean {
        return handler === handlerData.handler;
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

interface IFilterEventOptions {
    eventKey?: string;
    eventName?: string;
    handler?: IHandler;
    callback?: IFilterCallback;
    target?: IBase;
}

interface IFilterCallback {
    (handlerData: HandlerData, eventName: string): void;
}
