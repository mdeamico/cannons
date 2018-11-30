import { GameStateMachine } from './game_states/GameStateMachine.js';

class Application {
    constructor() {
        this.gameStateMachine = new GameStateMachine();
    }

    run() {
        this.gameStateMachine.changeState('mainMenuState');
    }
}

let app = new Application();

app.run();
