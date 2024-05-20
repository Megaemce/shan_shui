import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Element from "../Element";
import { config } from "../../config";
import { normalizeNoise } from "../../utils/utils";

const DEFAULT_ANGLE = config.element.blob.defaultAngle;
const DEFAULT_FILL_COLOR = config.element.blob.defaultFillColor;
const DEFAULT_LENGTH = config.element.blob.defaultLength;
const DEFAULT_STROKE_WIDTH = config.element.blob.defaultStrokeWidth;
const DEFAULT_NOISE = config.element.blob.defaultNoise;
const RESOLUTION = config.element.blob.resolution;

/**
 * Represents a blob
 */
export default class Blob extends Element {
    points: Point[] = []; // used by Tree07 only
    /**
     * Constructor for the Blob class.
     * @param {number} x - X-coordinate of the blob.
     * @param {number} y - Y-coordinate of the blob.
     * @param {number} [angle=DEFAULT_ANGLE] - Angle of the blob.
     * @param {string} [fillColor=DEFAULT_FILL_COLOR] - Fill fillColor of the blob.
     * @param {number} [length=DEFAULT_LENGTH] - Length of the blob.
     * @param {number} [strokeWidth=DEFAULT_STROKE_WIDTH] - Width of the blob's outline.
     * @param {number} [noise=DEFAULT_NOISE] - Amount of noise applied to the blob's outline.
     * @param {Function} [strokeWidthFunction] - Function to modulate the blob's outline width (default is sin function).
     * @param {boolean} [returnPoints] - Whether to return the points of the blob or not. Used by Tree07 only.
     */
    constructor(
        x: number,
        y: number,
        angle: number = DEFAULT_ANGLE,
        fillColor: string = DEFAULT_FILL_COLOR,
        length: number = DEFAULT_LENGTH,
        strokeWidth: number = DEFAULT_STROKE_WIDTH,
        noise: number = DEFAULT_NOISE,
        strokeWidthFunction: (x: number) => number = (x: number) =>
            x <= 1
                ? Math.pow(Math.sin(x * Math.PI), 0.5)
                : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5),
        returnPoints?: boolean
    ) {
        const lengthAngleArray = new Array<[number, number]>(RESOLUTION);
        const pointArray = new Array<Point>(RESOLUTION);

        let noiseArray = new Array<number>(RESOLUTION);

        for (let i = 0; i < RESOLUTION; i++) {
            /** normalized and scaled parameter in range [0, 2) */
            const p = (i / RESOLUTION) * 2;
            /** creates a symmetry around p = 1, such that it linearly decreases to 0 as p approaches 1 from either side (0 or 2). */
            const xo = length / 2 - Math.abs(p - 1) * length;
            const yo = (strokeWidthFunction(p) * strokeWidth) / 2;
            const a = Math.atan2(yo, xo);
            const l = Math.sqrt(xo * xo + yo * yo);

            lengthAngleArray[i] = [l, a];

            noiseArray[i] = Perlin.noise(i * 0.05, PRNG.random(0, 10));
        }

        normalizeNoise(noiseArray);

        for (let i = 0; i < lengthAngleArray.length; i++) {
            const [l, a] = lengthAngleArray[i];
            const ns = noiseArray[i] * noise + (1 - noise);
            const newX = x + Math.cos(a + angle) * l * ns;
            const newY = y + Math.sin(a + angle) * l * ns;

            pointArray[i] = new Point(newX, newY);
        }

        super(pointArray, 0, 0, fillColor, fillColor);

        if (returnPoints) {
            this.points = pointArray;
        }
    }
}
