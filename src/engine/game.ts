import { Actor, ActorOptions } from './actor';
import { Context } from './context';
import { ErrorHandler, DefaultErrorHandler } from './errorHandler';
import { EventDispatcher, DeferredEvent } from './eventDispatcher';
import { GameCanvas, GameCanvasOptions } from './gameCanvas';
import { GameRunner } from './gameRunner';
import { EventHandler, InputHandler, PointerInputEvent } from './input';
import { Room } from './room';
import { Sprite, SpriteOptions } from './sprite';
import { GameState } from './gameState';

export class GameOptions {
    canvasOptions?: GameCanvasOptions;
    eventQueueSize?: number;
    targetFPS?: number;
}

const Defaults: GameOptions = {
    eventQueueSize: 50,
    targetFPS: 60,
    canvasOptions: {
        fullScreen: false,
        height: 640,
        width: 480,
    },
};

export class Game {
    private _canvas: GameCanvas;
    private _options: GameOptions;
    private _context: Context;
    private _errorHandler: ErrorHandler;
    private _eventDispatcher: EventDispatcher;
    private _gameState: GameState;
    private _inputHandler: InputHandler;
    private _runner: GameRunner;

    private currentRoomClickHandler: EventHandler<PointerInputEvent>;

    get context(): Context {
        return this._context;
    }

    constructor(canvas: GameCanvas, options?: GameOptions) {
        this._canvas = canvas;
        this._options = options || Defaults;
        
        this._errorHandler = new DefaultErrorHandler();
        this._gameState = new GameState();
        this._inputHandler = new InputHandler();
        this._eventDispatcher = new EventDispatcher(this._errorHandler, this._options);
        this._context = new Context(this._errorHandler, this._eventDispatcher, this._gameState, this._inputHandler);
        this._runner = new GameRunner(this._canvas, this._eventDispatcher, this._options, this._gameState);
    }

    start(room: Room): void {
        this.registerInput(room);
        this._runner.start(room);
    }

    setRoom(room: Room): void {
        this.registerInput(room);
        this._gameState.setRoom(room);
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

    defineSprite(name: string, options: SpriteOptions): Sprite {
        return this._context.defineSprite(name, options);
    }

    private registerInput(room: Room): void {
        if (this.currentRoomClickHandler) {
            this.currentRoomClickHandler.dispose();
        }

        this.currentRoomClickHandler = this._inputHandler.registerClickHandler(ev => room.handleClick(ev));
    }
}