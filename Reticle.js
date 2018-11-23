export class Reticle {
    constructor(player) {
        this.player = player;
        this.aimangle = 0;
        this.power = 2;
        this.mousex = 0;
        this.mousey = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.player.x, this.player.y);
        ctx.lineTo(this.player.x + this.power * Math.cos(this.aimangle), 
                   this.player.y - this.power * Math.sin(this.aimangle));
        ctx.stroke();
    }
}
