import { Actor } from './actor';
import { GameCanvas } from './gameCanvas';
import { Room } from './room';
import { SpriteAnimation } from './spriteAnimation';

export class ActorInstance {
    private _parent: Actor;
    private _room: Room;
    private _spriteAnimation: SpriteAnimation;

    private _destroyed = false;

    get isDestroyed() { 
        return this._destroyed;
    }

    x: number = 0;
    y: number = 0;

    constructor(parent: Actor, room: Room) {
        this._parent = parent;
        this._room = room;
    }

    getParent(): Actor {
        return this._parent;
    }

    getAnimation(): SpriteAnimation {
        return this._spriteAnimation;
    }

    callCreate(): void {
        this._parent.callCreate(this);
    }

    callStep(): void {
        this._parent.callStep(this);
    }

    callDestroy(): void {
        this._parent.callDestroy(this);
    }

    callDraw(canvas: GameCanvas): void {
        this._parent.callDraw(this, canvas);
    }

    destroy(): void {
        this._destroyed = true;
        this._parent.callDestroy(this);
    }
}