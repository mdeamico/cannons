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

        window.PubSub.subscribe('Player-health-change', this.subUI_health);

        // Setup a new game if one is not already in progress
        if (!this.game) {
            this.game = new Game(
                {
                    'terrain': document.getElementById('terrain-layer'),
                    'player': document.getElementById('player-layer'),
                    'projectile': document.getElementById('projectile-layer')
                }
            );

            this.game.setup();
        }

        // Start the game loop
        this.loopID = requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(ts) {
        this.game.update();
        this.game.draw();
    
        this.loopID = requestAnimationFrame(this.gameLoop.bind(this));
    }


    exit() {
        cancelAnimationFrame(this.loopID);
        document.getElementById('pause').onclick = null;
        document.getElementById('player-layer').onmousemove = null;
        document.getElementById('player-layer').onmouseup = null;
    }

    pause() {
        console.log('pause!');
        this.stateMachine.changeState('pauseState');
    }

    subUI_health(msg, data) {
        let playerLabel = 'Player' + data.playerID;
        document.getElementById(playerLabel + '-health').innerText = 
            playerLabel + ' health: ' + data.health;
    }
}









