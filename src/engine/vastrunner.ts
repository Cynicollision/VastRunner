import { Game } from './game';
import { GameCanvasHTML2D, GameCanvasOptions } from './gameCanvas';

export class VastRunner {
    private static _game: Game;

    public static newHTMLCanvas2DGame(canvasId: string, canvasOptions?: GameCanvasOptions): Game {
        let canvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        this._game = new Game(new GameCanvasHTML2D(canvasElement, canvasOptions));
        return this._game;
    }
}