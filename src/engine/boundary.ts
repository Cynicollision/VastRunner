import { Sprite } from './sprite';

export class PositionedBoundary {
    private _x: number;
    private _y: number;
    private _height: number;
    private _width: number;

    constructor(x: number, y: number, boundary: Boundary) {
        this._x = x;
        this._y = y;
        this._height = boundary.height;
        this._width = boundary.width;
    }

    collidesWith(other: PositionedBoundary): boolean {
        if (this._x > other._x + other._width || other._x >= this._x + this._width) {
            return false;
        }

        if (this._y > other._y + other._height || other._y >= this._y + this._height) {
            return false;
        }

        return true;
    }

    containsPosition(x: number, y: number): boolean {
        if (this._x > x || x > this._x + this._width) {
            return false;
        }

        if (this._y > y || y > this._y + this._height) {
            return false;
        }

        return true;
    }
}

export class Boundary {
    height: number;
    width: number;

    static fromSprite(sprite: Sprite): Boundary {
        return new Boundary(sprite.height, sprite.width);
    }

    constructor(height: number, width: number) {
        if (height <= 0 || width <= 0) {
            throw new Error('Height and width must both be greater than zero.');
        }

        this.height = height;
        this.width = width;
    }

    atPosition(x: number, y: number): PositionedBoundary {
        return new PositionedBoundary(x, y, this);
    }
}
