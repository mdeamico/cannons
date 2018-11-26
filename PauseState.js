export class PauseState {
    constructor(stateMachine) {
        this.stateMachine = stateMachine;
    }

    enter() {
        document.getElementById('pause-container').style.display = 'block';
        document.getElementById('resume').onclick = this.onResumeBtn.bind(this);
    }

    exit() {
        document.getElementById('pause-container').style.display = 'none';
    }

    onResumeBtn() {
        console.log("Resume Button clicked!!");    
        this.stateMachine.changeState('gameState');
    }
}
