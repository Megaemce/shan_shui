import { Chunk } from "../basic/chunk";
import { Noise } from "../basic/perlinNoise";
import { Point } from "../basic/point";
import { PRNG } from "../basic/PRNG";
import { SvgPolyline } from "../svg/types";
import { stroke } from "./brushes";

/**
 * Generates a water chunk with undulating waves.
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - X-coordinate offset for the chunk.
 * @param {number} yOffset - Y-coordinate offset for the chunk.
 * @param {number} waveHeight - Height of the waves.
 * @param {number} waveLength - Length of the waves.
 * @param {number} waveClusters - Number of clusters of waves.
 * @returns {Chunk} The generated water chunk.
 */
export function water(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    waveHeight: number = 2,
    waveLength: number = 800,
    waveClusters: number = 10
): Chunk {
    const polylines: SvgPolyline[] = [];
    const pointArray: Point[][] = [];
    let yk = 0;

    for (let i = 0; i < waveClusters; i++) {
        pointArray.push([]);
        const xk = (prng.random(-0.5, 0.5) * waveLength) / 8;
        yk += prng.random(0, 5);
        const lk = waveLength * prng.random(0.25, 0.5);
        const reso = 5;

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
        const color = `rgba(100,100,100,${prng.random(0.3, 0.6).toFixed(3)})`;
        polylines.push(
            stroke(
                prng,
                pointArray[j].map(function (p) {
                    return new Point(p.x + xOffset, p.y + yOffset);
                }),
                color,
                color
            )
        );
    }

    const chunk: Chunk = new Chunk(
        "water",
        xOffset,
        yOffset - 10000,
        polylines
    );
    return chunk;
}
