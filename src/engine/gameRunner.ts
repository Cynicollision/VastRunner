import { GameCanvas } from './gameCanvas';
import { EventDispatcher } from './eventDispatcher';
import { Room } from './room';
import { GameState } from './gameState';
import { GameOptions } from './game';

export class GameRunner {
    private readonly _canvas: GameCanvas;
    private readonly _eventDispatcher: EventDispatcher;
    private readonly _gameState: GameState;
    private readonly _gameOptions: GameOptions;

    constructor(canvas: GameCanvas, eventDispatcher: EventDispatcher, gameOptions: GameOptions, gameState: GameState) {
        this._canvas = canvas;
        this._eventDispatcher = eventDispatcher;
        this._gameOptions = gameOptions;
        this._gameState = gameState;
    }

    start(room: Room): void {
        this._gameState.setRoom(room);

        let stepSize: number = 1 / this._gameOptions.targetFPS;
        let offset: number = 0;
        let previous: number = window.performance.now();

        let gameLoop: FrameRequestCallback = (): void => {
            let current: number = window.performance.now();
            offset += (Math.min(1, (current - previous) / 1000));
            
            while (offset > stepSize) {
                this._eventDispatcher.fireEvents();
                this._gameState._step();
                offset -= stepSize;
            }

            this._canvas.clear();
            this._gameState._draw(this._canvas);

            previous = current;
            requestAnimationFrame(gameLoop);
        };

        requestAnimationFrame(gameLoop);
    }
}