export class WeaponTracer {
    constructor(player, balls, ctx, terrain, projectileCanvas, enemy) {
        this.balls = balls;
        this.player = player;
        this.ammunition = 1000;

        // TODO: Need a way to seed initial values other than using these
        // hard-coded magic numbers
        this.aimAngle = 2.136763929842662;
        this.aimPower = 15.5;

        this.aimMousex = 0;
        this.aimMousey = 0;

        this.ctx = ctx;
        this.terrain = terrain;
        this.projectileCanvas = projectileCanvas;
        this.enemy = enemy;

        this.bestSimulation = {
            distToEnemy: 50,
            didWrap: false
        };
    }

    simulate() {
        console.log('simulating!');        
        const MAX_SIMULATIONS = 10;
        
        let tmp = null //this.makeDummyProjectile();
        let trial = null //this.dryFire(tmp);
        let previousTrial = this.bestSimulation;
        let stepSize = 0.25;
        let accelerate = 1.2;
        
        // start simulations at 1 because last simulation is traced after the loop
        for (let i = 1; i < MAX_SIMULATIONS; ++i) {
            tmp = this.makeDummyProjectile();
            trial = this.dryFire(tmp);
            if (Math.abs(trial.distToEnemy) < 5) {
                this.bestSimulation = trial;
                break;
            }

            if (Math.abs(trial.distToEnemy) < Math.abs(previousTrial.distToEnemy)) {
                this.bestSimulation = trial;
                stepSize *= accelerate;
            } else {
                stepSize /= accelerate;
            }

            if (trial.distToEnemy > 0 & !trial.didWrap) {
                this.aimPower += stepSize;
            }
            if (trial.distToEnemy < 0 || trial.didWrap) {
                this.aimPower -= stepSize;
            }
            previousTrial = trial;
        }
        tmp = this.makeDummyProjectile();
        trial = this.dryFire(tmp);
        console.log(trial);
    }

    makeDummyProjectile() {
        // TODO: eliminate magic numbers. Right now x & y offsets are hard coded in Weapon.js.
        return({
            x:  this.player.x - 3, 
            y:  this.player.y - 5,
           vx:  this.aimPower / 10 * Math.cos(this.aimAngle),
           vy: -this.aimPower / 10 * Math.sin(this.aimAngle),
           isAlive: true
       });
    }

    dryFire(tmp) {
         // keep track if the projectile will wrap around around the screen
        let didWrap = false;

        const maxLoop = 1000;
        let loopCount = 0;
        // simulate the temporary ball
        while (tmp.isAlive && (loopCount < maxLoop)) {
            // TODO: add a fail-safe exit to avoid an infinite loop.

            tmp.x += tmp.vx;
            tmp.vy += 0.01;
            tmp.y += tmp.vy;
            if (tmp.x > this.projectileCanvas.width) {
                tmp.x = 0;
                didWrap = true;
            }
            if (tmp.x < 0) {
                tmp.x = this.projectileCanvas.width;
                didWrap = true;
            }
            if (tmp.y >= this.terrain.maxElevation && 
                tmp.y >= this.terrain.elevations[Math.floor(tmp.x)])
            {
                tmp.isAlive = false;
            }

            ++loopCount;

            // Draw weapon trace for debugging
            //this.ctx.fillStyle = '#000';
            //this.ctx.fillRect(tmp.x, tmp.y, 1, 1);
        }

        return (
            {
                distToEnemy: tmp.x - this.enemy.x,
                didWrap: didWrap
            });
    }

}