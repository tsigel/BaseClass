/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../src/interface.d.ts" />

import { Base } from '../src/Base';
/* tslint:disable */
import expect = require('expect.js');
/* tslint:enable */

describe('base', () => {

    it('on', () => {

        let base = new Base();
        let ok = false;
        base.on('some', () => {
            ok = true;
        });
        base.trigger('some');
        expect(ok).to.be(true);

    });

    it('off', () => {

        let base = new Base();
        let ok = 0;
        base.on('some', () => {
            ok++;
        });
        base.trigger('some');
        base.off('some');
        base.trigger('some');
        expect(ok).to.be(1);

    });

    it('once', () => {

        let base = new Base();
        let ok = 0;
        base.once('some', () => {
            ok++;
        });
        base.trigger('some');
        base.trigger('some');
        expect(ok).to.be(1);

    });

    it('trigger name space', () => {

        let base = new Base();
        let hasNames = false;
        let ok = 0;
        base.on('User', function (): void {
            ok++;
            if (arguments.length === 1 && arguments[0] === 'change') {
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

        let base = new Base();
        base.trigger('User:change', [true]);
        expect(true).to.be(true);

    });

    it('trigger arguments', () => {

        let base = new Base();
        let ok = false;
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

            let Out = new Base();
            let In = new Base();
            let ok = false;

            In.listenTo(Out, 'some', () => {
                ok = true;
            });

            Out.trigger('some');
            expect(ok).to.be(true);

        });

        it('listenToOnce', () => {

            let Out = new Base();
            let In = new Base();
            let ok = 0;

            In.listenToOnce(Out, 'some', () => {
                ok++;
            });

            Out.trigger('some');
            Out.trigger('some');
            expect(ok).to.be(1);

        });

        it('stopListening', () => {

            let Out = new Base();
            let In = new Base();
            let ok = 0;

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

            let first = null;
            let second = null;
            let base = new Base();

            first = base.isLoaded();
            base.loaded();
            second = base.isLoaded();

            expect(first).to.be(false);
            expect(second).to.be(true);

        });

        it('loaded', () => {

            let base = new Base();
            let ok = false;

            base.onLoad(() => {
                ok = true;
            });

            base.loaded();
            expect(ok).to.be(true);
        });

        it('loaded before callback', () => {

            let base = new Base();
            let ok = false;

            base.loaded();

            base.onLoad(() => {
                ok = true;
            });

            expect(ok).to.be(true);
        });

        it('custom', () => {

            let base = new Base();
            let ok = false;

            base.onState('some', () => {
                ok = true;
            });

            base.setState('some');
            expect(ok).to.be(true);
        });

        it('custom before callback', () => {

            let base = new Base();
            let ok = false;

            base.setState('some');

            base.onState('some', () => {
                ok = true;
            });

            expect(ok).to.be(true);
        });


    });

});

