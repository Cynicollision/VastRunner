
import { Game } from './../../game';
import { TestUtil } from './../testUtil';
import { Room } from '../../room';

describe('Game', () => {
    let testGame: Game;
    let testRoom: Room;

    beforeEach(() => {
        testGame = TestUtil.getTestGame();
        testRoom = TestUtil.getTestRoom();
    });

    it('passes a sample test.', () => {
        testGame.start(testRoom);
        expect(testGame.context).toBeDefined();
    });
});