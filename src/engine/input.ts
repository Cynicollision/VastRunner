export class InputHandler {
    private _clickHandlers: EventHandler<PointerInputEvent>[] = [];

    private _activePointerEvent: PointerInputEvent = null;
    get activePointerEvent(): PointerInputEvent {
        return this._activePointerEvent;
    }

    get clickActive(): boolean {
        return !!this._activePointerEvent;
    }

    constructor() {
        let self = this;

        function trackActiveMousePosition(this: any, ev: MouseEvent) {
            self._activePointerEvent.currentX = getMouseEventX(ev);
            self._activePointerEvent.currentY = getMouseEventY(ev);
        };

        let trackActiveTouchPosition = (ev: TouchEvent) => {
            document.body.onmousemove = null;
            self._activePointerEvent.currentX = getTouchEventX(ev);
            self._activePointerEvent.currentY = getTouchEventY(ev);
        };

        // register mouse/touch input 
        let raisePointerEvent = (ev: PointerInputEvent) => {
            if (self._activePointerEvent) {
                return;
            }

            self._activePointerEvent = ev;
            document.body.onmousemove =  trackActiveMousePosition;
            document.body.ontouchmove = trackActiveTouchPosition;

            if (self._clickHandlers.length) {

                self._clickHandlers.forEach((handler: EventHandler<PointerInputEvent>) => {
                    if (handler.isActive) {
                        handler.callback(ev);
                    }
                });
            }
        };

        let endPointerEvent = () => {
            self._activePointerEvent = null;
            document.body.onmousemove = null;
            document.body.ontouchmove = null;
        };

        document.body.onmousedown = function(this: any, ev: MouseEvent) {
            raisePointerEvent(PointerInputEvent.fromMouseEvent(ev));
        };
        document.body.ontouchstart = function (ev: TouchEvent) {
            document.body.onmousedown = null;
            raisePointerEvent(PointerInputEvent.fromTouchEvent(ev));
        };
        document.body.onmouseup = endPointerEvent;
        document.body.ontouchend = endPointerEvent;
    }

    registerClickHandler(callback: (event: PointerInputEvent) => void): EventHandler<PointerInputEvent> {
        let clickHandler = new EventHandler<PointerInputEvent>(callback);
        this._clickHandlers.push(clickHandler);

        return clickHandler;
    }
}

export class EventHandler<T> {
    isAlive: boolean = true;
    isAwake: boolean = true;

    constructor(public callback: (event: T) => void) {
    }

    get isActive(): boolean {
        return this.isAlive && this.isAwake;
    }
    dispose(): void {
        this.isAlive = false;
    }
    sleep(): void {
        this.isAwake = false;
    }
    wake(): void {
        this.isAwake = true;
    }
}

export class PointerInputEvent {
    x: number;
    y: number;

    currentX: number;
    currentY: number;

    static fromMouseEvent(ev: MouseEvent): PointerInputEvent {
        let x = ev.offsetX
        let y = ev.offsetY;
        return { x: x, y: y, currentX: x, currentY: y };
    }

    static fromTouchEvent(ev: TouchEvent): PointerInputEvent {
        let x = getTouchEventX(ev);
        let y = getTouchEventY(ev);
        return { x: x, y: y, currentX: x, currentY: y };
    }
}

function getMouseEventX(ev: MouseEvent): number {
    return ev.offsetX;
}

function getMouseEventY(ev: MouseEvent): number {
    return ev.offsetY;
}

function getTouchEventX(ev: TouchEvent): number {
    let touch = ev.touches[0];
    return touch ? touch.clientX : 0
}

function getTouchEventY(ev: TouchEvent): number {
    let touch = ev.touches[0];
    return touch ? touch.clientY : 0
}