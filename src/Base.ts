/// <reference path="./interface.d.ts" />

class Base implements BaseModule.IBase {

    private events:BaseModule.Events;
    private outEvents:BaseModule.Events;
    private states:BaseModule.States;

    public on(eventName:string, handler:BaseModule.IHandler, context?:any):BaseModule.IBase {
        this.checkEventKey('events', eventName);
        this.addEvent('events', eventName, handler, context || this);
        return this;
    }

    public once(eventName:string, handler:BaseModule.IHandler, context?:any):BaseModule.IBase {
        this.checkEventKey('events', eventName);
        var self = this;
        this.addEvent('events', eventName,  function() {
            handler.apply(context || this, Array.prototype.slice.call(arguments));
            self.off(eventName, <BaseModule.IHandler>arguments.callee);
        }, this);
        return this;
    }

    public off(eventName?:string, handler?:BaseModule.IHandler):BaseModule.IBase {
        if (!eventName) {
            this.events = {};
            return this;
        }
        this.filterEvent('events', eventName, handler);
        return this;
    }

    public listenTo(target:BaseModule.IBase, eventName:string, handler:BaseModule.IHandler, context?:any):BaseModule.IBase {
        this.checkEventKey('outEvents', eventName);
        this.addEvent('outEvents', eventName, handler, this, target);
        target.on(eventName, handler, context);
        return this;
    }

    public listenToOnce(target:BaseModule.IBase, eventName:string, handler:BaseModule.IHandler, context?:any):BaseModule.IBase {
        this.checkEventKey('outEvents', eventName);
        var self = this;
        var onceHandler = function () {
            handler.apply(context || this, arguments);
            self.stopListening(target, eventName, <BaseModule.IHandler>arguments.callee);
        };
        this.listenTo(target, eventName, onceHandler);
        return this;
    }

    public stopListening(target?:BaseModule.IBase, eventName?:string, handler?:BaseModule.IHandler):BaseModule.IBase {
        if (!eventName) {
            Object.keys(this.outEvents).forEach((eventName) => {
                this.filterEvent('outEvents', eventName, handler, Base.removeCallback, target);
            });
            return this;
        }
        this.filterEvent('outEvents', eventName, handler, Base.removeCallback, target);
        return this;
    }

    public trigger(eventName:string, args?:Array<any>):BaseModule.IBase {
        Base.splitEventName(eventName).forEach((eventString:string, i:number) => {
            if (eventString in this.events) {
                var localArgs = Base.getEventsArgs(eventName, i).concat(args || []);
                this.events[eventString].forEach((handlerData:BaseModule.HandlerData) => {
                    handlerData.handler.apply(handlerData.context, localArgs.slice());
                });
            }
        });
        return this;
    }

    public onState(state:string, callback:BaseModule.Callback):BaseModule.IBase {
        this.checkStateKey(state);
        if (this.hasState(state)) {
            callback();
        } else {
            (<Array<BaseModule.Callback>>this.states[state]).push(callback);
        }
        return this;
    }

    public setState(state:string):BaseModule.IBase {
        this.checkStateKey(state);
        if (!this.hasState(state) && this.states[state]) {
            (<Array<BaseModule.Callback>>this.states[state]).forEach((callback:BaseModule.Callback) => {
                callback();
            });
            this.states[state] = true;
        }
        return this;
    }

    public onLoad(callback:BaseModule.Callback):BaseModule.IBase {
        return this.onState('loaded', callback);
    }

    public loaded():BaseModule.IBase {
        return this.setState('loaded');
    }

    public isLoaded():boolean {
        return this.hasState('loaded');
    }

    public onReady(callback:BaseModule.Callback):BaseModule.IBase {
        return this.onState('ready', callback);
    }

    public ready():BaseModule.IBase {
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

    private addEvent(eventKey:string, eventName:string, handler:BaseModule.IHandler, context:any, listenTo?:BaseModule.IBase):void {
        this[eventKey][eventName].push({
            handler: handler,
            context: context,
            listenTo: listenTo || null
        });
    }

    private filterEvent(eventKey, eventName:string, handler?:BaseModule.IHandler, callback?:(handlerData:BaseModule.HandlerData, eventName:string)=>void, target?:BaseModule.IBase):void {
        if (this[eventKey][eventName]) {
            this[eventKey][eventName] = this[eventKey][eventName].filter((handlerData:BaseModule.HandlerData) => {
                var needRemove = (!target && (!handler || handler == handlerData.handler)) || ((target == handlerData.listenTo) && (!handler || handler == handlerData.handler));
                if (callback && needRemove) {
                    callback(handlerData, eventName);
                }
                return !needRemove;
            });
        }
    }

    private static removeCallback(handlerData:BaseModule.HandlerData, evenName:string):void {
        handlerData.listenTo.off(evenName, handlerData.handler);
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
