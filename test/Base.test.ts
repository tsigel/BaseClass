/// <reference path="../typings/tsd.d.ts" />

import Base = require('../src/Base');
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
        var ok = 0;
        base.on('User', () => {
            ok++;
        });
        base.on('User:change', () => {
            ok++;
        });
        base.trigger('User:change');
        expect(ok).to.be(2);

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

        it('loaded', () => {

            var base = new Base();
            var ok = false;

            base.onLoad(() => {
                ok = true;
            });

            base.loaded();
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

    });

});

