import '@testing-library/jest-dom/extend-expect';
import UniqueObservable from '../source/utils/UniqueObservable';
import { Subject } from 'rxjs';

test('return object contains 3 fields', (done) => {
    const observable = new Subject<string[]>();
    observable.subscribe((value) => {
        uniqueObservable.unsubscribe();
        expect(value.length).toBe(3);
        done();
    })

    const uniqueObservable = new UniqueObservable(observable);

    uniqueObservable.subscribe();
});

test('system shows N/A if message wasn`t emitted more than 1000 ms', (done) => {
    let count = 0;
    let naExists = false;

    const observable = new Subject<string[]>();
    observable.subscribe((value) => {
        if (++count > 2) {
            console.log(value);
            uniqueObservable.unsubscribe();

            for (const [, valueField] of Object.entries(value)) {
                if (valueField === 'N/A') {
                    naExists = true;
                    break;
                }
            }

            if (naExists) {
                done();
            } else {
                throw new Error("Test failed. visible object didn't show N/A");
            }
        }
    })

    const uniqueObservable = new UniqueObservable(observable);
    const mockMath = Object.create(global.Math);
    mockMath.floor = () => 1500;
    global.Math = mockMath;

    uniqueObservable.subscribe()
});