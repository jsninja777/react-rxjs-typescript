import { Subject, combineLatest } from "rxjs";
import SystemEmitter from "./SystemEmitter";

class ObservableForDashboard {
    private NA: string = 'N/A';
    private returnObject: Subject<string[]>;
    private systemsSubjects: Subject<string>[];
    private emittersArray: SystemEmitter[] = [];
    private timers: { [key: string]: NodeJS.Timeout } = {};
    private previousValues: string[];
    private lastSentDate: number = new Date().getTime();

    constructor(valueToUpdate: Subject<string[]>) {
        this.systemsSubjects = [new Subject<string>(), new Subject<string>(), new Subject<string>()]
        this.returnObject = valueToUpdate;
        this.previousValues = ['', '', ''];

        this.listenToSystems();
    }

    public subscribe = (): ObservableForDashboard => {
        this.systemsSubjects.forEach((systemSubject, index) => {
            this.runEmitter(index.toString(), systemSubject);
        })

        return this;
    }

    public unsubscribe = () => {
        this.emittersArray.forEach((emitter) => emitter.stop);
        this.emittersArray.length = 0;

        Object.entries(this.timers).filter(timerId => !!timerId).forEach(([, timerId]) => clearTimeout(timerId));
    }

    private runEmitter = (type: string, valueToUpdate: Subject<string>) => {
        const emitter = new SystemEmitter(type, valueToUpdate);
        emitter.start();

        this.emittersArray.push(emitter);
    }

    private listenToSystems = () => {
        combineLatest(this.systemsSubjects).subscribe(
            (newValues) => {
                const skipUpdate = this.checkNAValues(newValues);
                const currentDate = new Date().getTime();
                //skip emitting if last emit was less than 100ms ago
                if (skipUpdate || currentDate - this.lastSentDate < 100) {
                    return;
                }

                this.returnObject.next(newValues);
                this.lastSentDate = currentDate;
            }
        );
    }

    private checkNAValues = (newValues: string[]): boolean => {
        let skipUpdate = false;

        newValues.forEach((prop, index) => {
            //Display object should only be emitted when one of the systems sends a new value, but not N/A
            if (prop !== this.previousValues[index] && prop === this.NA) {
                skipUpdate = true;
            }
            if (prop === this.previousValues[index] || prop === this.NA) {
                return;
            }

            const timerId = this.timers[index.toString()];

            if (timerId) {
                clearTimeout(timerId);
            }

            //If a value is not received from a specific system for more than 1000ms, its reading should be 'N/A'
            this.timers[index.toString()] = setTimeout(() => {
                this.systemsSubjects[index].next(this.NA);
            }, 1000);
        })

        this.previousValues = newValues;

        return skipUpdate;
    }
}

export default ObservableForDashboard;