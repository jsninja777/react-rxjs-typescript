import { Subject } from 'rxjs';
import SystemEmitter from '../source/utils/SystemEmitter';

import '@testing-library/jest-dom/extend-expect';

test('returned value shouldn`t be null', (done) => {
    const observable = new Subject<string>();
    observable.subscribe((value) => {
        emitter.stop();
        expect(value).toBeDefined();
        expect(value).not.toBeNull();
        done();
    })

    const emitter = new SystemEmitter('anyString', observable);
    emitter.start();
});

test('emit system data in 100-2000 ms', (done) => {
    const observable = new Subject<string>();
    observable.subscribe((value) => {
        emitter.stop();
        const endTime = new Date().getTime();
        const delay = endTime - startTime;
        expect(delay).toBeLessThanOrEqual(2000);
        expect(delay).toBeGreaterThanOrEqual(100);
        done();
    })

    const emitter = new SystemEmitter("randomData", observable);
    const startTime = new Date().getTime();
    emitter.start();
});

test('SystemEmitter: after stop there shouldn`t be any message', (done) => {
    let timerId: NodeJS.Timeout | null = null;

    const observable = new Subject<string>();
    observable.subscribe(() => {
        if (timerId) {
            clearTimeout(timerId);
        }

        throw new Error("Test failed. Emitter didn't stop");
    })

    const emitter = new SystemEmitter("type", observable);
    emitter.start();

    setTimeout(() => {
        emitter.stop();

        timerId = setTimeout(() => {
            expect(1).toBe(1);
            done();
        }, 2000);
    }, 90);
});