export class ClusterBall {
    constructor(strength, releaseCallback) {
        this.x = 0;
        this.y = 0;
        this.radius = 3;
        this.vx = 1;
        this.vy = -1;
        this.isAlive = true;
        this.color = "#000000";
        this.strength = strength;
        this.previousY = 9999;
        this.release = releaseCallback;
    }

    update() {
        if (this.y > this.previousY) {
            this.isAlive = false;
            this.release(this);
        }
        this.previousY = this.y;
    }
}