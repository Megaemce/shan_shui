import { Chunk } from "../classes/Chunk";
import { Noise } from "../classes/PerlinNoise";
import { Point } from "../classes/Point";
import { PRNG } from "../classes/PRNG";
import { SvgPolyline } from "../classes/SvgPolyline";
import { generateStroke } from "./brushes/generateStroke";

/**
 * Class representing a water chunk with undulating waves.
 *
 * @extends Chunk
 */
class Water extends Chunk {
    /**
     * Creates an instance of Water.
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
        const polylines: SvgPolyline[] = [];
        const pointArray: Point[][] = [];
        const reso = 5;
        let yk = 0;

        for (let i = 0; i < waveClusters; i++) {
            const xk = (prng.random(-0.5, 0.5) * waveLength) / 8;
            const lk = waveLength * prng.random(0.25, 0.5);

            pointArray.push([]);
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

            polylines.push(
                generateStroke(prng, translatedPoints, color, color)
            );
        }

        super("water", xOffset, yOffset - 10000, polylines);
    }
}

export { Water };
