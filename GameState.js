import { Game } from './Game.js';

export class GameState {
    constructor(stateMachine) {
        this.stateMachine = stateMachine;
        this.game = null;
        this.loopID = null; // keep track of requestAnimationFrame ID
    }

    enter() {
        document.getElementById('stage').style.display = 'block';
        
        // Setup UI functions
        document.getElementById('pause').onclick = this.pause.bind(this);

        document.getElementById('player-layer').onmouseup = function(e) {

            this.game.activePlayer.weapon.fire();
            this.game.switchPlayer();

        }.bind(this)

        document.getElementById('player-layer').onmousemove = function(e) {

            this.game.activePlayer.weapon.aim(e, document.getElementById('player-layer').getBoundingClientRect());

        }.bind(this)

        // Setup Game
        this.game = new Game(
            {
                'terrain': document.getElementById('terrain-layer'),
                'player': document.getElementById('player-layer'),
                'projectile': document.getElementById('projectile-layer')
            }
        );

        this.game.setup();
        this.loopID = requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(ts) {
        this.game.update();
        this.game.draw();
    
        this.loopID = requestAnimationFrame(this.gameLoop.bind(this));
    }


    exit() {
        //TODO: Implement exit
    }

    pause() {
        //TODO: Implement pause
        console.log('pause!');
    }
}









