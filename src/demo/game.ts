import { Game, VastRunner } from './../engine/vastrunner';

let demo: Game = VastRunner.newHTMLCanvas2DGame('game');

// Events
let threeSecondsLater = demo.defineEvent('SomeEvent');
threeSecondsLater.subscribe((args: any) => {
    console.log('Test event fired! ' + args.message);
});
setTimeout(() => threeSecondsLater.fire({ message: 'Foo!' }), 3000);

// Sprites
let playerShipSprite = demo.defineSprite('Player', {
    imageSource: './resources/playerShip3_blue.png',
});

// Actors
let ship = demo.defineActor('Ship', {
    sprite: playerShipSprite,
});

ship.onCreate((self, context) => {
    self.speed = 4;
});

ship.onStep((self, context) => {
    if (self.x > 800 || self.x < -100) {
        self.speed *= -1;
    }
})

let demoRoom = demo.defineRoom('Demo');

for (let i = 0; i < 10; i++) {
    demoRoom.spawn(64 * i, 64 * i, ship);
}


demo.start(demoRoom);
