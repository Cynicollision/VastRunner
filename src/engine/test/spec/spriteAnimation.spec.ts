
import { Sprite } from './../../sprite';
import { SpriteAnimation } from './../../spriteAnimation';
import { TestUtil } from './../testUtil';

describe('SpriteAnimation', () => {
    let testParentSprite: Sprite;
    let testSpriteAnimation: SpriteAnimation;

    beforeEach(() => {
        testParentSprite = TestUtil.getTestSprite();

        testSpriteAnimation = new SpriteAnimation(testParentSprite);
    });

    it('can be instantiated.', () => {
        expect(testSpriteAnimation).toBeDefined();
    });
});