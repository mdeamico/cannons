import { Terrain } from './terrain/Terrain.js';
import { Player } from './Player.js';
import { PlayerBot } from './PlayerBot.js';
import { Weapon } from './weapons/Weapon.js'
import { Weapon2 } from './weapons/Weapon2.js'
import { Weapon3 } from './weapons/Weapon3.js'
import { WeaponTracer } from './weapons/WeaponTracer.js'

export class Game {
    
    constructor(parameters) {
        console.log(parameters);
        this.canvases = parameters.canvases;
        this.ctx = {
            'terrain': this.canvases.terrain.getContext('2d'),
            'player': this.canvases.player.getContext('2d'),
            'projectile': this.canvases.projectile.getContext('2d'),
        }

        this.terrain = new Terrain(this.canvases.terrain);

        this.balls = [];

        this.player1 = new Player(1);
        this.player1.color = "#B357AE";
        assignWeapon(this.player1, parameters.options.Player1Weapon, this.balls, this.ctx.player);
        
        
        if (parameters.options.Player2Type == "Human") {
            this.player2 = new Player(2);
        } else {
            this.player2 = new PlayerBot(2);
            this.player2.weaponTracer = 
                new WeaponTracer(
                    this.player2,
                    this.balls,
                    this.ctx.terrain,
                    this.terrain, 
                    this.canvases.projectile,
                    this.player1);

             window.PubSub.subscribe('bot-attacked', this.switchPlayer.bind(this));
        }

        this.player2.color = "#57aeb3";
        assignWeapon(this.player2, parameters.options.Player2Weapon, this.balls, this.ctx.player);

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
            if (ball.y >= this.terrain.elevations[Math.floor(ball.x)]) {
                let minX = Math.max(0, Math.floor(ball.x - ball.radius));
                let maxX = Math.min(this.terrain.elevations.length, Math.floor(ball.x + ball.radius));
                for (let x = minX; x < maxX; ++x) {
                    this.terrain.elevations[x] += ball.radius;
                }
                drawTerrain(this.terrain, this.canvases.terrain);
            }

            // Collision w/ Players
            function checkPlayerCollision(player) {
                const hitTolerance = 50;
                const distToplayer = Math.abs(ball.x - player.x);

                if (distToplayer < hitTolerance) {
                    player.changeHealth(
                        -Math.round((hitTolerance - distToplayer) * ball.strength / 100));
                }

                if (player.health <= 0) {
                    window.PubSub.publish('Player-died', {playerID: player.id});
                    // clean up PubSub subscriptions
                    window.PubSub.unsubscribe('ball-launched');
                    window.PubSub.unsubscribe('bot-attacked');
                }

            }
            checkPlayerCollision(this.player1);
            checkPlayerCollision(this.player2);
        }

        // remove dead balls
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

        if (this.activePlayer.isBot) {
            this.activePlayer.attack();
        }
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

function assignWeapon(player, weapon, balls, ctx) {
    switch(weapon) {
        case 'Weapon1' :
            player.weapon = new Weapon(player, balls, ctx);
            break;
        case 'Weapon2' :
            player.weapon = new Weapon2(player, balls, ctx);
            break;
        case 'Weapon3' :
            player.weapon = new Weapon3(player, balls, ctx);
            break;
        default:
            console.error('Cannot assign Player weapon:', weapon);
            return;
    }
}