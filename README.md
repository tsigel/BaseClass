# BaseClass
Base class to extend. Like backbone events.

Installation
------------

    npm install ts-base-class --save

------------

### Interface path

    /// <reference types="ts-base-class" />

#### For configure project:

    npm install typescript -g
    npm install tsd -g
    npm run init 

------------

#### For start test: 

    npm run test

Methods
-------
- [on](#on)
- [once](#once)
- [off](#off)
- [listenTo](#listenTo)
- [listenToOnce](#listenToOnce)
- [stopListening](#stopListening)
- [trigger](#trigger)
- [onLoad](#onLoad)
- [loaded](#loaded)
- [onReady](#onReady)
- [ready](#ready)
- [onState](#onState)
- [setState](#setState)
- [hasState](#hasState)
- [isLoaded](#isLoaded)



* on(eventName:string, handler:IHandler, context?:any):Base;
* once(eventName:string, handler:IHandler, context?:any):Base;
* off(eventName?:string, handler?:IHandler):Base;
* listenTo(target:Base, eventName:string, handler:IHandler, context?:any):Base;
* listenToOnce(target:Base, eventName:string, handler:IHandler, context?:any):Base;
* stopListening(target?:Base, eventName?:string, handler?:IHandler):Base;
* trigger(eventName:string, args?:Array<any>):Base;
* onLoad(callback:Callback):Base;
* loaded():Base;
* onReady(callback:Callback):Base;
* ready():Base;
* onState(state:string, callback:Callback):Base;
* setState(state:string):Base;
* hasState(state:string):boolean;
* isLoaded():boolean;

-----------
### Example

```typescript

     /// <reference types="ts-base-class" />
     import {Base} from 'ts-base-class';
     
     class MyClass extends Base {
        //...
        
     }
     
     var $class = new MyClass();
     
     $class.on("Some:change", function (arg) {
        console.log(this instanceof MyClass); //true
        console.log(arg); //1
     });
     
     $class.on("Some", function (state:string, arg) {
        console.log(this instanceof MyClass); //true
        console.log(state); //"change"
        console.log(arg); //1
     });
     
     $class.trigger("Some:change", [1]);

```
    
------------
### Version: 2.0.2
------------
License
-------

Licensed under ISC
