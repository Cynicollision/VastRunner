
import { Sprite } from './../../sprite';

describe('Sprite', () => {
    let testSprite: Sprite;

    beforeEach(() => {
        testSprite = new Sprite();
    });

    it('can be instantiated.', () => {
        expect(testSprite).toBeDefined();
    });
});