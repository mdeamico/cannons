export class GameOverState {
    constructor(stateMachine) {
        this.stateMachine = stateMachine;
    }

    enter() {
        document.getElementById('gameover-container').style.display = 'block';
        document.getElementById('new-game').onclick = this.restart.bind(this);
    }

    exit() {
        document.getElementById('gameover-container').style.display = 'none';
        document.getElementById('new-game').onclick = null;
    }

    restart() {
        console.log("restart game");
        this.stateMachine.reset();
        this.stateMachine.changeState('mainMenuState');
    }

}