
import { Game } from './../../game';
import { TestUtil } from './../testUtil';

describe('Game', () => {
    let testGame: Game;

    beforeEach(() => {
        testGame = TestUtil.getTestGame();
    });

    it('passes a sample test.', () => {
        testGame.start();
        expect(testGame.context).toBeDefined();
    });
});