
import { Context } from './../../context';
import { Room } from './../../room';
import { TestUtil } from './../testUtil';

describe('Room', () => {
    let testContext: Context;
    let testRoom: Room;

    beforeEach(() => {
        testContext = TestUtil.getTestContext();
        testRoom = new Room(testContext);
    });

    it('can be instantiated.', () => {
        expect(testRoom).toBeDefined();
    });
});