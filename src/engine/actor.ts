import { ActorInstance } from './actorInstance';
import { Boundary } from './boundary';
import { GameCanvas } from './gameCanvas';
import { GameState } from './gameState';
import { PointerInputEvent } from './input';
import { Sprite } from './sprite';

export interface ActorOptions {
    sprite: Sprite;
}

interface ActorLifecycleCallback {
    (self: ActorInstance, context: GameState): void;
}

interface ActorDrawCallback {
    (self: ActorInstance, canvas: GameCanvas, context: GameState): void;
}

interface ActorClickEventCallback {
    (self: ActorInstance, context: GameState, event: PointerInputEvent): void;
}

interface CollisionCallback {
    (self: ActorInstance, other: ActorInstance, context: GameState)   : void;
}

export class Actor {
    private readonly _gameState: GameState;

    // lifecycle callbacks
    private _onCreate: ActorLifecycleCallback = null;
    private _onStep: ActorLifecycleCallback = null;
    private _onDestroy: ActorLifecycleCallback = null;
    private _onDraw: ActorDrawCallback = null;

    // input callbacks
    private _onClick: ActorClickEventCallback;

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
    
    constructor(gameState: GameState, options?: ActorOptions) {
        this._gameState = gameState;

        if (options && options.sprite) {
            this.setSprite(options.sprite);
        }
    }

    setBoundaryFromSprite(sprite: Sprite): void {
        this._boundary = Boundary.fromSprite(sprite);
    }

    setSprite(sprite: Sprite): void {
        this._sprite = sprite;
    }

    onCreate(callback: ActorLifecycleCallback): void {
        this._onCreate = callback;
    }

    callCreate(self: ActorInstance): void {
        if (this._onCreate) {
            this._onCreate(self, this._gameState);
        }
    }

    onStep(callback: ActorLifecycleCallback): void {
        this._onStep = callback;
    }

    callStep(self: ActorInstance): void {
        if (this._onStep) {
            this._onStep(self, this._gameState);
        }
    }

    onDestroy(callback: ActorLifecycleCallback): void {
        this._onDestroy = callback;
    }

    callDestroy(self: ActorInstance): void {
        if (this._onDestroy) {
            this._onDestroy(self, this._gameState);
        }
    }

    onDraw(callback: ActorDrawCallback): void {
        this._onDraw = callback;
    }

    callDraw(self: ActorInstance, canvas: GameCanvas): void {
        if (this._onDraw) {
            this._onDraw(self, canvas, this._gameState);
        }
    }

    onCollide(actorName: string, callback: CollisionCallback): void {
        this.collisionHandlers[actorName] = callback;
    }

    onClick(callback: ActorClickEventCallback): void {
        this._onClick = callback;
    }

    callClick(selfInstance: ActorInstance, event: PointerInputEvent): void {
        if (this._onClick) {
            this._onClick(selfInstance, this._gameState, event);
        }
    }
}