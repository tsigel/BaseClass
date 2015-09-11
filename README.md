# BaseClass
Base class to extend. Like backbone events.

Installation
------------

    npm install ts-base-class --save

------------

### Interface path

    <reference path="PATH-TO-ROOT/node_modules/ts-base-class/src/interface.d.ts">

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

### on()

**on(eventName, handler, [context])

### once()

**once(eventName, handler, [context])

### off()

**off([eventName], [handler])

### listenTo()

**listenTo(toListen, eventName, handler, [context])


-----------
### Example

     <reference path="PATH-TO-ROOT/node_modules/ts-base-class/src/interface.d.ts">
     import Base = require('ts-base-class');
     
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
     

------------
### Version: 1.0.8
------------
License
-------

Licensed under MIT