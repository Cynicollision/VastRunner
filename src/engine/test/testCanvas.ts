import { Canvas, GameCanvas, CanvasDrawOptions } from './../gameCanvas';

export class TestCanvas implements Canvas {
    height = 0;
    width = 0;

    getContext(contextId: string): CanvasRenderingContext2D {
        return <CanvasRenderingContext2D>{};
    }
}

export class TestGameCanvas implements GameCanvas {
    readonly backgroundColor: 'notarealcanvas';
    readonly origin: [number, number] = [0, 0];

    private _testCanvas: TestCanvas = new TestCanvas();

    get height(): number {
        return this._testCanvas.height;
    }

    get width(): number {
        return this._testCanvas.width;
    }

    clear() {
    }

    fill(width: number, height: number, color: string) {
    }

    fillArea(x: number, y: number, width: number, height: number, color: string) {
    }

    drawImage(image: HTMLImageElement, srcX: number, srcY: number, destX: number, destY: number, width: number, height: number, options: CanvasDrawOptions = {}): void {
    }
}
