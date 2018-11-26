import { GameStateMachine } from './GameStateMachine.js';

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
