import { MainMenuState } from './MainMenu.js';
import { GameState } from './GameState.js';
import { PauseState } from './PauseState.js';
import { GameOverState } from './GameOver.js';

export class GameStateMachine {
    constructor() {
        this.currentState = null;
        
        // TODO: consider constructing states on-demand rather than creating here.
        // Creating on-demand would prevent creating states never used.
        this.reset();
    }

    changeState(newState, parameters) {
        if (this.currentState) {
            this.currentState.exit();
        }

        switch(newState) {
            case 'mainMenuState' :
                this.currentState = this.mainMenuState;
                break;
            case 'gameState' :
                this.currentState = this.gameState;
                break;
            case 'pauseState' :
                this.currentState = this.pauseState;
                break;
            case 'gameOverState' :
                this.currentState = this.gameOverState;
                break;
            default:
                console.error('Cannot enter state:', newState);
                return;
        }

        this.currentState.enter(parameters);
    }

    reset() {
        this.mainMenuState = new MainMenuState(this);
        this.gameState = new GameState(this);
        this.pauseState = new PauseState(this);
        this.gameOverState = new GameOverState(this);        
    }
}
