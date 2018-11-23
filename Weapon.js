import { Reticle } from './Reticle.js';
import { Ball } from './Ball.js'

export class Weapon {
    constructor(player, balls) {
        this.balls = balls;
        this.player = player;
        this.ammunition = 1000;
        this.reticle = new Reticle(player);
    }

    aim(e, playerCanvasBoundingClientRect) {

        let offset = playerCanvasBoundingClientRect;
    
        this.reticle.mousex = e.clientX - offset.left;
        this.reticle.mousey = e.clientY - offset.top;

        let dx = this.reticle.mousex - this.player.x;
        let dy = this.reticle.mousey - this.player.y;

        this.reticle.aimangle = Math.atan2(-dy, dx);
        this.reticle.power = Math.sqrt(Math.pow(dy, 2), Math.pow(dx, 2));
        this.reticle.power = 20 + (this.reticle.power - 100) * (50 - 20) / (200 - 100);
        this.reticle.power = this.reticle.power > 50 ? 50 : this.reticle.power; 
        this.reticle.power = this.reticle.power < 10 ? 10 : this.reticle.power;
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
        
        ball.vx = this.reticle.power / 10 * Math.cos(this.reticle.aimangle);
        ball.vy = -this.reticle.power / 10 * Math.sin(this.reticle.aimangle);
    
        this.balls.push(ball);
    }
}
