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

        const generatePoints = (
            i: number,
            j: number,
            heightMultiplier: number,
            powerExponent: number,
            seed: number
        ) => {
            const k = i * seg + j;
            return new Point(
                xOffset + k * span,
                yOffset +
                    heightMultiplier *
                        Noise.noise(prng, k * 0.05, seed) *
                        Math.pow(
                            Math.sin((Math.PI * k) / (length / span)),
                            powerExponent
                        )
            );
        };

        for (let i = 0; i < length / span / seg; i++) {
            pointArray.push([]);

            for (let j = 0; j < seg + 1; j++) {
                pointArray[pointArray.length - 1].push(
                    generatePoints(i, j, -height, 0.5, seed)
                );
            }

            for (let j = 0; j < seg / 2 + 1; j++) {
                pointArray[pointArray.length - 1].unshift(
                    generatePoints(i, j * 2, 24, 1, 2)
                );
            }
        }

        const getColor = function (point: Point) {
            const color =
                Noise.noise(prng, point.x * 0.02, point.y * 0.02, yOffset) *
                    55 +
                200;
            return `rgb(${color},${color},${color})`;
        };

        for (const pointGroup of pointArray) {
            const lastPoint = pointGroup[pointGroup.length - 1];

            // Adding polyline for the last point in each group
            this.add(
                new SvgPolyline(
                    pointGroup,
                    0,
                    0,
                    getColor(lastPoint),
                    "none",
                    1
                )
            );

            // Triangulate the current point group
            const triangles = triangulate(pointGroup, 100, true, false);

            // Adding polylines for each triangle in the triangulation
            for (const triangle of triangles) {
                const midPointOfTriangle = midPoint(triangle);
                const color = getColor(midPointOfTriangle);
                this.add(new SvgPolyline(triangle, 0, 0, color, color, 1));
            }
        }
    }
}
