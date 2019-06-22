import { GameRunner } from './../../gameRunner';
import { TestUtil } from './../testUtil';

describe('GameRunner', () => {
    let testCanvas = TestUtil.getTestCanvas();
    let testContext = TestUtil.getTestContext();
    let testEventDispatcher = TestUtil.getTestEventDispatcher();
    let gameRunner: GameRunner;

    beforeEach(() => {
        gameRunner = new GameRunner(testCanvas, testContext, testEventDispatcher);
    });

    it('can be instantiated.', () => {
        expect(gameRunner).toBeDefined();
    });
});