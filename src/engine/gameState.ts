import { GameCanvas } from './gameCanvas';
import { Room } from './room';

export class GameState {
    private readonly _propertyMap: { [index: string]: any } = {};
    
    private _room: Room;
    get currentRoom(): Room {
        return this._room;
    }

    get(key: string): any {
        return this._propertyMap[key];
    }

    set(key: string, value: any): void {
        this._propertyMap[key] = value;
    }

    setRoom(room: Room) {
        if (this._room) {
            this._room.callEnd();
        }

        this._room = room;
        this._room.callStart();
    }

    _step(): void {
        this._room.step();
    }

    _draw(canvas: GameCanvas) {
        this._room.draw(canvas);
    }
}