import { ActorInstance } from './actorInstance';
import { Boundary } from './boundary';
import { Context } from './context';
import { GameCanvas } from './gameCanvas';
import { Sprite } from './sprite';

export interface ActorOptions {
    sprite: Sprite;
}

interface ActorLifecycleCallback {
    (self: ActorInstance, context: Context): void;
}

interface ActorDrawCallback {
    (self: ActorInstance, canvas: GameCanvas, context: Context): void;
}

interface CollisionCallback {
    (self: ActorInstance, other: ActorInstance, context: Context)   : void;
}

export class Actor {
    private readonly _context: Context;

    private _onCreate: ActorLifecycleCallback = null;
    private _onStep: ActorLifecycleCallback = null;
    private _onDestroy: ActorLifecycleCallback = null;
    private _onDraw: ActorDrawCallback = null;

    private _sprite: Sprite;
    public get sprite(): Sprite {
        return this._sprite;
    }

    private _boundary: Boundary;
    public get boundary(): Boundary {
        return this._boundary;
    }

    private readonly _collisionHandlers: { [index: string]: CollisionCallback } = {};
    public get collisionHandlers(): { [index: string]: CollisionCallback } {
        return this._collisionHandlers;
    }
    
    constructor(context: Context, options?: ActorOptions) {
        this._context = context;

        if (options && options.sprite) {
            this.setSprite(options.sprite);
        }
    }

    setSprite(sprite: Sprite): void {
        this._sprite = sprite;
    }

    onCreate(callback: ActorLifecycleCallback): void {
        this._onCreate = callback;
    }

    callCreate(self: ActorInstance): void {
        if (this._onCreate) {
            this._onCreate(self, this._context);
        }
    }

    onStep(callback: ActorLifecycleCallback): void {
        this._onStep = callback;
    }

    callStep(self: ActorInstance): void {
        if (this._onStep) {
            this._onStep(self, this._context);
        }
    }

    onDestroy(callback: ActorLifecycleCallback): void {
        this._onDestroy = callback;
    }

    callDestroy(self: ActorInstance): void {
        if (this._onDestroy) {
            this._onDestroy(self, this._context);
        }
    }

    onDraw(callback: ActorDrawCallback): void {
        this._onDraw = callback;
    }

    callDraw(self: ActorInstance, canvas: GameCanvas): void {
        if (this._onDraw) {
            this._onDraw(self, canvas, this._context);
        }
    }

    onCollide(actorName: string, callback: CollisionCallback): void {
        this.collisionHandlers[actorName] = callback;
    }
}