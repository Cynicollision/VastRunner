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
        let newInstance = new ActorInstance(parentActor, this);
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

            if (!actorTypes.length || (actorTypes && actorTypes.indexOf(instance.getParent()) > -1)) {
                instances.push(this.actorInstanceMap[instanceID]);
            }
        }

        return instances;
    }

    step(): void {
        // TODO
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
            let animationA = a.getAnimation();
            let animationB = b.getAnimation();
            return (animationB ? animationB.depth : 0) - (animationA ? animationA.depth : 0);
        });

        orderedInstances.forEach(instance => {
            // draw sprites
            let spriteAnimation = instance.getAnimation();
            if (spriteAnimation) {
                spriteAnimation.draw(canvas, instance.x, instance.y);
            }

            // call actor draw event callbacks
            instance.getParent().callDraw(instance, canvas);
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