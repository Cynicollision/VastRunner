import { GameCanvas } from './gameCanvas';
import { SpriteAnimation } from './spriteAnimation';

export interface SpriteOptions {
    imageSource: string;
    height?: number;
    width?: number;
    frameBorder?: number;
}

export interface DrawSpriteOptions {
    frame?: number;
    opacity?: number;
    tileX?: boolean;
    tileY?: boolean;
}

export class Sprite {

    private readonly _defaultAnimation: SpriteAnimation;
    private _image: HTMLImageElement;
    private _height: number;
    private _width: number;
    private _frameBorder: number;

    get image(): HTMLImageElement {
        return this._image;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    constructor(options: SpriteOptions) {
        this._defaultAnimation = new SpriteAnimation(this);
        this.setImageSource(options.imageSource);
        this._height = options.height;
        this._width = options.width;
    }

    setImageSource(source: string): void {
        this._image = new Image();
        this._image.src = source;
    }

    setSize(width: number, height: number): void {
        this._height = height;
        this._width = width;
    }

    setFrameBorder(border: number): void {
        this._frameBorder = border;
    }

    getFrameImageSourceCoords(frame: number): [number, number] {
        let frameBorder = this._frameBorder || 0;
        let frameRow = 0;

        if (this._image.width) {
            let framesPerRow = Math.floor(this._image.width / this._width);
            while (this._width * frame >= framesPerRow * this._width) {
                frame -= framesPerRow;
                frameRow++;
            }
        }

        let frameXOffset = frame * frameBorder;
        let frameYOffset = frameRow * frameBorder;
        let srcX = frame * this._width + frameXOffset;
        let srcY = frameRow * this._height + frameYOffset;

        return [srcX, srcY];
    }

    draw(canvas: GameCanvas, x: number, y: number, options: DrawSpriteOptions = {}): void {
        this._defaultAnimation.setFrame(options.frame || 0);
        this._defaultAnimation.draw(canvas, x, y, options);
    }
}
