
import { Sprite } from './../../sprite';

describe('Sprite', () => {
    let testSprite: Sprite;

    beforeEach(() => {
        testSprite = new Sprite({
            imageSource: 'none',
            height: 32,
            width: 32,
        });
    });

    it('can be instantiated.', () => {
        expect(testSprite).toBeDefined();
    });
});