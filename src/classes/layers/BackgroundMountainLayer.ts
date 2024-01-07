import Layer from "../Layer";
import Perlin from "../Perlin";
import Point from "../Point";
import Element from "../Element";
import { config } from "../../config";
import { midPoint, triangulate } from "../../utils/polytools";

const DEFAULT_HEIGHT = config.chunks.distantMountain.defaultHeight;
const DEFAULT_SEED = config.chunks.distantMountain.defaultSeed;
const DEFAULT_WIDTH = config.chunks.distantMountain.defaultWidth;
const SEGMENTS = config.chunks.distantMountain.segments;
const SPAN = config.chunks.distantMountain.span;
const STROKE_COLOR = config.chunks.distantMountain.color;
const STROKE_WIDTH = config.chunks.distantMountain.strokeWidth;

/**
 * Represents a distant mountain chunk with varying heights and colors.
 *
 * @extends Layer
 */
export default class BackgroundMountainLayer extends Layer {
    /**
     * Constructor for generating a distant mountain chunk with varying heights and colors.
     * @param {number} xOffset - The x-axis offset.
     * @param {number} yOffset - The y-axis offset.
     * @param {number} [seed=DEFAULT_SEED] - The seed for the noise function.
     * @param {number} [height=DEFAULT_HEIGHT] - The overall height of the mountain.
     * @param {number} [width=DEFAULT_WIDTH] - The width of the mountain.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        seed: number = DEFAULT_SEED,
        height: number = DEFAULT_HEIGHT,
        width: number = DEFAULT_WIDTH
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
                        Perlin.noise(k * 0.05, seed) *
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
                Perlin.noise(point.x * 0.02, point.y * 0.02, yOffset) * 55 +
                200;
            return `rgb(${color},${color},${color})`;
        };

        for (const pointGroup of pointArray) {
            const lastPoint = pointGroup[pointGroup.length - 1];

            // Adding polyline for the last point in each group
            this.add(
                new Element(
                    pointGroup,
                    0,
                    0,
                    getColor(lastPoint),
                    STROKE_COLOR,
                    STROKE_WIDTH
                )
            );

            // Triangulate the current point group
            const triangles = triangulate(pointGroup, 100, true, false);

            // Adding polylines for each triangle in the triangulation
            for (const triangle of triangles) {
                const midPointOfTriangle = midPoint(triangle);
                const color = getColor(midPointOfTriangle);
                this.add(
                    new Element(triangle, 0, 0, color, color, STROKE_WIDTH)
                );
            }
        }
    }
}
