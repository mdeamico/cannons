export class Ball {
    constructor(strength) {
        this.x = 0;
        this.y = 0;
        this.radius = 3;
        this.vx = 1;
        this.vy = -1;
        this.isAlive = true;
        this.color = "#000000";
        this.strength = strength;
    }
}
