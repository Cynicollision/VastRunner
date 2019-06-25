import { ErrorHandler } from './errorHandler';
import { GameOptions } from './game';

export class DeferredEvent {
    private _dispatcher: EventDispatcher;
    private _subscriptions: DeferredEventSubscription[] = [];

    constructor(dispatcher: EventDispatcher) {
        this._dispatcher = dispatcher;
    }

    fire(args?: any): void {
        let dispatcher = this._dispatcher;
        this._subscriptions.forEach(sub => dispatcher.queue(sub, args));
    }

    subscribe(callback: (args?: any) => void): DeferredEventSubscription {
        let sub = new DeferredEventSubscription(callback);
        this._subscriptions.push(sub);
        return sub;
    }
}

export class DeferredEventSubscription {
    private _callback: (args?: any) => void = null;
    private _disposed = false;

    constructor(callback: (args?: any) => void) {
        this._callback = callback;
    }

    fire(args?: any): void {
        if (!this._disposed) {
            this._callback(args);
        }
    }

    dispose(): void {
        this._disposed = true;
    }
}

export class QueuedEvent {
    private _sub: DeferredEventSubscription;
    private _args: any;

    constructor(sub: DeferredEventSubscription, args?: any) {
        this._sub = sub;
        this._args = args;
    }

    fire(): void {
        this._sub.fire(this._args);
    }
}

export class EventDispatcher {
    private readonly _gameOptions: GameOptions;
    private readonly _errorHandler: ErrorHandler;

    private readonly _events: { [index: number]: DeferredEvent } = {};
    private readonly _eventQueue: QueuedEvent[] = [];

    constructor(errorHandler: ErrorHandler, gameOptions: GameOptions) {
        this._errorHandler = errorHandler;
        this._gameOptions = gameOptions;
    }

    defineEvent(name: string): DeferredEvent {
        if (this._events[name]) {
            this.handleError(`Event name '${name} has already been defined.`);
        }

        this._events[name] = new DeferredEvent(this);
        return this._events[name];
    }

    queue(sub: DeferredEventSubscription, args: any): void {
        this._eventQueue.push(new QueuedEvent(sub, args));
    }

    fireEvents(): void {
        let subsToFire = this._eventQueue.splice(0, this._gameOptions.eventQueueSize);

        subsToFire.forEach(queuedSub => queuedSub.fire());
    }

    private handleError(errorMsg: string): void {
        this._errorHandler.handleError(errorMsg);
    }
}