import { Game } from './Game.js';


let game = new Game(
    {
        'terrain': document.getElementById('terrain-layer'),
        'player': document.getElementById('player-layer'),
        'projectile': document.getElementById('projectile-layer')
    }
);

function gameLoop(ts) {
    game.update();
    game.draw();

    requestAnimationFrame(gameLoop);
}
game.setup();
requestAnimationFrame(gameLoop);


// Input Handler ---------------------------------------------------------------
document.getElementById('player-layer').onmouseup = function(e) {

    game.activePlayer.weapon.fire(e);
    game.switchPlayer();
}


document.getElementById('player-layer').onmousemove = function(e) {

    game.activePlayer.weapon.aim(e, document.getElementById('player-layer').getBoundingClientRect());

}
