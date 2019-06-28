import { Actor, ActorOptions } from './actor';
import { DeferredEvent, EventDispatcher } from './eventDispatcher';
import { ErrorHandler } from './errorHandler';
import { EventHandler, InputHandler, PointerInputEvent } from './input';
import { Room } from './room';
import { Sprite, SpriteOptions } from './sprite';

export class Context {
    private readonly _errorHandler: ErrorHandler;
    private readonly _eventDispatcher: EventDispatcher;
    private readonly _inputHandler: InputHandler;

    private readonly _actors: { [index: number]: Actor } = {};
    private readonly _events: { [index: number]: DeferredEvent } = {};
    private readonly _sprites: { [index: number]: Sprite } = {};
    private readonly _rooms: { [index: string]: Room } = {};

    constructor(errorHandler: ErrorHandler, eventDispatcher: EventDispatcher, _inputHandler: InputHandler) {
        this._errorHandler = errorHandler;
        this._eventDispatcher = eventDispatcher
    }

    defineActor(name: string, options?: ActorOptions): Actor {
        if (this._actors[name]) {
            this.handleError(`Actor ${name} has already been defined.`);
        }

        this._actors[name] = new Actor(this, options);
        return this._actors[name];
    }

    getActor(name: string): Actor {
        if (!this._actors[name]) {
            throw new Error(`Actor ${name} has not been defined.`);
        }

        return this._actors[name];
    }

    defineEvent(name: string): DeferredEvent {
        if (this._events[name]) {
            this.handleError(`Event ${name} has already been defined.`);
        }

        this._events[name] = new DeferredEvent(this._eventDispatcher);
        return this._events[name];
    }

    defineRoom(name: string): Room {
        if (this._rooms[name]) {
            throw new Error(`Room ${name} has already been defined.`);
        }

        this._rooms[name] = new Room(this);
        return this._rooms[name];
    }

    getRoom(name: string): Room {
        if (!this._rooms[name]) {
            throw new Error(`Room ${name} has not been defined.`);
        }

        return this._rooms[name];
    }

    defineSprite(name: string, options: SpriteOptions): Sprite {
        if (this._sprites[name]) {
            throw new Error(`Sprite ${name} has already been defined.`);
        }

        this._sprites[name] = new Sprite(options);
        return this._sprites[name];
    }

    getSprite(name: string): Sprite {
        if (!this._sprites[name]) {
            throw new Error (`Sprite ${name} has not been defined.`);
        }

        return this._sprites[name];
    }

    registerClickHandler(callback: (event: PointerInputEvent) => void): EventHandler<PointerInputEvent> {
        return this._inputHandler.registerClickHandler(callback);
    }

    private handleError(errorMsg: string): void {
        this._errorHandler.handleError(errorMsg);
    }
}