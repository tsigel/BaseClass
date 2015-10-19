/// <reference path="./interface.d.ts" />

class Base implements IBase {

    private events:Events = {};
    private outEvents:Events;
    private states:States;

    public on(eventName:string, handler:IHandler, context?:any):IBase {
        this.checkEventKey('events', eventName);
        this.addEvent('events', eventName, handler, context || this);
        return this;
    }

    public once(eventName:string, handler:IHandler, context?:any):IBase {
        this.checkEventKey('events', eventName);
        var self = this;
        this.addEvent('events', eventName,  function() {
            handler.apply(context || this, Array.prototype.slice.call(arguments));
            self.off(eventName, <IHandler>arguments.callee);
        }, this);
        return this;
    }

    public off(eventName?:string, handler?:IHandler):IBase {
        if (!eventName) {
            this.events = {};
            return this;
        }
        this.filterEvent('events', eventName, handler);
        return this;
    }

    public listenTo(target:IBase, eventName:string, handler:IHandler, context?:any):IBase {
        this.checkEventKey('outEvents', eventName);
        this.addEvent('outEvents', eventName, handler, this, target);
        target.on(eventName, handler, context);
        return this;
    }

    public listenToOnce(target:IBase, eventName:string, handler:IHandler, context?:any):IBase {
        this.checkEventKey('outEvents', eventName);
        var self = this;
        var onceHandler = function () {
            handler.apply(context || this, arguments);
            self.stopListening(target, eventName, <IHandler>arguments.callee);
        };
        this.listenTo(target, eventName, onceHandler);
        return this;
    }

    public stopListening(target?:IBase, eventName?:string, handler?:IHandler):IBase {
        if (!eventName) {
            Object.keys(this.outEvents).forEach((eventName) => {
                this.filterEvent('outEvents', eventName, handler, Base.removeCallback, target);
            });
            return this;
        }
        this.filterEvent('outEvents', eventName, handler, Base.removeCallback, target);
        return this;
    }

    public trigger(eventName:string, args?:Array<any>):IBase {
        Base.splitEventName(eventName).forEach((eventString:string, i:number) => {
            if (eventString in this.events) {
                var localArgs = Base.getEventsArgs(eventName, i).concat(args || []);
                this.events[eventString].slice().forEach((handlerData:HandlerData) => {
                    handlerData.handler.apply(handlerData.context, localArgs.slice());
                });
            }
        });
        return this;
    }

    public onState(state:string, callback:Callback):IBase {
        this.checkStateKey(state);
        if (this.hasState(state)) {
            callback();
        } else {
            (<Array<Callback>>this.states[state]).push(callback);
        }
        return this;
    }

    public setState(state:string):IBase {
        this.checkStateKey(state);
        if (!this.hasState(state) && this.states[state]) {
            (<Array<Callback>>this.states[state]).forEach((callback:Callback) => {
                callback();
            });
            this.states[state] = true;
        }
        return this;
    }

    public onLoad(callback:Callback):IBase {
        return this.onState('loaded', callback);
    }

    public loaded():IBase {
        return this.setState('loaded');
    }

    public isLoaded():boolean {
        return this.hasState('loaded');
    }

    public onReady(callback:Callback):IBase {
        return this.onState('ready', callback);
    }

    public ready():IBase {
        return this.setState('ready');
    }

    public hasState(state:string):boolean {
        return this.states[state] && typeof this.states[state] == 'boolean';
    }

    private checkEventKey(eventKey:string, eventName:string):void {
        if (!this[eventKey]) {
            this[eventKey] = {};
        }
        if (!this[eventKey][eventName]) {
            this[eventKey][eventName] = [];
        }
    }

    private checkStateKey(state:string):void {
        this.checkEventKey('states', state);
    }

    private addEvent(eventKey:string, eventName:string, handler:IHandler, context:any, listenTo?:IBase):void {
        this[eventKey][eventName].push({
            handler: handler,
            context: context,
            listenTo: listenTo || null
        });
    }

    private filterEvent(eventKey, eventName:string, handler?:IHandler, callback?:(handlerData:HandlerData, eventName:string)=>void, target?:IBase):void {
        if (this[eventKey][eventName]) {
            this[eventKey][eventName] = this[eventKey][eventName].filter((handlerData:HandlerData) => {
                var needRemove = Base.isNeedRemove(target, handler, handlerData);
                if (callback && needRemove) {
                    callback(handlerData, eventName);
                }
                return !needRemove;
            });
        }
    }

    private static removeCallback(handlerData:HandlerData, evenName:string):void {
        handlerData.listenTo.off(evenName, handlerData.handler);
    }

    private static isNeedRemove(target:IBase, handler:IHandler, handlerData:HandlerData):boolean {
        if (target) {
            return target == handlerData.listenTo && (!handler || this.isRemoveByHandler(handler, handlerData));
        } else {
            return (!handler || this.isRemoveByHandler(handler, handlerData));
        }
    }

    private static isRemoveByHandler(handler:IHandler, handlerData:HandlerData):boolean {
        return handler == handlerData.handler;
    }

    private static splitEventName(eventName:string):Array<string> {
        var words = eventName.split(':');
        var result = [words.shift()];
        return words.reduce((result:Array<string>, word:string) => {
            result.push(result[result.length - 1] + ":" + word);
            return result;
        }, result);
    }

    private static getEventsArgs(event:string, index:number):Array<string> {
        return  event.split(":").slice(index + 1);
    }

}

declare var module:any;
(function (root, Base) {
    if(typeof root['define'] === "function" && root['define'].amd) {
        root['define']([], () => Base);
    } else if(typeof module === "object" && module.exports) {
        module.exports = Base;
    } else {
        root['Base'] = Base;
    }
})(this, Base);
