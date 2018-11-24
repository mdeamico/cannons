import { Ball } from './Ball.js'

export class Weapon {
    constructor(player, balls, ctx) {
        this.balls = balls;
        this.player = player;
        this.ammunition = 1000;

        this.aimAngle = 0;
        this.aimPower = 2;
        this.aimMousex = 0;
        this.aimMousey = 0;

        this.ctx = ctx;
        //this.reticle = new Reticle(player);
    }

    aim(e, playerCanvasBoundingClientRect) {

        // Get mouse position relative to canvas
        let offset = playerCanvasBoundingClientRect;
        this.aimMousex = e.clientX - offset.left;
        this.aimMoysey = e.clientY - offset.top;

        let dx = this.aimMousex - this.player.x;
        let dy = this.aimMoysey - this.player.y;

        this.aimAngle = Math.atan2(-dy, dx);
        this.aimPower = Math.sqrt(Math.pow(dy, 2), Math.pow(dx, 2));
        // Limit aimPower
        this.aimPower = 20 + (this.aimPower - 100) * (50 - 20) / (200 - 100);
        this.aimPower = this.aimPower > 50 ? 50 : this.aimPower; 
        this.aimPower = this.aimPower < 10 ? 10 : this.aimPower;
    }

    fire(e) {
        if (this.ammunition <= 0) {
            console.log(this.player.color, ' is out of ammo');
            return;
        }

        this.ammunition -= 1;
        console.log('Player ', this.player.color, ' fires!');

        let ball = new Ball();
        ball.color = this.player.color;
        ball.x = this.player.x - 3;
        ball.y = this.player.y - 5;
        
        ball.vx = this.aimPower / 10 * Math.cos(this.aimAngle);
        ball.vy = -this.aimPower / 10 * Math.sin(this.aimAngle);
    
        this.balls.push(ball);
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x, this.player.y);
        this.ctx.lineTo(this.player.x + this.aimPower * Math.cos(this.aimAngle), 
                        this.player.y - this.aimPower * Math.sin(this.aimAngle));
        this.ctx.stroke();
    }
}
