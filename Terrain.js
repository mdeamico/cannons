import Noise1D from '/Noise1D.js';
export class Terrain {
    constructor(canvas) {
        this.elevations = [];
        this.maxElevation = 0;
        this.generate(canvas);
    }
    generate(canvas) {
        let terrainNoiseGen = new Noise1D();
        let a = 100; // scale parameter a
        let b = 100; // scale parameter b
        let minElevation = 10;
        for (let i = 0; i < canvas.width; ++i) {
            this.elevations[i] = canvas.height
                - Math.floor(terrainNoiseGen.noise(i / a) * b) - minElevation;
        }
        this.maxElevation = Math.min(...this.elevations); // using min because y = 0 is at the top of the screen
        //console.log(this.maxElevation);
    }
}