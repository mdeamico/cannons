export class MainMenuState {
    constructor(stateMachine) {
        this.stateMachine = stateMachine;
    }

    enter() {
        document.getElementById('main').style.display = 'block';
        document.getElementById('start').onclick = this.onStartBtn.bind(this);
    }

    exit() {
        document.getElementById('main').style.display = 'none';
        document.getElementById('start').onclick = null;
    }

    onStartBtn() {
        console.log("Start Button clicked!!");
        this.stateMachine.changeState('gameState');
    }

}
