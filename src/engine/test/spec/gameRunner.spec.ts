import { GameRunner } from './../../gameRunner';
import { TestUtil } from './../testUtil';

describe('GameRunner', () => {
    let testCanvas = TestUtil.getTestGameCanvas();
    let testEventDispatcher = TestUtil.getTestEventDispatcher();
    let testGameOptions = TestUtil.getTestGameOptions();
    let testGameState = TestUtil.getTestGameState();

    let gameRunner: GameRunner;

    beforeEach(() => {
        gameRunner = new GameRunner(testCanvas, testEventDispatcher, testGameOptions, testGameState);
    });

    it('can be instantiated.', () => {
        expect(gameRunner).toBeDefined();
    });
});