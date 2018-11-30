export default class Noise1D {
    constructor() {
        this.MAX_VERTS = 10;
        this.r = [];
        for(let i = 0; i < this.MAX_VERTS; i++) {
            this.r[i] = Math.random();
        }
    }
    
    interp(low, high, btwn) {
        let pct = 6 * btwn ** 5 - 15 * btwn ** 4 + 10 * btwn ** 3;
        return(low + pct * (high - low));
    }
    
    noise(x) {
        let xfloor = Math.floor(x);
        let xmin = xfloor % this.MAX_VERTS;
        
        let xmax = xmin + 1;
        if (xmin == this.MAX_VERTS - 1) {
            xmax = 0;
        }
        let t = x - xfloor;
        return(this.interp(this.r[xmin], this.r[xmax], t));
    }
}
