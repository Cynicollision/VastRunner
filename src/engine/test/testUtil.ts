import { Context } from '../context';
import { Game, GameOptions } from './../game';
import { GameCanvas } from './../gameCanvas';
import { EventDispatcher } from './../eventDispatcher';
import { Room } from '../room';
import { TestErrorHandler } from'./testErrorHandler';
import { TestGameCanvasHTML2D } from './testCanvas';

export class TestUtil {

    static getTestGame(): Game {
        return new Game(new TestGameCanvasHTML2D());
    }

    static getTestGameOptions(): GameOptions {
        return {
            eventQueueSize: 10,
        };
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
        return new EventDispatcher(this.getTestErrorHandler(), this.getTestGameOptions());
    }

    static getTestRoom(): Room {
        return new Room(this.getTestContext());
    }
}
