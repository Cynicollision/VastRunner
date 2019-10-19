import { Game, GameOptions } from './game';
import { GameCanvasHTML2D, GameCanvasOptions } from './gameCanvas';

export class VastRunner {
    private static _game: Game;

    public static newHTMLCanvas2DGame(canvasId: string, gameOptions?: GameOptions): Game {
        let canvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        let gameCanvas = new GameCanvasHTML2D(canvasElement, gameOptions ? gameOptions.canvasOptions : null);
        this._game = new Game(gameCanvas, gameOptions);
        return this._game;
    }
}