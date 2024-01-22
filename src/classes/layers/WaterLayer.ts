import Layer from "../Layer";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import { config } from "../../config";

const COLORNOALFA = config.layers.water.colorNoAlfa;
const DEFAULT_HEIGTH = config.layers.water.defaultHeight;
const DEFAULT_WAVECLUSTERS = config.layers.water.defaultWaveClusters;
const DEFAULT_WIDTH = config.layers.water.defaultWidth;

/**
 * Class representing a water chunk with undulating waves.
 *
 * @extends Layer
 */
export default class WaterLayer extends Layer {
    /**
     * Creates an instance of WaterChunk.
     * @param {number} xOffset - X-coordinate offset for the chunk.
     * @param {number} yOffset - Y-coordinate offset for the chunk.
     * @param {number} [height=DEFAULT_HEIGTH] - Height of the waves.
     * @param {number} [width=DEFAULT_WIDTH] - Width of the waves.
     * @param {number} [waveClusters=DEFAULT_WAVECLUSTERS] - Number of clusters of waves.
     */

    constructor(
        xOffset: number,
        yOffset: number,
        height: number = DEFAULT_HEIGTH,
        width: number = DEFAULT_WIDTH,
        waveClusters: number = DEFAULT_WAVECLUSTERS
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
