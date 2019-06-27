import { Actor, ActorOptions } from './actor';
import { Context } from './context';
import { ErrorHandler, DefaultErrorHandler } from './errorHandler';
import { EventDispatcher, DeferredEvent } from './eventDispatcher';
import { GameCanvas } from './gameCanvas';
import { GameRunner } from './gameRunner';
import { Room } from './room';
import { Sprite, SpriteOptions } from './sprite';

export class GameOptions {
    eventQueueSize?: number;
    fullscreen?: boolean;
    targetFPS?: number;
}

const Defaults: GameOptions = {
    eventQueueSize: 50,
    fullscreen: false,
    targetFPS: 60,
};

export class Game {
    private _canvas: GameCanvas;
    private _options: GameOptions;

    private _context: Context;
    private _errorHandler: ErrorHandler;
    private _eventDispatcher: EventDispatcher;
    private _runner: GameRunner;

    get context(): Context {
        return this._context;
    }

    constructor(canvas: GameCanvas) {
        this._canvas = canvas;
        this._options = Defaults;
        
        this._errorHandler = new DefaultErrorHandler();
        this._eventDispatcher = new EventDispatcher(this._errorHandler, this._options);
        this._context = new Context(this._errorHandler, this._eventDispatcher);
        this._runner = new GameRunner(this._canvas, this._context, this._eventDispatcher);
    }

    start(room: Room): void {
        this._runner.start(room);
    }

    setRoom(room: Room): void {
        this._runner.setRoom(room);
    }

    useErrorHandler(handler: ErrorHandler): void {
        this._errorHandler = handler;
    }

    useOptions(options: GameOptions): void {
        this._options = options;
    }

    defineActor(name: string, options?: ActorOptions): Actor {
        return this._context.defineActor(name, options);
    }

    defineEvent(name: string): DeferredEvent {
        return this._context.defineEvent(name);
    }

    defineRoom(name: string): Room {
        return this._context.defineRoom(name);
    }

    defineSprite(name: string, options?: SpriteOptions): Sprite {
        return this._context.defineSprite(name, options);
    }
}