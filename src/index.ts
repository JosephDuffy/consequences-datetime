import { Addon, AddonInitialiser, Variable } from 'consequences/addons';
import { EventEmitter } from 'events';

export default class DateTimeInitialiser implements AddonInitialiser {

  public readonly name = 'Date Time';

  public readonly description = 'Provides the system\'s date and time';

  public createInstance(metadata: Addon.Metadata, configOptions?: { [id: string]: any; }): Promise<DateTime> {
    return Promise.resolve(new DateTime(metadata));
  }

}

export class DateTime implements Addon {

  public metadata: Addon.Metadata;

  get variables(): Promise<Variable[]> {
    return Promise.resolve([this.dateTime]);
  }

  private dateTime: DateTimeVariable;

  constructor(metadata: Addon.Metadata) {
    this.metadata = metadata;
    this.dateTime = new DateTimeVariable();
  }

}

class DateTimeVariable extends EventEmitter implements Variable {

  public readonly uniqueId = 'system';

  public readonly name = 'System Date and Time';

  get currentValue(): Date {
    return new Date();
  }

  private timer: NodeJS.Timer;

  constructor() {
    super();
  }

  public addChangeEventListener(listener: () => void) {
    super.addListener('dateTimeChanged', listener);

    if (super.listenerCount('dateTimeChanged') === 1) {
      this.startFiringEvents();
    }
  }

  public removeChangeEventListener(listener: () => void) {
    super.removeListener('dateTimeChanged', listener);

    if (super.listenerCount('dateTimeChanged') === 0) {
      this.stopFiringEvents();
    }
  }

  private startFiringEvents() {
    this.timer = setInterval(() => {
      this.emit('dateTimeChanged');
    }, 1000);
  }

  private stopFiringEvents() {
    clearInterval(this.timer);
    this.timer = null;
  }

}
