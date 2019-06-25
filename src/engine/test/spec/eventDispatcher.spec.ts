
import { EventDispatcher } from './../../eventDispatcher';
import { TestUtil } from './../testUtil';

describe('EventDispatcher', () => {
    let testEventDispatcher: EventDispatcher;

    let testErrorHandler = TestUtil.getTestErrorHandler();
    let testGameOptions = TestUtil.getTestGameOptions();

    beforeEach(() => {
        testEventDispatcher = new EventDispatcher(testErrorHandler, testGameOptions);
    });

    it('can be instantiated.', () => {
        expect(testEventDispatcher).toBeDefined();
    });

    it('can define an Event', () => {
        let event = testEventDispatcher.defineEvent('TestEvent');
        expect(event).toBeDefined();
    });

    describe('DeferredEvent', () => {
        
        it('can subscribe to an Event and be notified when called', () => {
            let subscriberCalled = false;
    
            let event = testEventDispatcher.defineEvent('TestEvent');
            event.subscribe(() => {
                subscriberCalled = true;
            });
    
            event.fire();
            testEventDispatcher.fireEvents();
    
            expect(subscriberCalled).toBe(true);
        });

        describe('DeferredEventSubscription', () => {
        
            it('can be disposed', () => {
                let timesSubscriberCalled = 0;
        
                let event = testEventDispatcher.defineEvent('TestEvent');
                let subscription = event.subscribe(() => {
                    timesSubscriberCalled++;
                });
        
                event.fire();
                event.fire();
                testEventDispatcher.fireEvents();
        
                expect(timesSubscriberCalled).toBe(2);

                subscription.dispose();

                event.fire();
                testEventDispatcher.fireEvents();

                expect(timesSubscriberCalled).toBe(2);
            });
        });
    });
});