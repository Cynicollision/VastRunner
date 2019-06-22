
import { Actor } from './../../actor';
import { TestUtil } from './../testUtil';

describe('Actor', () => {
    let testContext = TestUtil.getTestContext();
    let testActor: Actor;

    beforeEach(() => {
        testActor = new Actor(testContext);
    });

    it('can be instantiated.', () => {
        expect(testActor).toBeDefined();
    });
});