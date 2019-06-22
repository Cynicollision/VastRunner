import { Actor } from './actor';
import { Context } from './context';
import { ErrorHandler, DefaultErrorHandler } from './errorHandler';
import { EventDispatcher, DeferredEvent } from './eventDispatcher';
import { GameCanvas } from './gameCanvas';
import { GameRunner } from './gameRunner';

export class Game {
    private _canvas: GameCanvas;
    private _context: Context;
    private _errorHandler: ErrorHandler;
    private _eventDispatcher: EventDispatcher;
    private _runner: GameRunner;

    get context(): Context {
        return this._context;
    }

    constructor(canvas: GameCanvas) {
        this._canvas = canvas;
        this._errorHandler = new DefaultErrorHandler();
        this._eventDispatcher = new EventDispatcher(this._errorHandler);
        this._context = new Context(this._errorHandler, this._eventDispatcher);
        this._runner = new GameRunner(this._canvas, this._context, this._eventDispatcher);
    }

    start() {
        this._runner.start();
    }

    useErrorHandler(handler: ErrorHandler) {
        this._errorHandler = handler;
    }

    defineActor(name: string): Actor {
        return this._context.defineActor(name);
    }

    defineEvent(name: string): DeferredEvent {
        return this._context.defineEvent(name);
    }
}