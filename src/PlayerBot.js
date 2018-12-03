export class PlayerBot {
    constructor(id) {
        this.isBot = true;
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.myTurn = false;
        this.health = 0;
        this.color = "#000000";
        this.weapon = null;
        this.weaponTracer = null;

        this.changeHealth(100);
    }

    changeHealth(deltaHealth) {
        this.health += deltaHealth;
        window.PubSub.publish('Player-health-change', 
            {playerID: this.id,
               health: this.health});
    }

    attack() {
        console.log('the bot is firing');

        this.weaponTracer.simulate();
        // TODO: weaponTracer should be limited to the same aimPower that the
        // actual weapon is limited to.
        this.weapon.aimAngle = this.weaponTracer.aimAngle;
        this.weapon.aimPower = this.weaponTracer.aimPower;
        this.weapon.limitPower();
        this.weapon.fire();
        window.PubSub.publish('bot-attacked');
    }
}
