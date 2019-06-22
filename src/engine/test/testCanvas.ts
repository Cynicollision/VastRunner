import { GameCanvas, CanvasDrawOptions } from './../gameCanvas';

export class TestGameCanvasHTML2D implements GameCanvas {
    readonly origin: [number, number] = [0, 0];

    // init(): void{
    // }

    // getContext(): TestGameCanvasContext {
    //     return new TestGameCanvasContext();
    // }

    clear() {
    }

    fill(width: number, height: number, color: string) {
    }

    fillArea(x: number, y: number, width: number, height: number, color: string) {
    }

    drawImage(image: HTMLImageElement, srcX: number, srcY: number, destX: number, destY: number, width: number, height: number, options: CanvasDrawOptions = {}): void {
    }
}

// export class TestGameCanvasContext implements GameCanvasContext {
//     origin: [number, number];

//     constructor() {
//         this.origin = [0, 0];
//     }

//     clear() {
//     }

//     fill(width: number, height: number, color: string) {
//     }

//     fillArea(x: number, y: number, width: number, height: number, color: string) {
//     }

//     drawImage(image: HTMLImageElement, srcX: number, srcY: number, destX: number, destY: number, width: number, height: number, options: CanvasDrawOptions = {}): void {
//     }
// }