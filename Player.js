// Players ---------------------------------------------------------------
export class Player {
    constructor(id) {
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.myTurn = false;
        this.health = 0;
        this.color = "#000000";
        this.weapon = null;

        this.changeHealth(100);
    }

    changeHealth(deltaHealth) {
        this.health += deltaHealth;
        window.PubSub.publish('Player-health-change', 
            {playerID: this.id,
               health: this.health});
    }
}
