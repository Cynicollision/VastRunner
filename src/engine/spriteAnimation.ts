import { SpriteTransformation } from './enum';
import { GameCanvas } from './gameCanvas';
import { Sprite, DrawSpriteOptions } from './sprite';

export class SpriteAnimation {
    private readonly _sprite;
    private transformations: { [index: number]: SpriteTransformation } = {};
    private timer: any;

    depth: number = 0;

    private _paused: boolean = true;
    get paused(): boolean {
        return this._paused;
    }

    constructor(sprite: Sprite) {
        this._sprite = sprite;

        this.setTransform(SpriteTransformation.Frame, 0);
        this.setTransform(SpriteTransformation.Opacity, 1);
    }

    start(start: number, end: number, delay?: number): void {
        this.stop();
        this.setTransform(SpriteTransformation.Frame, start);

        this._paused = false;
        this.timer = setInterval(() => {
            if (this.getTransform(SpriteTransformation.Frame) === end) {
                this.setTransform(SpriteTransformation.Frame, start);
            }
            else {
                this.transform(SpriteTransformation.Frame, 1);
            }
        }, delay);
    }

    stop(): void {
        this._paused = true;
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    setFrame(frame: number): void {
        this.stop();
        this.setTransform(SpriteTransformation.Frame, frame);
    }

    draw(canvasContext: GameCanvas, x: number, y: number, options: DrawSpriteOptions = {}): void {
        if (this._sprite.image) {
            // frame
            let frame = this.getTransform(SpriteTransformation.Frame);
            if (options.frame !== null && options.frame !== undefined) {
                this.setTransform(SpriteTransformation.Frame, options.frame);
            }

            // opacity
            let opacity = this.getTransform(SpriteTransformation.Opacity);
            if (options.frame !== null && options.frame !== undefined) {
                this.setTransform(SpriteTransformation.Opacity, options.opacity);
            }

            let [srcX, srcY] = this._sprite.getFrameImageSourceCoords(frame);
            
            canvasContext.drawImage(this._sprite.image, srcX, srcY, x, y, this._sprite.width, this._sprite.height, options);
        }
    }

    // transformations
    getTransform(transformation: SpriteTransformation): number {
        return this.transformations[transformation];
    }

    transform(transformation: SpriteTransformation, delta: number): void {
        this.transformations[transformation] += delta;
    }

    setTransform(transformation: SpriteTransformation, value: number): void {
        this.transformations[transformation] = value;
    }
}
