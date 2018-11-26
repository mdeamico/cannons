import { MainMenuState } from './MainMenu.js';
import { GameState } from './GameState.js';

export class GameStateMachine {
    constructor() {
        this.currentState = null;
        
        // TODO: consider constructing states on-demand rather than creating here.
        // Creating on-demand would prevent creating states never used.
        this.mainMenuState = new MainMenuState(this);
        this.gameState = new GameState(this);
    }

    changeState(newState) {
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
            default:
                console.error('Cannot enter state:', newState);
                return;
        }

        this.currentState.enter();
    }
}
