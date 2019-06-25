
import { Actor } from './../../actor';
import { ActorInstance } from './../../actorInstance';
import { Context } from '../../context';
import { Game } from './../../game';
import { Room } from './../../room';
import { TestUtil } from './../testUtil';

describe('ActorInstance', () => {
    let testActor: Actor;
    let testActorInstance: ActorInstance;
    let testContext: Context;
    let testGame: Game;
    let testRoom: Room;

    beforeEach(() => {
        testGame = new Game(TestUtil.getTestCanvas())
        testContext = TestUtil.getTestContext();
        testActor = new Actor(testContext);
        testRoom = new Room(testContext);
        testActorInstance = new ActorInstance(testActor, 1);
    });

    it('can be instantiated.', () => {
        expect(testActorInstance).toBeDefined();
    });

    it('has its "on create" lifecycle event called.', () => {
        let calledCreate = false;
        testActor.onCreate((self, context) => {
            calledCreate = true;
        });

        expect(calledCreate).toBe(false);

        let instance = testRoom.spawn(0, 0, testActor);

        expect(calledCreate).toBe(true);
    });

    it('has its "on destroy" lifecycle event called.', () => {
        let calledDestroy = false;
        testActor.onDestroy((self, context) => {
            calledDestroy = true;
        });

        let instance = testRoom.spawn(0, 0, testActor);

        expect(calledDestroy).toBe(false);

        instance.destroy();

        expect(calledDestroy).toBe(true);
    });
});