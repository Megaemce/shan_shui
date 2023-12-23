import Chunk from "../Chunk";
import { Noise } from "../PerlinNoise";
import Point from "../Point";
import PRNG from "../PRNG";
import Stroke from "../svgPolylines/Stroke";

/**
 * Class representing a water chunk with undulating waves.
 *
 * @extends Chunk
 */
export default class WaterChunk extends Chunk {
    /**
     * Creates an instance of WaterChunk.
     *
     * @param {PRNG} prng - The pseudo-random number generator.
     * @param {number} xOffset - X-coordinate offset for the chunk.
     * @param {number} yOffset - Y-coordinate offset for the chunk.
     * @param {number} [waveHeight=2] - Height of the waves.
     * @param {number} [waveLength=800] - Length of the waves.
     * @param {number} [waveClusters=10] - Number of clusters of waves.
     */

    constructor(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        waveHeight: number = 2,
        waveLength: number = 800,
        waveClusters: number = 10
    ) {
        super("water", xOffset, yOffset - 10000);

        const pointArray: Point[][] = [];
        const reso = 5;
        let yk = 0;

        for (let i = 0; i < waveClusters; i++) {
            pointArray.push([]);

            const xk = (prng.random(-0.5, 0.5) * waveLength) / 8;
            const lk = waveLength * prng.random(0.25, 0.5);

            yk += prng.random(0, 5);

            for (let j = -lk; j < lk; j += reso) {
                pointArray[pointArray.length - 1].push(
                    new Point(
                        j + xk,
                        Math.sin(j * 0.2) *
                            waveHeight *
                            Noise.noise(prng, j * 0.1) -
                            20 +
                            yk
                    )
                );
            }
        }

        for (let j = 1; j < pointArray.length; j += 1) {
            const color = `rgba(100, 100, 100, ${prng
                .random(0.3, 0.6)
                .toFixed(3)})`;
            const translatedPoints = pointArray[j].map(
                (p) => new Point(p.x + xOffset, p.y + yOffset)
            );

            this.add(new Stroke(prng, translatedPoints, color, color));
        }
    }
}
