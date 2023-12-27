import Point from "../Point";
import { Noise } from "../PerlinNoise";
import { midPoint, triangulate } from "../../utils/polytools";
import PRNG from "../PRNG";
import SvgPolyline from "../SvgPolyline";
import Chunk from "../Chunk";
import { config } from "../../config";

const DEFAULTHEIGHT = config.chunks.distantMountain.defaultHeight;
const DEFAULTSEED = config.chunks.distantMountain.defaultSeed;
const DEFAULTWIDTH = config.chunks.distantMountain.defaultWidth;
const SEGMENTS = config.chunks.distantMountain.segments;
const SPAN = config.chunks.distantMountain.span;
const STROKECOLOR = config.chunks.distantMountain.color;
const STROKEWIDTH = config.chunks.distantMountain.strokeWidth;

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
     * @param {number} [seed=DEFAULTSEED] - The seed for the noise function.
     * @param {number} [height=DEFAULTHEIGHT] - The overall height of the mountain.
     * @param {number} [width=DEFAULTWIDTH] - The width of the mountain.
     */
    constructor(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        seed: number = DEFAULTSEED,
        height: number = DEFAULTHEIGHT,
        width: number = DEFAULTWIDTH
    ) {
        super("distmount", xOffset, yOffset);

        const pointArray: Point[][] = [];

        const generatePoints = (
            i: number,
            j: number,
            heightMultiplier: number,
            powerExponent: number,
            seed: number
        ) => {
            const k = i * SEGMENTS + j;
            return new Point(
                xOffset + k * SPAN,
                yOffset +
                    heightMultiplier *
                        Noise.noise(prng, k * 0.05, seed) *
                        Math.pow(
                            Math.sin((Math.PI * k) / (width / SPAN)),
                            powerExponent
                        )
            );
        };

        for (let i = 0; i < width / SPAN / SEGMENTS; i++) {
            pointArray.push([]);

            for (let j = 0; j < SEGMENTS + 1; j++) {
                pointArray[pointArray.length - 1].push(
                    generatePoints(i, j, -height, 0.5, seed)
                );
            }

            for (let j = 0; j < SEGMENTS / 2 + 1; j++) {
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
                    STROKECOLOR,
                    STROKEWIDTH
                )
            );

            // Triangulate the current point group
            const triangles = triangulate(pointGroup, 100, true, false);

            // Adding polylines for each triangle in the triangulation
            for (const triangle of triangles) {
                const midPointOfTriangle = midPoint(triangle);
                const color = getColor(midPointOfTriangle);
                this.add(
                    new SvgPolyline(triangle, 0, 0, color, color, STROKEWIDTH)
                );
            }
        }
    }
}
