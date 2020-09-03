import Emitter from './Emitter';
import { Subject } from 'rxjs';

class SystemEmitter {
    private timerId?: NodeJS.Timeout | null;
    private systemType: string;
    private canTimerBeRun: boolean;

    constructor(systemType: string, valueToUpdate: Subject<string>) {
        this.canTimerBeRun = true;
        this.timerId = null;
        this.systemType = systemType;

        Emitter.on(systemType, (value: string) => {
            valueToUpdate.next(value);
        })
    }

    public start = (): void => {
        this.canTimerBeRun = true;
        this.startEmitData();
    }

    public stop = (): void => {
        this.canTimerBeRun = false;

        if (!this.timerId) {
            return;
        }

        clearTimeout(this.timerId);
    }

    private startEmitData = () => {
        if (!this.canTimerBeRun) {
            return;
        }

        const delay = this.getTimeoutDelay();

        this.timerId = setTimeout(
            () => {
                const randomString = this.getRandomString();

                Emitter.emit(this.systemType, randomString);

                this.startEmitData();
            }, delay

        )
    }

    private getRandomString = (): string => {
        return this.getRandomNumber(100, 200).toString();
    }

    private getTimeoutDelay = (): number => {
        return this.getRandomNumber(100, 2000);
    }

    private getRandomNumber = (min: number, max: number): number => {
        return Math.floor(Math.random() * Math.floor(max)) + min;
    }
}

export default SystemEmitter;