import Point from "../Point";
import { Noise } from "../PerlinNoise";
import { midPoint, triangulate } from "../../utils/polytools";
import PRNG from "../PRNG";
import SvgPolyline from "../SvgPolyline";
import Chunk from "../Chunk";

/**
 * Represents a distant mountain chunk with varying heights and colors.
 *
 * @extends Chunk
 */
export default class DistantMountainChunk extends Chunk {
    /**
     * Constructor for generating a distant mountain chunk with varying heights and colors.
     *
     * @param {PRNG} prng - The pseudo-random number generator.
     * @param {number} xOffset - The x-axis offset.
     * @param {number} yOffset - The y-axis offset.
     * @param {number} [seed=0] - The seed for the noise function. Default is 0.
     * @param {number} [height=300] - The overall height of the mountain. Default is 300.
     * @param {number} [length=2000] - The length of the mountain. Default is 2000.
     */
    constructor(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        seed: number = 0,
        height: number = 300,
        length: number = 2000
    ) {
        super("distmount", xOffset, yOffset);

        const seg = 5;
        const span = 10;
        const pointArray: Point[][] = [];

        for (let i = 0; i < length / span / seg; i++) {
            pointArray.push([]);
            for (let j = 0; j < seg + 1; j++) {
                const tran = (k: number) =>
                    new Point(
                        xOffset + k * span,
                        yOffset -
                            height *
                                Noise.noise(prng, k * 0.05, seed) *
                                Math.pow(
                                    Math.sin((Math.PI * k) / (length / span)),
                                    0.5
                                )
                    );
                pointArray[pointArray.length - 1].push(tran(i * seg + j));
            }
            for (let j = 0; j < seg / 2 + 1; j++) {
                const tran = (k: number) =>
                    new Point(
                        xOffset + k * span,
                        yOffset +
                            24 *
                                Noise.noise(prng, k * 0.05, 2, seed) *
                                Math.pow(
                                    Math.sin((Math.PI * k) / (length / span)),
                                    1
                                )
                    );
                pointArray[pointArray.length - 1].unshift(
                    tran(i * seg + j * 2)
                );
            }
        }

        const getCol = function (x: number, y: number) {
            const c = Noise.noise(prng, x * 0.02, y * 0.02, yOffset) * 55 + 200;
            return `rgb(${c},${c},${c})`;
        };

        for (let i = 0; i < pointArray.length; i++) {
            const pe = pointArray[i][pointArray[i].length - 1];
            this.add(
                new SvgPolyline(
                    pointArray[i],
                    0,
                    0,
                    getCol(pe.x, pe.y),
                    "none",
                    1
                )
            );

            const T = triangulate(pointArray[i], 100, true, false);
            for (let k = 0; k < T.length; k++) {
                const m = midPoint(T[k]);
                const co = getCol(m.x, m.y);
                this.add(new SvgPolyline(T[k], 0, 0, co, co, 1));
            }
        }
    }
}
