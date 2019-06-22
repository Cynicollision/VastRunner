
import { GameCanvas, GameCanvasHTML2D } from '../../gameCanvas';

describe('GameCanvas', () => {
    let testCanvas: GameCanvas;

    beforeEach(() => {
        testCanvas = new GameCanvasHTML2D('testCanvas');
    });

    it('can be instantiated.', () => {
        expect(testCanvas).toBeDefined();
    });
});