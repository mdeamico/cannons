
// class StateStack {
//     constructor() {
//         this.stack = [];
//         this.pendingChnages = [];
//     }

//     update() {}

//     draw() {}

//     handleInput() {}

// }

class MenuState {
    constructor(stack) {
        this.stack = stack;
    }

    enter() {
        document.getElementById('main').style.display = 'block';
        document.getElementById('btn1').onclick = this.onExitBtn.bind(this);
    }

    exit() {
        document.getElementById('main').style.display = 'none';
        document.getElementById('btn1').onclick = null;
    }

    draw() {
        console.log('menu drawing');
    }

    update() {
        console.log('menu updating!');
    }

    handleInput() {
        console.log('menu handling input!');
    }

    onExitBtn() {
        console.log("clicked!!");
        this.exit();
    }

}


class GameState {
    constructor(stack) {
        this.stack = stack;
    }

    enter() {

    }

    exit() {
        
    }

    draw() {
        console.log('game drawing');
    }

    update() {
        console.log('game updating!');
    }

    handleInput() {
        console.log('game handling input!');
    }
}



class Application {
    constructor() {
        this.stateStack = []; //new StateStack();
        this.menuState = new MenuState(this.stateStack);
        this.gameState = new GameState(this.stateStack);
        
        this.menuState.enter();
        this.stateStack.push(this.menuState);
    }

    run() {
        let currentState = this.stateStack[this.stateStack.length - 1];
        currentState.handleInput();
        currentState.update();
        currentState.draw();

        // ---- OR ------
        // loop through entire stack (call handleInput, update, & draw on all
        // states in stack, exit loop early if a state is "blocking". e.x "pause"
        // state blocks input to states below)
    }
}

let app = new Application();

app.run();
