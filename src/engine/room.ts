import { Actor } from './actor';
import { ActorInstance } from './actorInstance';
import { Context } from './context';
import { GameCanvas } from './gameCanvas';

interface RoomLifecycleCallback {
    (selfInstance: Room, context: Context, args?: any): void;
}

interface RoomLifecycleDrawCallback {
    (selfInstance: Room, context: Context, canvas: GameCanvas, args?: any): void;
}

export class Room {
    private _context: Context;

    private readonly _actorInstanceMap: { [index: number]: ActorInstance } = {};
    private readonly _propertyMap: { [index: string]: any } = {};
    // private behaviors: RoomBehavior[] = [];
    private _onStart: RoomLifecycleCallback;
    private _onEnd: RoomLifecycleCallback;
    private _onDraw: RoomLifecycleDrawCallback;

    private nextActorInstanceID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();

    constructor(context: Context) {
        this._context = context;
    }

    get(key: string): any {
        return this._propertyMap[key];
    }

    set(key: string, value: any): void {
        this._propertyMap[key] = value;
    }

    spawn(x: number, y: number, parentActor: Actor): ActorInstance {
        let newInstanceId = this.nextActorInstanceID();
        let newInstance = new ActorInstance(parentActor, newInstanceId);
        newInstance.x = x || 0;
        newInstance.y = y || 0;

        this._actorInstanceMap[newInstanceId] = newInstance;
        parentActor.callCreate(newInstance);

        return newInstance;
    }

    getInstances(actorTypes: Actor[] = []): ActorInstance[] {
        let instances = [];

        for (let instanceID in this._actorInstanceMap) {
            let instance = this._actorInstanceMap[instanceID];

            if (!actorTypes.length || (actorTypes && actorTypes.indexOf(instance.parent) > -1)) {
                instances.push(this._actorInstanceMap[instanceID]);
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
                delete this._actorInstanceMap[instance.id];
            }
        });

        //this.behaviors.forEach(behavior => behavior.postStep(this));
    }

    private checkCollisions(selfInstance: ActorInstance): void {
        let parent = selfInstance.parent;
        
        for (let actorName in parent.collisionHandlers) {
            let callback = parent.collisionHandlers[actorName];
            let otherActor = this._context.getActor(actorName);

            for (let otherID in this._actorInstanceMap) {
                let other = this._actorInstanceMap[otherID];

                if (other.parent === otherActor && selfInstance !== other && selfInstance.collidesWith(other)) {
                    callback(selfInstance, other, this._context);
                }
            }
        };
    }

    draw(canvas: GameCanvas): void {
        // TODO: call pre-draw behaviors
        //this.behaviors.forEach(behavior => behavior.preDraw(this, canvasContext));

        // TODO: draw room background (let canvas handle)
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
        this.callDraw(canvas);
    }

    // lifecycle callbacks
    onStart(callback: RoomLifecycleCallback): void {
        this._onStart = callback;
    }

    callStart(args?: any): void {
        if (this._onStart) {
            this._onStart(this, this._context, args);
        }
    }

    onEnd(callback: RoomLifecycleCallback): void {
        this._onEnd = callback;
    }

    callEnd(args?: any): void {
        if (this._onEnd) {
            this._onEnd(this, this._context, args);
        }
    }

    onDraw(callback: RoomLifecycleCallback): void {
        this._onDraw = callback;
    }

    callDraw(canvas: GameCanvas, args?: any): void {
        if (this._onDraw) {
            this._onDraw(this, this._context, canvas, args);
        }
    }
}