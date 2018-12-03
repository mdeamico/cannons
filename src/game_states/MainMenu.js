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
        let initData = {
            Player1Weapon: document.querySelector('input[name="Player1-weapon"]:checked').value,
            Player2Type: document.querySelector('input[name="Player2-type"]:checked').value,
            Player2Weapon: document.querySelector('input[name="Player2-weapon"]:checked').value
        }
        
        this.stateMachine.changeState('gameState', initData);
    }

}
