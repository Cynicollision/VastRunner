import { Context } from '../context';
import { Game } from './../game';
import { GameCanvas } from './../gameCanvas';
import { EventDispatcher } from './../eventDispatcher';
import { TestErrorHandler } from'./testErrorHandler';
import { TestGameCanvasHTML2D } from './testCanvas';

export class TestUtil {

    static getTestGame(): Game {
        return new Game(new TestGameCanvasHTML2D());
    }

    static getTestCanvas(): GameCanvas {
        return new TestGameCanvasHTML2D()
    }

    static getTestContext(): Context {
        return new Context(this.getTestErrorHandler(), this.getTestEventDispatcher());
    }

    static getTestErrorHandler(): TestErrorHandler {
        return new TestErrorHandler();
    }

    static getTestEventDispatcher(): EventDispatcher {
        return new EventDispatcher(this.getTestErrorHandler());
    }
}
