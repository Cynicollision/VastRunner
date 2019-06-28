import { Actor } from './actor';
import { ActorState } from './enum';
import { Boundary } from './boundary';
import { GameCanvas } from './gameCanvas';
import { MathUtil } from './mathUtil';
import { SpriteAnimation } from './spriteAnimation';

export class ActorInstance {
    private _previousX: number;
    private _previousY: number;
    private _state: ActorState;

    speed: number = 0;
    direction: number = 0;
    x: number = 0;
    y: number = 0;

    private readonly _id: number;
    public get id(): number {
        return this._id;
    }

    private readonly _parent: Actor;
    public get parent(): Actor {
        return this._parent;
    }

    private readonly _spriteAnimation: SpriteAnimation;
    public get spriteAnimation(): SpriteAnimation {
        return this._spriteAnimation;
    }

    get active(): boolean {
        return (this._state === ActorState.Active);
    }

    get boundary(): Boundary {
        return this.parent.boundary;
    }

    get hasMoved(): boolean {
        return (this.x !== this._previousX || this.y !== this._previousY);
    }

    constructor(parent: Actor, id: number) {
        this._state = ActorState.Active;
        this._parent = parent;
        this._id = id;

        if (this._parent.sprite) {
            this._spriteAnimation = new SpriteAnimation(this._parent.sprite);
        }
    }

    destroy(): void {
        this._state = ActorState.Destroyed;
        this._parent.callDestroy(this);
    }

    applyMovement(): void {
        if (this.speed !== 0) {
            let offsetX = Math.round(MathUtil.getLengthDirectionX(this.speed * 100, this.direction) / 100);
            let offsetY = Math.round(MathUtil.getLengthDirectionY(this.speed * 100, this.direction) / 100);
    
            if (offsetX !== 0 || offsetY !== 0) {
                this.setPositionRelative(offsetX, offsetY);
            }
        }
    }

    collidesWith(other: ActorInstance): boolean {

        if (this.hasMoved && this.boundary && other.boundary) {
            return this.boundary.atPosition(this.x, this.y).collidesWith(other.boundary.atPosition(other.x, other.y));
        }

        return false;
    }

    setPosition(x: number, y: number): void {
        this._previousX = this.x;
        this._previousY = this.y;

        this.x = x;
        this.y = y;
    }

    setPositionRelative(x: number, y: number): void {
        this.setPosition(this.x + x, this.y + y);
    }

    occupiesPosition(x: number, y: number): boolean {
        return this.boundary ? this.boundary.atPosition(this.x, this.y).containsPosition(x, y) : false;
    }
}