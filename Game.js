import { Terrain } from './Terrain.js';
import { Ball } from './Ball.js';
import { Player } from './Player.js';
import { Reticle } from './Reticle.js';

export class Game {
    
    constructor(canvases) {
        this.canvases = canvases;
        this.ctx = {
            'terrain': canvases.terrain.getContext('2d'),
            'player': canvases.player.getContext('2d'),
            'projectile': canvases.projectile.getContext('2d'),
        }

        this.terrain = new Terrain(canvases.terrain);

        this.player1 = new Player();
        this.player2 = new Player();

        this.balls = [];

        this.reticle = new Reticle();
    }

    setup() {

        drawTerrain(this.terrain, this.canvases.terrain);

        // Position Players
        for (let i = 30; i < Math.floor(this.terrain.elevations.length / 3); ++i) {
            if (this.player1.y < this.terrain.elevations[i]) {
                this.player1.x = i;
                this.player1.y = this.terrain.elevations[i];
            }
        }

        for (let i = Math.floor(this.terrain.elevations.length * 2 / 3); 
             i < this.terrain.elevations.length - 30; 
             ++i)
        {
            if (this.player2.y < this.terrain.elevations[i]) {
                this.player2.x = i;
                this.player2.y = this.terrain.elevations[i];
            }
        }
        this.player1.myTurn = true;
    }

    update() {
        // Ball
        for (let ball of this.balls) {
            ball.x += ball.vx;
            ball.vy += 0.01;
            ball.y += ball.vy;
            if (ball.x > this.canvases.projectile.width) {
                ball.x = 0;
            }
            if (ball.x < 0) {
                ball.x = this.canvases.projectile.width;
            }
            if (ball.y >= this.terrain.maxElevation && 
                ball.y >= this.terrain.elevations[Math.floor(ball.x)])
            {
                ball.isAlive = false;
            }
        }

        // damage terrain for this.balls that hit the terrain
        for (let i = this.balls.length - 1; i >= 0; --i) {
            let ball = this.balls[i];

            if (ball.isAlive) continue;
            
            let minX = Math.max(0, Math.floor(ball.x - ball.radius));
            let maxX = Math.min(this.terrain.elevations.length, Math.floor(ball.x + ball.radius));
            for (let x = minX; x < maxX; ++x) {
                this.terrain.elevations[x] += ball.radius;
            }
            drawTerrain(this.terrain, this.canvases.terrain);
            this.balls.splice(i, 1);
        }
    }

    draw() {
        // draw on projectile layer
        this.ctx.projectile.clearRect(0, 0, this.canvases.projectile.width, this.canvases.projectile.height);
        drawBalls(this.balls, this.ctx.projectile);

        // draw on player layer
        this.ctx.player.clearRect(0, 0, this.canvases.player.width, this.canvases.player.height);
        drawReticle(this.reticle, this.player1.myTurn ? this.player1 : this.player2, this.ctx.player);
        drawPlayers(this.player1, this.player2, this.ctx.player);  
    }

    triggerReticleUpdate(e) {
        // TODO: refactor this function. Some of the reticle update occurs here,
        // some occurs in the updateReticle function.
        // The whole reticle coding seems to be out of place.
        let player = this.player1.myTurn ? this.player1 : this.player2;

        let offset = this.canvases.player.getBoundingClientRect();
    
        this.reticle.mousex = e.clientX - offset.left;
        this.reticle.mousey = e.clientY - offset.top;
    
        updateReticle(this.reticle, player);
    }

    releaseBall(e) {

        let player = this.player1.myTurn ? this.player1 : this.player2;

        // let offset = this.canvases.player.getBoundingClientRect();
    
        // let mousex = e.clientX - offset.left;
        // let mousey = e.clientY - offset.top;
    
        // let angle = Math.atan2(-(mousey - player.y), (mousex - player.x));
        // console.log(angle);
    
        let ball = new Ball();
        ball.x = player.x - 3;
        ball.y = player.y - 5;
        
        ball.vx = this.reticle.power / 10 * Math.cos(this.reticle.aimangle);
        ball.vy = -this.reticle.power / 10 * Math.sin(this.reticle.aimangle);
        //console.log([ball.vx, ball.vy]);
    
        this.balls.push(ball);
    
        this.switchPlayer();
        player = this.player1.myTurn ? this.player1 : this.player2;
        updateReticle(this.reticle, player);
    }

    switchPlayer() {
        this.player1.myTurn = !this.player1.myTurn;
        this.player2.myTurn = !this.player2.myTurn;
    }

}


function drawBalls(balls, ctx) {
    for (let ball of balls) {
        if (!ball.isAlive) continue;

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}


function drawTerrain(terrain, canvas) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for(let x = 0; x < canvas.width; ++x) {
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x, terrain.elevations[x]);
    }
    ctx.stroke();
}


function drawPlayers(player1, player2, ctx) {
    ctx.fillStyle = "#B357AE";
    ctx.rect(player1.x - 3, player1.y - 5, 6, 5);
    ctx.rect(player2.x - 3, player2.y - 5, 6, 5);
    ctx.fill(); 
}


function drawReticle(reticle, player, ctx) {

    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x + reticle.power * Math.cos(reticle.aimangle), 
               player.y - reticle.power * Math.sin(reticle.aimangle));
    ctx.stroke();
}


function updateReticle(reticle, player) {
    let dx = reticle.mousex - player.x;
    let dy = reticle.mousey - player.y;
    reticle.aimangle = Math.atan2(-dy, dx);
    reticle.power = Math.sqrt(Math.pow(dy, 2), Math.pow(dx, 2));
    reticle.power = 20 + (reticle.power - 100) * (50 - 20) / (200 - 100);
    reticle.power = reticle.power > 50 ? 50 : reticle.power; 
    reticle.power = reticle.power < 10 ? 10 : reticle.power;
}
