
import { Canvas, GameCanvas, GameCanvasHTML2D } from '../../gameCanvas';
import { TestUtil } from './../testUtil';

describe('GameCanvas', () => {
    let testCanvas: Canvas;
    let testGameCanvas: GameCanvas;

    beforeEach(() => {
        testCanvas = TestUtil.getTestCanvas();
        testGameCanvas = new GameCanvasHTML2D(testCanvas);
    });

    it('accepts options for setting to a specific size.', () => {
        testGameCanvas = new GameCanvasHTML2D(testCanvas, { height: 123, width: 456 });

        expect(testGameCanvas.height).toBe(123);
        expect(testGameCanvas.width).toBe(456);
    });

    it('accepts an option for full screen mode.', () => {
        testGameCanvas = new GameCanvasHTML2D(testCanvas, { fullScreen: true });

        expect(testGameCanvas.height).toBe(window.innerHeight);
        expect(testGameCanvas.width).toBe(window.innerWidth);
    });

    it('accepts an option for background color.', () => {
        testGameCanvas = new GameCanvasHTML2D(testCanvas, { backgroundColor: 'fancy' });

        expect(testGameCanvas.backgroundColor).toBe('fancy');
    });
});