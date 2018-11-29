import { Terrain } from './Terrain.js';
import { Player } from './Player.js';
import { Weapon } from './Weapon.js'
import { Weapon2 } from './Weapon2.js'
import { Weapon3 } from './Weapon3.js'

export class Game {
    
    constructor(canvases) {
        this.canvases = canvases;
        this.ctx = {
            'terrain': canvases.terrain.getContext('2d'),
            'player': canvases.player.getContext('2d'),
            'projectile': canvases.projectile.getContext('2d'),
        }

        this.terrain = new Terrain(canvases.terrain);

        this.balls = [];

        this.player1 = new Player(1);
        this.player1.color = "#B357AE";
        this.player1.weapon = new Weapon3(this.player1, this.balls, this.ctx.player);

        this.player2 = new Player(2);
        this.player2.color = "#57aeb3";
        this.player2.weapon = new Weapon2(this.player2, this.balls, this.ctx.player);
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

        this.activePlayer = this.player1;
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

            ball.update();
        }

        // damage terrain and players for balls that hit the terrain
        for (let ball of this.balls) {
            if (ball.isAlive) continue;
            
            // Collision w/ Terrain
            let minX = Math.max(0, Math.floor(ball.x - ball.radius));
            let maxX = Math.min(this.terrain.elevations.length, Math.floor(ball.x + ball.radius));
            for (let x = minX; x < maxX; ++x) {
                this.terrain.elevations[x] += ball.radius;
            }
            drawTerrain(this.terrain, this.canvases.terrain);

            // Collision w/ Players
            function checkPlayerCollision(player) {
                const hitTolerance = 50;
                const distToplayer = Math.abs(ball.x - player.x);

                if (distToplayer < hitTolerance) {
                    player.changeHealth(
                        -Math.round((hitTolerance - distToplayer) * ball.strength / 100));
                }
            }
            checkPlayerCollision(this.player1);
            checkPlayerCollision(this.player2);
        }

        // remove balls that hit the terrain
        for (let i = this.balls.length - 1; i >= 0; --i) {
            let ball = this.balls[i];

            if (ball.isAlive) continue;
            this.balls.splice(i, 1);
        }

    }

    draw() {
        // draw on projectile layer
        this.ctx.projectile.clearRect(0, 0, this.canvases.projectile.width, this.canvases.projectile.height);
        drawBalls(this.balls, this.ctx.projectile);

        // draw on player layer
        this.ctx.player.clearRect(0, 0, this.canvases.player.width, this.canvases.player.height);
        this.activePlayer.weapon.draw();
        drawPlayers(this.player1, this.player2, this.ctx.player);  
    }

    switchPlayer() {
        if (this.player1.myTurn) {
            this.activePlayer = this.player2;
        } else {
            this.activePlayer = this.player1;
        }
        this.player1.myTurn = !this.player1.myTurn;
        this.player2.myTurn = !this.player2.myTurn;
    }

}


function drawBalls(balls, ctx) {
    for (let ball of balls) {
        if (!ball.isAlive) continue;

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fillStyle = ball.color;
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
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x - 3, player1.y - 5, 6, 5);
    
    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x - 3, player2.y - 5, 6, 5);
}
