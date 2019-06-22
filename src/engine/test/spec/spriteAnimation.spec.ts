
import { Sprite } from './../../sprite';
import { SpriteAnimation } from './../../spriteAnimation';

describe('SpriteAnimation', () => {
    let testParentSprite: Sprite;
    let testSpriteAnimation: SpriteAnimation;

    beforeEach(() => {
        testParentSprite = new Sprite();
        testSpriteAnimation = new SpriteAnimation(testParentSprite);
    });

    it('can be instantiated.', () => {
        expect(testSpriteAnimation).toBeDefined();
    });
});