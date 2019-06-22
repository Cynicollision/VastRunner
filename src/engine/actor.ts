import { ActorInstance } from './actorInstance';
import { GameCanvas } from './gameCanvas';
import { Context } from './context';

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
    private _context: Context;

    private _onCreate: ActorLifecycleCallback = null;
    private _onStep: ActorLifecycleCallback = null;
    private _onDestroy: ActorLifecycleCallback = null;
    private _onDraw: ActorDrawCallback = null;

    readonly _collisionHandlers: { [index: string]: CollisionCallback } = {};
    
    constructor(context: Context) {
        this._context = context;
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
        this._onDraw(self, canvas, this._context);
    }
}