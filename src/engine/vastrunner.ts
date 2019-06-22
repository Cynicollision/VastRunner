import { Game } from './game';
import { GameCanvasHTML2D } from './gameCanvas';

// TODO: replace w/ public-friendly API interfaces
export { Context } from './context';
export { Game } from './game';

export class VastRunner {
    private static _game: Game = null;

    public static newHTMLCanvas2DGame(canvasId: string): Game {
        this._game = new Game(new GameCanvasHTML2D(canvasId));
        
        return this._game;
    }
}