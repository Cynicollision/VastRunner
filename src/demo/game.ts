import { Game, VastRunner } from './../engine/vastrunner';

let demo: Game = VastRunner.newHTMLCanvas2DGame('canvasId');

let threeSecondsLater = demo.defineEvent('SomeEvent');
threeSecondsLater.subscribe((args: any) => {
    console.log('Test event fired!');
});

setTimeout(() => threeSecondsLater.fire(), 3000);
demo.start();
