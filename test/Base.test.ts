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

    describe('off', () => {

        it('off fake event', () => { 
            let base = new Base();
            base.off('some');
        });

        it('off by callback', () => {

            let base = new Base();
            let c1 = 0;
            let c2 = 0;
            let h1 = () => c1++;
            let h2 = () => c2++;

            base.on('some', h1);
            base.on('some', h2);

            base.trigger('some');
            base.off('some', h1);
            base.trigger('some');
            expect(c1).to.be(1);
            expect(c2).to.be(2);

        });

        it('off by eventName', () => {

            let base = new Base();
            let c1 = 0;
            let c2 = 0;
            let h1 = () => c1++;
            let h2 = () => c2++;

            base.on('some', h1);
            base.on('some', h2);

            base.trigger('some');
            base.off('some');
            base.trigger('some');
            expect(c1).to.be(1);
            expect(c2).to.be(1);

        });

        it('off all', () => {

            let base = new Base();
            let c1 = 0;
            let c2 = 0;
            let h1 = () => c1++;
            let h2 = () => c2++;

            base.on('some1', h1);
            base.on('some2', h2);

            base.trigger('some1');
            base.trigger('some2');
            base.off();
            base.trigger('some1');
            base.trigger('some2');
            expect(c1).to.be(1);
            expect(c2).to.be(1);

        });

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

    it('off once', () => {

        let base = new Base();
        let ok = true;
        let handler = () => {
            ok = false;
        };
        base.once('some', handler);
        base.off('some', handler);
        base.trigger('some');
        base.trigger('some');
        expect(ok).to.be(true);

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

    it('trigger with params', () => {

        let base = new Base();
        let params = ['1', 2, 'some'];
        let ok = false;

        base.on('some', (...args: Array<any>) => {
            ok = params.every((param: any, i: number) => param === args[i]);
        });
        base.trigger('some', params);
        expect(ok).to.be(true);
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

        it('listenTo whit params', () => {

            let Out = new Base();
            let In = new Base();
            let ok = false;
            let params = ['1', 2, 'some'];

            In.listenTo(Out, 'some', (...args: Array<any>) => {
                ok = params.every((param: any, i: number) => param === args[i]);
            });

            Out.trigger('some', params);
            expect(ok).to.be(true);

        });

        it('listenToOnce', () => {

            let Out = new Base();
            let In = new Base();
            let ok = 0;
            let okParams = false;
            let params = ['1', 2, 'some'];

            In.listenToOnce(Out, 'some', (...args: Array<any>) => {
                ok++;
                okParams = params.every((param: any, i: number) => param === args[i]); 
            });

            Out.trigger('some', params);
            Out.trigger('some', params);
            expect(ok).to.be(1);
            expect(okParams).to.be(true);

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

        describe('presets', () => {

            [
                {
                    check: 'isLoaded',
                    on: 'onLoad',
                    run: 'loaded'
                },
                {
                    check: 'isReady',
                    on: 'onReady',
                    run: 'ready'
                }
            ].forEach((testData) => {

                it(testData.check, () => {

                    let first = null;
                    let second = null;
                    let base = new Base();

                    first = base[testData.check]();
                    base[testData.run]();
                    second = base[testData.check]();

                    expect(first).to.be(false);
                    expect(second).to.be(true);

                });

                it(testData.run, () => {

                    let base = new Base();
                    let ok = false;

                    base[testData.on](() => {
                        ok = true;
                    });

                    base[testData.run]();
                    expect(ok).to.be(true);

                });

                it(`${testData.run} before callback`, () => {

                    let base = new Base();
                    let ok = false;

                    base[testData.run]();

                    base[testData.on](() => {
                        ok = true;
                    });

                    expect(ok).to.be(true);

                });

            });
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

        it('duble set state', () => {

            let base = new Base();
            let ok = 0;

            base.setState('some');

            base.onState('some', () => {
                ok++;
            });

            base.setState('some');

            expect(ok).to.be(1);

        });

    });

});

