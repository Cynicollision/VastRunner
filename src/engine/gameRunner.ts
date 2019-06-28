import { Context } from './context';
import { GameState } from './enum';
import { GameCanvas } from './gameCanvas';
import { EventDispatcher } from './eventDispatcher';
import { Room } from './room';

// TODO: get from GameOptions
const TargetFPS = 60;

export class GameRunner {
    private _canvas: GameCanvas;
    private _eventDispatcher: EventDispatcher;

    private _room: Room;
    private _state: GameState;

    get isRunning(): boolean {
        return this._state === GameState.Running;
    }

    constructor(canvas: GameCanvas, eventDispatcher: EventDispatcher) {
        this._canvas = canvas;
        this._eventDispatcher = eventDispatcher;
    }

    setRoom(room: Room): void {
        if (this._room) {
            this._room.callEnd();
        }

        this._room = room;
        this._room.callStart();
    }

    start(room: Room): void {
        this.setRoom(room);

        let stepSize: number = 1 / TargetFPS;
        let offset: number = 0;
        let previous: number = window.performance.now();

        let gameLoop: FrameRequestCallback = (): void => {
            let current: number = window.performance.now();
            offset += (Math.min(1, (current - previous) / 1000));
            
            while (offset > stepSize) {

                if (this.isRunning) {
                    this._eventDispatcher.fireEvents();

                    if (this._room) {
                        this._room.step();
                    }
                }
                else {
                    return;
                }

                offset -= stepSize;
            }

            if (this._room && this.isRunning) {
                this._canvas.clear();
                this._room.draw(this._canvas);
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