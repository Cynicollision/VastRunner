import { Context } from '../context';
import { EventDispatcher } from './../eventDispatcher';
import { Game, GameOptions } from './../game';
import { Canvas, GameCanvas } from './../gameCanvas';
import { GameState } from '../gameState';
import { InputHandler } from './../input';
import { Room } from '../room';
import { TestErrorHandler } from'./testErrorHandler';
import { TestCanvas, TestGameCanvas } from './testCanvas';
import { Sprite } from '../sprite';

export class TestUtil {

    static getTestGame(): Game {
        return new Game(new TestGameCanvas());
    }

    static getTestGameOptions(): GameOptions {
        return {
            eventQueueSize: 10,
        };
    }

    static getTestCanvas(): Canvas {
        return new TestCanvas();
    }

    static getTestGameCanvas(): GameCanvas {
        return new TestGameCanvas();
    }

    static getTestGameState(): GameState {
        return new GameState();
    }

    static getTestContext(): Context {
        return new Context(this.getTestErrorHandler(), this.getTestEventDispatcher(), this.getTestGameState(), this.getTestInputHandler());
    }

    static getTestErrorHandler(): TestErrorHandler {
        return new TestErrorHandler();
    }

    static getTestEventDispatcher(): EventDispatcher {
        return new EventDispatcher(this.getTestErrorHandler(), this.getTestGameOptions());
    }

    static getTestInputHandler(): InputHandler {
        return new InputHandler();
    }

    static getTestRoom(): Room {
        return new Room(this.getTestContext(), this.getTestGameState());
    }

    static getTestSprite(height?: number, width?: number): Sprite {
        return new Sprite({
            imageSource: 'none',
            height: height || 32,
            width: width || 32,
        });
    }
}
