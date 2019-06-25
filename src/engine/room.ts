import { Actor } from './actor';
import { ActorInstance } from './actorInstance';
import { Context } from './context';
import { GameCanvas } from './gameCanvas';

interface RoomLifecycleCallback {
    (selfInstance: Room, args?: any): void;
}

interface RoomLifecycleDrawCallback {
    (selfInstance: Room, canvas: GameCanvas, context: Context, args?: any): void;
}

export class Room {
    private _context: Context;

    private actorInstanceMap: { [index: number]: ActorInstance } = {};
    private propertyMap: { [index: string]: any } = {};
    // private behaviors: RoomBehavior[] = [];
    private onStartCallback: RoomLifecycleCallback;
    private onDrawCallback: RoomLifecycleDrawCallback;

    private nextActorInstanceID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();

    constructor(context: Context) {
        this._context = context;
    }

    spawn(x: number, y: number, parentActor: Actor): ActorInstance {
        let newInstanceId = this.nextActorInstanceID();
        let newInstance = new ActorInstance(parentActor, this.nextActorInstanceID());
        newInstance.x = x || 0;
        newInstance.y = y || 0;

        this.actorInstanceMap[newInstanceId] = newInstance;
        parentActor.callCreate(newInstance);

        return newInstance;
    }

    getInstances(actorTypes: Actor[] = []): ActorInstance[] {
        let instances = [];

        for (let instanceID in this.actorInstanceMap) {
            let instance = this.actorInstanceMap[instanceID];

            if (!actorTypes.length || (actorTypes && actorTypes.indexOf(instance.parent) > -1)) {
                instances.push(this.actorInstanceMap[instanceID]);
            }
        }

        return instances;
    }

    step(): void {
        this.getInstances().forEach(instance => {
            let parent = instance.parent;

            if (instance.active) {
                instance.applyMovement();

                this.checkCollisions(instance);

                parent.callStep(instance);
            }
            else {
                instance.parent.callDestroy(instance);
                delete this.actorInstanceMap[instance.id];
            }
        });

        //this.behaviors.forEach(behavior => behavior.postStep(this));
    }

    private checkCollisions(selfInstance: ActorInstance): void {
        let parent = selfInstance.parent;
        
        for (let actorName in parent.collisionHandlers) {
            let callback = parent.collisionHandlers[actorName];
            let otherActor = this._context.getActor(actorName);

            for (let otherID in this.actorInstanceMap) {
                let other = this.actorInstanceMap[otherID];

                if (other.parent === otherActor) {

                    if (selfInstance !== other && selfInstance.collidesWith(other)) {
                        callback(selfInstance, other, this._context);
                    }
                }
            }
        };
    }

    draw(canvas: GameCanvas): void {
        // TODO: call pre-draw behaviors
        //this.behaviors.forEach(behavior => behavior.preDraw(this, canvasContext));

        // TODO: draw room background
        //if (this.background) {
        //    canvasContext.fillArea(-this.background.width, -this.background.height, this.background.width * 3, this.background.height * 3, this.background.canvasColor);
        //    canvasContext.fill(this.background.width, this.background.height, this.background.color);
        //}

        let orderedInstances = this.getInstances().sort((a, b) => {
            let animationA = a.spriteAnimation;
            let animationB = b.spriteAnimation;
            return (animationB ? animationB.depth : 0) - (animationA ? animationA.depth : 0);
        });

        orderedInstances.forEach(instance => {
            // draw sprites
            let spriteAnimation = instance.spriteAnimation;
            if (spriteAnimation) {
                spriteAnimation.draw(canvas, instance.x, instance.y);
            }

            // call actor draw event callbacks
            instance.parent.callDraw(instance, canvas);
        });

        // call room draw event callback
        this._callDraw(canvas);
    }

    // lifecycle callbacks
    onStart(callback: RoomLifecycleCallback): void {
        this.onStartCallback = callback;
    }

    _callStart(args?: any): void {
        if (this.onStartCallback) {
            this.onStartCallback(this, args);
        }
    }

    onDraw(callback: RoomLifecycleCallback): void {
        this.onDrawCallback = callback;
    }

    _callDraw(canvas: GameCanvas, args?: any): void {
        if (this.onDrawCallback) {
            this.onDrawCallback(this, canvas, this._context, args);
        }
    }
}