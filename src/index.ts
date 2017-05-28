import { Addon, AddonInitialiser, Metadata, Variable } from "consequences";
import { EventEmitter } from "events";

export default class DateTimeInitialiser implements AddonInitialiser {

    readonly name = "Date Time";

    readonly description = "Provides the system's date and time";

    createInstance(metadata: Metadata): Promise<DateTime> {
        return Promise.resolve(new DateTime(metadata));
    }

}

export class DateTime implements Addon {

    metadata: Metadata;

    get variables(): Variable[] {
        return [this.dateTime]
    }

    private dateTime: DateTimeVariable;

    constructor(metadata: Metadata) {
        this.metadata = metadata;
        this.dateTime = new DateTimeVariable();
    }

}

class DateTimeVariable extends EventEmitter implements Variable {

    readonly name = "System Date and Time";

    get currentValue(): Date {
        return new Date();
    }

    private timer: NodeJS.Timer;

    constructor() {
        super()
    }

    addChangeEventListener(listener: Function) {
        super.addListener("dateTimeChanged", listener);

        if (super.listenerCount("dateTimeChanged") === 1) {
            this.startFiringEvents();
        }
    }

    removeChangeEventListener(listener: Function) {
        super.removeListener("dateTimeChanged", listener);

        if (super.listenerCount("dateTimeChanged") === 0) {
            this.stopFiringEvents();
        }
    }

    private startFiringEvents() {
        this.timer = setInterval(() => {
            this.emit("dateTimeChanged");
        }, 1000);
    }

    private stopFiringEvents() {
        clearInterval(this.timer);
        this.timer = null;
    }

}
