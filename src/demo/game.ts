import { Game, VastRunner } from './../engine/vastrunner';

let demo: Game = VastRunner.newHTMLCanvas2DGame('game');

let threeSecondsLater = demo.defineEvent('SomeEvent');
threeSecondsLater.subscribe((args: any) => {
    console.log('Test event fired! ' + args.message);
});

let playerSprite = demo.defineSprite('Player');
playerSprite.setImageSource('./resources/playerShip3_blue.png');

let player = demo.defineActor('Player');
player.setSprite(playerSprite);

let demoRoom = demo.defineRoom('Demo');
demoRoom.spawn(64, 64, player);

setTimeout(() => threeSecondsLater.fire({ message: 'Foo!' }), 3000);
demo.start(demoRoom);
