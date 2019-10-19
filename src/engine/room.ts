import { Actor } from './actor';
import { ActorInstance } from './actorInstance';
import { Context } from './context';
import { GameCanvas } from './gameCanvas';
import { GameState } from './gameState';
import { PointerInputEvent } from './input';
import { MathUtil } from './mathUtil';
import { View } from './view';

interface RoomLifecycleCallback {
    (selfInstance: Room, args?: any): void;
}

interface RoomLifecycleDrawCallback {
    (selfInstance: Room, canvas: GameCanvas, args?: any): void;
}

export class Room {
    private readonly _context: Context;
    private readonly _gameState: GameState;
    readonly view: View;

    private readonly _actorInstanceMap: { [index: number]: ActorInstance } = {};
    private readonly _propertyMap: { [index: string]: any } = {};
    private _onStart: RoomLifecycleCallback;
    private _onEnd: RoomLifecycleCallback;
    private _preStep: RoomLifecycleCallback;
    private _postStep: RoomLifecycleCallback;
    private _onDraw: RoomLifecycleDrawCallback;

    private nextActorInstanceID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();

    constructor(context: Context, gameState: GameState) {
        this._context = context;
        this._gameState = gameState;
        this.view = new View();
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
        return this.getInstancesInternal(!!actorTypes.length, actorTypes, false);
    }

    getInstancesAtPosition(x: number, y: number, actorTypes: Actor[] = []): ActorInstance[] {
        return this.getInstancesInternal(!!actorTypes.length, actorTypes, true, x, y);
    }

    private getInstancesInternal(filterActors: boolean, actorTypes: Actor[], filterPosition: boolean, x?: number, y?: number): ActorInstance[] {
        let instances = [];

        for (let instanceID in this._actorInstanceMap) {
            let instance = this._actorInstanceMap[instanceID];
            let exclude = false;

            if (filterActors) {
                exclude = (exclude || (actorTypes && actorTypes.indexOf(instance.parent) === -1));
            }

            if (!exclude && filterPosition) {
                exclude = (exclude || !instance.occupiesPosition(x, y));
            }

            if (!exclude) {
                instances.push(this._actorInstanceMap[instanceID]);
            }
        }

        return instances;
    }

    step(): void {
        this.callPreStep();

        this.getInstances().forEach(instance => {

            if (instance.isAlive) {
                this.applyInstanceMovement(instance);
                this.checkCollisions(instance, this._context);
                instance.parent.callStep(instance);
            }
            else {
                this.destroyInstance(instance);
            }
        });

        this.callPostStep();
    }
    
    private applyInstanceMovement(actorInstance: ActorInstance): void {
        if (actorInstance.speed !== 0) {
            let offsetX = Math.round(MathUtil.getLengthDirectionX(actorInstance.speed * 100, actorInstance.direction) / 100);
            let offsetY = Math.round(MathUtil.getLengthDirectionY(actorInstance.speed * 100, actorInstance.direction) / 100);
    
            if (offsetX !== 0 || offsetY !== 0) {
                actorInstance.setPositionRelative(offsetX, offsetY);
            }
        }
    }

    destroyInstance(instance: ActorInstance) {
        instance.parent.callDestroy(instance);
        delete this._actorInstanceMap[instance.id];
    }

    private checkCollisions(selfInstance: ActorInstance, context): void {
        let parent = selfInstance.parent;
        
        for (let actorName in parent.collisionHandlers) {
            let callback = parent.collisionHandlers[actorName];
            let otherActor = context.getActor(actorName);

            for (let otherID in this._actorInstanceMap) {
                let other = this._actorInstanceMap[otherID];

                if (other.parent === otherActor && selfInstance !== other && selfInstance.collidesWith(other)) {
                    callback(selfInstance, other, this._gameState);
                }
            }
        };
    }

    draw(canvas: GameCanvas): void {
        let orderedInstances = this.getInstances().sort((a, b) => {
            let animationA = a.spriteAnimation;
            let animationB = b.spriteAnimation;
            return (animationB ? animationB.depth : 0) - (animationA ? animationA.depth : 0);
        });

        canvas.origin = [-this.view.x, -this.view.y];

        orderedInstances.forEach(instance => {
            let spriteAnimation = instance.spriteAnimation;
            if (spriteAnimation) {
                spriteAnimation.draw(canvas, instance.x, instance.y);
            }

            instance.parent.callDraw(instance, canvas);
        });

        this.callDraw(canvas);
    }

    // lifecycle callbacks
    onStart(callback: RoomLifecycleCallback): void {
        this._onStart = callback;
    }

    callStart(args?: any): void {
        if (this._onStart) {
            this._onStart(this, args);
        }
    }

    onEnd(callback: RoomLifecycleCallback): void {
        this._onEnd = callback;
    }

    callEnd(args?: any): void {
        if (this._onEnd) {
            this._onEnd(this, args);
        }
    }

    preStep(callback: RoomLifecycleCallback): void {
        this._preStep = callback;
    }

    callPreStep(args?: any): void {
        if (this._preStep) {
            this._preStep(this, args);
        }
    }

    postStep(callback: RoomLifecycleCallback): void {
        this._postStep = callback;
    }

    callPostStep(args?: any): void {
        if (this._postStep) {
            this._postStep(this, args);
        }
    }

    onDraw(callback: RoomLifecycleCallback): void {
        this._onDraw = callback;
    }

    callDraw(canvas: GameCanvas, args?: any): void {
        if (this._onDraw) {
            this._onDraw(this, canvas, args);
        }
    }

    handleClick(event: PointerInputEvent): void {
        // pass click event to actor instances, compensating for view position
        let clickX = event.x + this.view.x;
        let clickY = event.y + this.view.y;

        this.getInstancesAtPosition(clickX, clickY).forEach(instance => {
            let parent = instance.parent;

            if (instance.occupiesPosition(clickX, clickY)) {
                parent.callClick(instance, event);
            }
        });
    }
}