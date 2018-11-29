import { ClusterBall } from './ClusterBall.js'
import { Ball } from './Ball.js'

export class Weapon3 {
    constructor(player, balls, ctx) {
        this.balls = balls;
        this.player = player;
        this.ammunition = 1000;

        this.aimAngle = 0;
        this.aimPower = 2;
        this.aimMousex = 0;
        this.aimMousey = 0;

        this.ctx = ctx;
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

    fire() {
        if (this.ammunition <= 0) {
            console.log(this.player.color, ' is out of ammo');
            return;
        }

        this.ammunition -= 1;
        console.log('Player ', this.player.color, ' fires!');

        let ball = new ClusterBall(100, this.releaseCluster.bind(this));
        ball.color = this.player.color;
        ball.x = this.player.x - 3;
        ball.y = this.player.y - 5;
        
        ball.vx = this.aimPower / 10 * Math.cos(this.aimAngle);
        ball.vy = -this.aimPower / 10 * Math.sin(this.aimAngle);
    
        this.balls.push(ball);
    }

    releaseCluster(ballData) {
        let coordinates = {x: ballData.x, y: ballData.y}
        let submunition1 = {
            vx: ballData.vx * 0.9,
            coordinates: coordinates
        }
        let submunition2 = {
            vx: ballData.vx * 1.0,
            coordinates: coordinates
        }
        let submunition3 = {
            vx: ballData.vx * 1.1,
            coordinates: coordinates
        }
        this.makeSubmunition(submunition1);
        this.makeSubmunition(submunition2);
        this.makeSubmunition(submunition3);
    }

    makeSubmunition(parameters) {
        let ball = new Ball(33);
        ball.color = this.player.color;
        ball.x = parameters.coordinates.x;
        ball.y = parameters.coordinates.y;
        
        ball.vx = parameters.vx;
        ball.vy = 0
    
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
