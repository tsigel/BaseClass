/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../src/interface.d.ts" />

interface IBaseClass {
    new ():IBase;
}

var Base:IBaseClass = require('../build/Base.min');
import expect = require('expect.js');

describe('base', () => {

    it('on', () => {

        var base = new Base();
        var ok = false;
        base.on('some', () => {
            ok = true;
        });
        base.trigger('some');
        expect(ok).to.be(true);

    });

    it('off', () => {

        var base = new Base();
        var ok = 0;
        base.on('some', () => {
            ok++;
        });
        base.trigger('some');
        base.off('some');
        base.trigger('some');
        expect(ok).to.be(1);

    });

    it('once', () => {

        var base = new Base();
        var ok = 0;
        base.once('some', () => {
            ok++;
        });
        base.trigger('some');
        base.trigger('some');
        expect(ok).to.be(1);

    });

    it('trigger name space', () => {

        var base = new Base();
        var hasNames = false;
        var ok = 0;
        base.on('User', function () {
            ok++;
            if (arguments.length == 1 && arguments[0] == "change") {
                hasNames = true;
            }
        });
        base.on('User:change', () => {
            ok++;
        });
        base.trigger('User:change');
        expect(ok).to.be(2);
        expect(hasNames).to.be(true);

    });

    it('trigger whisout add', () => {

        var base = new Base();
        base.trigger('User:change', [true]);
        expect(true).to.be(true);

    });

    it('trigger arguments', () => {

        var base = new Base();
        var ok = false;
        base.on('User:change', (some) => {
            if (some) {
                ok = true;
            }
        });
        base.trigger('User:change', [true]);
        expect(ok).to.be(true);

    });

    describe('out events', () => {

        it('listenTo', () => {

            var Out = new Base();
            var In = new Base();
            var ok = false;

            In.listenTo(Out, 'some', () => {
                ok = true;
            });

            Out.trigger('some');
            expect(ok).to.be(true);

        });

        it('listenToOnce', () => {

            var Out = new Base();
            var In = new Base();
            var ok = 0;

            In.listenToOnce(Out, 'some', () => {
                ok++;
            });

            Out.trigger('some');
            Out.trigger('some');
            expect(ok).to.be(1);

        });

        it('stopListening', () => {

            var Out = new Base();
            var In = new Base();
            var ok = 0;

            In.listenTo(Out, 'some', () => {
                ok++;
            });

            Out.trigger('some');
            In.stopListening();
            Out.trigger('some');
            expect(ok).to.be(1);

        });

    });

    describe('states', () => {

        it('isLoaded', () => {

            var first = false;
            var second = false;
            var base = new Base();

            first = !base.isLoaded();
            base.loaded();
            second = base.isLoaded();

            expect(first).to.be(true);
            expect(second).to.be(true);

        });

        it('loaded', () => {

            var base = new Base();
            var ok = false;

            base.onLoad(() => {
                ok = true;
            });

            base.loaded();
            expect(ok).to.be(true);
        });

        it('loaded before callback', () => {

            var base = new Base();
            var ok = false;

            base.loaded();

            base.onLoad(() => {
                ok = true;
            });

            expect(ok).to.be(true);
        });

        it('custom', () => {

            var base = new Base();
            var ok = false;

            base.onState('some', () => {
                ok = true;
            });

            base.setState('some');
            expect(ok).to.be(true);
        });

        it('custom before callback', () => {

            var base = new Base();
            var ok = false;

            base.setState('some');

            base.onState('some', () => {
                ok = true;
            });

            expect(ok).to.be(true);
        });


    });

});

