import Chunk from "../Chunk";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Stroke from "../svgPolylines/Stroke";
import { config } from "../../config";

const COLORNOALFA = config.chunks.water.colorNoAlfa;
const DEFAULTHEIGTH = config.chunks.water.defaultHeight;
const DEFAULTWAVECLUSTERS = config.chunks.water.defaultWaveClusters;
const DEFAULTWIDTH = config.chunks.water.defaultWidth;

/**
 * Class representing a water chunk with undulating waves.
 *
 * @extends Chunk
 */
export default class WaterChunk extends Chunk {
    /**
     * Creates an instance of WaterChunk.
     * @param {number} xOffset - X-coordinate offset for the chunk.
     * @param {number} yOffset - Y-coordinate offset for the chunk.
     * @param {number} [height=DEFAULTHEIGTH] - Height of the waves.
     * @param {number} [width=DEFAULTWIDTH] - Width of the waves.
     * @param {number} [waveClusters=DEFAULTWAVECLUSTERS] - Number of clusters of waves.
     */

    constructor(
        xOffset: number,
        yOffset: number,
        height: number = DEFAULTHEIGTH,
        width: number = DEFAULTWIDTH,
        waveClusters: number = DEFAULTWAVECLUSTERS
    ) {
        super("water", xOffset, yOffset - 10000);

        const resolution = 5;
        let yk = 0;

        for (let i = 0; i < waveClusters; i++) {
            const xk = (PRNG.random(-0.5, 0.5) * width) / 8;
            const lk = Math.floor(width * PRNG.random(0.25, 0.5));
            const pointNum = Math.floor((2 * lk) / resolution);
            const currentCluster = new Array<Point>(pointNum);
            const color = COLORNOALFA + PRNG.random(0.3, 0.6).toFixed(3) + ")";

            yk += PRNG.random(0, 5);

            for (let j = 0; j < pointNum; j++) {
                const step = -lk + j * resolution;

                currentCluster[j] = new Point(
                    step + xk + xOffset,
                    Math.sin(step * 0.2) * height * Perlin.noise(step * 0.1) -
                        20 +
                        yk +
                        yOffset
                );
            }

            this.add(new Stroke(currentCluster, color, color));
        }
    }
}
