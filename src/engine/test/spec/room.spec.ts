import { Actor } from './../../actor';
import { Context } from './../../context';
import { Room } from './../../room';
import { TestUtil } from './../testUtil';

describe('Room', () => {
    let testContext: Context;
    let testActor: Actor;
    let testRoom: Room;

    beforeEach(() => {
        testContext = TestUtil.getTestContext();
        testActor = new Actor(testContext);
        testRoom = new Room(testContext);
    });

    it('can be instantiated.', () => {
        expect(testRoom).toBeDefined();
    });

    it('can define and return Room-level properties.', () => {
        testRoom.set('foo', 123);
        expect(testRoom.get('foo')).toBe(123);
    });

    it('can spawn instances of Actors.', () => {
        expect(testRoom.getInstances().length).toBe(0);

        let instance = testRoom.spawn(1, 2, testActor);

        expect(instance.id).toBeTruthy();
        expect(testRoom.getInstances().length).toBe(1);
    });

    it('can get spawned Actor Instances of a specific Actor type.', () => {
        let anotherActor = new Actor(testContext);

        testRoom.spawn(0, 0, testActor);
        testRoom.spawn(0, 0, testActor);
        testRoom.spawn(0, 0, testActor);
        testRoom.spawn(0, 0, anotherActor);
        testRoom.spawn(0, 0, anotherActor);
        testRoom.spawn(0, 0, anotherActor);
        testRoom.spawn(0, 0, anotherActor);

        expect(testRoom.getInstances([testActor]).length).toBe(3);
        expect(testRoom.getInstances([anotherActor]).length).toBe(4);
        expect(testRoom.getInstances([anotherActor, testActor]).length).toBe(7);
    });

    it('can get all Actor Instances that occupy a position.', () => {
        let anotherActor = new Actor(testContext);

        testActor.setBoundaryFromSprite(TestUtil.getTestSprite());
        anotherActor.setBoundaryFromSprite(TestUtil.getTestSprite());

        testRoom.spawn(0, 0, testActor);
        testRoom.spawn(16, 16, anotherActor);

        let instances = testRoom.getInstancesAtPosition(10, 10);
        expect(instances.length).toBe(1);

        instances = testRoom.getInstancesAtPosition(20, 20);
        expect(instances.length).toBe(2);        
    });

    it('can get Actor Instances of certain types that occupy a position.', () => {
        let anotherActor = new Actor(testContext);

        testActor.setBoundaryFromSprite(TestUtil.getTestSprite());
        anotherActor.setBoundaryFromSprite(TestUtil.getTestSprite());

        testRoom.spawn(0, 0, testActor);
        testRoom.spawn(16, 16, anotherActor);

        let instances = testRoom.getInstancesAtPosition(35, 35, [ testActor ]);
        expect(instances.length).toBe(0);

        instances = testRoom.getInstancesAtPosition(35, 35, [ anotherActor ]);
        expect(instances.length).toBe(1);
    });

    it('calls the "create" lifecycle callback when spawning an Actor Instance.', () => {
        let onCreateSpy = spyOn(testActor, 'callCreate');

        testRoom.spawn(0, 0, testActor);

        expect(onCreateSpy).toHaveBeenCalled();
    });

    it('calls the "step" lifecycle callback for all Actor Instances on each step.', () => {
        let onStepSpy = spyOn(testActor, 'callStep');
        testRoom.spawn(0, 0, testActor);

        testRoom.step();

        expect(onStepSpy).toHaveBeenCalled();
    });

    it('checks for collisions between Actor Instances on each step.', () => {
        let instance = testRoom.spawn(0, 0, testActor);
        let collidesWithSpy = spyOn(instance, 'collidesWith');
        testRoom.spawn(0, 0, testContext.defineActor('OtherActor'));
        testActor.onCollide('OtherActor', () => {});

        testRoom.step();

        expect(collidesWithSpy).toHaveBeenCalled();
    });

    it('checks for and deletes destroyed Actor Instances on each step, calling the "destroy" lifecycle callback.', () => {
        let onDestroySpy = spyOn(testActor, 'callDestroy');
        let instance = testRoom.spawn(0, 0, testActor);
        expect(testRoom.getInstances().length).toBe(1);

        instance.destroy();
        testRoom.step();

        expect(testRoom.getInstances().length).toBe(0);
        expect(onDestroySpy).toHaveBeenCalledWith(instance);
    });

    it('calls the "draw" lifecycle callback for all Actor Instances and their Sprites on each frame.', () => {
        let onDrawInstanceSpy = spyOn(testActor, 'callDraw');
        let canvas = TestUtil.getTestCanvas();
        testActor.setSprite(TestUtil.getTestSprite());

        let instance = testRoom.spawn(10, 10, testActor);
        let onDrawSpriteSpy = spyOn(instance.spriteAnimation, 'draw');

        testRoom.draw(canvas);
        
        expect(onDrawInstanceSpy).toHaveBeenCalledWith(instance, canvas);
        expect(onDrawSpriteSpy).toHaveBeenCalledWith(canvas, 10, 10);
    });

    it('calls its own "start" lifecycle callback when starting this room.', () => {
        let onStartSpy = spyOn(testRoom, 'callStart');

        TestUtil.getTestGame().start(testRoom);

        expect(onStartSpy).toHaveBeenCalled();
    });

    it('calls its own "draw" lifecycle callback.', () => {
        let onDrawSpy = spyOn(testRoom, 'callDraw');

        testRoom.callDraw(TestUtil.getTestCanvas());

        expect(onDrawSpy).toHaveBeenCalled();
    });

    it('calls its own "end" lifecycle callback when changing to another rooms.', () => {
        let onEndSpy = spyOn(testRoom, 'callEnd');
        let nextRoom = new Room(testContext);

        let game = TestUtil.getTestGame();
        game.start(testRoom);
        game.setRoom(nextRoom);

        expect(onEndSpy).toHaveBeenCalled();
    });
});