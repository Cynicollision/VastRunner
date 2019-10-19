import { Context } from '../../context';
import { GameCanvas } from '../../gameCanvas';
import { TestUtil } from '../testUtil';

describe('Context', () => {
    let testErrorHandler = TestUtil.getTestErrorHandler();
    let testEventDispatcher = TestUtil.getTestEventDispatcher();
    let testGameState = TestUtil.getTestGameState();
    let testInputHandler = TestUtil.getTestInputHandler();

    let testContext: Context;

    beforeEach(() => {
        testContext = new Context(testErrorHandler, testEventDispatcher, testGameState, testInputHandler);
    });

    it('can be instantiated.', () => {
        expect(testContext).toBeDefined();
    });

    it('can define an Actor', () => {
        testContext.defineActor('TestActor');
        let testActor = testContext.getActor('TestActor');
        expect(testActor).toBeDefined();
    });

    it('can define a Room', () => {
        testContext.defineRoom('TestRoom');
        let testSprite = testContext.getRoom('TestRoom');
        expect(testSprite).toBeDefined();
    });

    it('can define a Sprite', () => {
        testContext.defineSprite('TestSprite', {
            imageSource: 'none',
            height: 32,
            width: 32,
        });

        let testSprite = testContext.getSprite('TestSprite');
        expect(testSprite).toBeDefined();
    });
});