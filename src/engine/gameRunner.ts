import { Context } from './context';
import { GameCanvas } from './gameCanvas';
import { GameState } from './enum';
import { EventDispatcher } from './eventDispatcher';

// TODO: get from GameOptions
const TargetFPS = 60;

export class GameRunner {
    private _canvas: GameCanvas;
    private _context: Context;
    private _eventDispatcher: EventDispatcher;

    private _state: GameState;

    get isRunning(): boolean {
        return this._state === GameState.Running;
    }

    constructor(canvas: GameCanvas, context: Context, eventDispatcher: EventDispatcher) {
        this._canvas = canvas;
        this._context = context;
        this._eventDispatcher = eventDispatcher;
    }

    start(): void {
        let stepSize: number = 1 / TargetFPS;
        let offset: number = 0;
        let previous: number = window.performance.now();

        let gameLoop: FrameRequestCallback = (): void => {
            let room = this._context.getCurrentRoom();
            let current: number = window.performance.now();
            
            offset += (Math.min(1, (current - previous) / 1000));
            
            while (offset > stepSize) {

                if (this.isRunning) {
                    this._eventDispatcher.fireEvents();

                    if (room) {
                        room.step();
                    }
                }
                else {
                    return;
                }

                offset -= stepSize;
            }

            if (room && this.isRunning) {
                this._canvas.clear();
                room.draw(this._canvas);
            }

            previous = current;
            requestAnimationFrame(gameLoop);
        };

        // start the game loop
        this._state = GameState.Running;
        requestAnimationFrame(gameLoop);
    }

    pause(): void {
        this._state = GameState.Paused;
    }
}