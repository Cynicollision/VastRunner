export interface GameCanvasOptions {
    backgroundColor?: string;
    fullScreen?: boolean;
    height?: number;
    width?: number;
}

export interface CanvasDrawOptions {
    opacity?: number;
    tileX?: boolean;
    tileY?: boolean;
}

export interface Canvas {
    getContext(contextId: string): CanvasRenderingContext2D;
    height: number;
    width: number;
}

export interface GameCanvas {
    backgroundColor: string;
    origin: [number, number];
    readonly height: number;
    readonly width: number;
    clear(): void;
    fill(width: number, height: number, color: string): void;
    fillArea(x: number, y: number, width: number, height: number, color: string): void;
    drawImage(image: HTMLImageElement, srcX: number, srcY: number, destX: number, destY: number, width: number, height: number, options?: CanvasDrawOptions): void;
}

export class GameCanvasHTML2D implements GameCanvas {
    private readonly _canvas: Canvas;

    backgroundColor: string = '#fff';
    origin: [number, number] = [0, 0];

    get height(): number {
        return this._canvas.height;
    }

    get width(): number {
        return this._canvas.width;
    }

    private get canvasContext2D(): CanvasRenderingContext2D {
        return this._canvas.getContext('2d');
    }
    
    constructor(canvasElement: Canvas, options?: GameCanvasOptions) {
        this._canvas = canvasElement;
        
        if (options) {
            this.useOptions(options);
        }
    }

    private useOptions(options: GameCanvasOptions) {
        let canvasHeight = this.height;
        let canvasWidth = this.width;

        // Canvas size
        if (options.fullScreen) {
            canvasHeight = window.innerHeight;
            canvasWidth = window.innerWidth;
        }
        else if (options.height && options.width) {
            canvasHeight = options.height;
            canvasWidth = options.width;
        }
        
        // Other options
        if (options.backgroundColor) {
            this.backgroundColor = options.backgroundColor;
        }

        this.setCanvasSize(canvasHeight, canvasWidth);
    }

    private setCanvasSize(height: number, width: number) {
        this._canvas.height = height;
        this._canvas.width = width;
    }

    clear() {
        this.canvasContext2D.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.fillArea(0, 0, this._canvas.width, this._canvas.height, this.backgroundColor);
    }

    fill(width: number, height: number, color: string) {
        let [x, y] = this.origin;
        this.fillArea(x, y, width, height, color);
    }

    fillArea(x: number, y: number, width: number, height: number, color: string) {
        this.canvasContext2D.beginPath();
        this.canvasContext2D.rect(x, y, width, height);
        this.canvasContext2D.fillStyle = color;
        this.canvasContext2D.fill();
    }

    drawImage(image: HTMLImageElement, srcX: number, srcY: number, destX: number, destY: number, width: number, height: number, options: CanvasDrawOptions = {}): void {
        // set opacity
        const defaultOpacity = 1;
        let previousOpacity: number = null;

        if (options.opacity !== defaultOpacity && options.opacity !== null && options.opacity !== undefined) {
            previousOpacity = this.canvasContext2D.globalAlpha;
            this.canvasContext2D.globalAlpha = options.opacity;
        }

        // draw the image relative to the origin
        let [originX, originY] = this.origin;

        if (options.tileX || options.tileY) {
            let repetition = options.tileX && options.tileY ? 'repeat' : options.tileX ? 'repeat-x' : 'repeat-y';
            let pattern = this.canvasContext2D.createPattern(image, repetition);
            this.canvasContext2D.fillStyle = pattern;
            this.canvasContext2D.fillRect(originX + destX, originY + destY, this.canvasContext2D.canvas.width, this.canvasContext2D.canvas.height);
        }
        else {
            this.canvasContext2D.drawImage(image, srcX, srcY, width, height, Math.floor(originX + destX), Math.floor(originY + destY), width, height);
        }

        // reset opacity
        if (previousOpacity !== null) {
            this.canvasContext2D.globalAlpha = previousOpacity;
        }
    }
}
