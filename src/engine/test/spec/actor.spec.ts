
import { Actor } from './../../actor';
import { TestUtil } from './../testUtil';

describe('Actor', () => {
    let testGameState = TestUtil.getTestGameState();

    let testActor: Actor;

    beforeEach(() => {
        testActor = new Actor(testGameState);
    });

    it('can be instantiated.', () => {
        expect(testActor).toBeDefined();
    });
});