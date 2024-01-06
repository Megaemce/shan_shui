import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import SvgPolyline from "../SvgPolyline";
import { config } from "../../config";
import { normalizeNoise } from "../../utils/utils";

const DEFAULT_FILL_COLOR = config.svgPolyline.blob.defaultFillColor;
const DEFAULT_LENGTH = config.svgPolyline.blob.defaultLength;
const DEFAULT_STROKE_WIDTH = config.svgPolyline.blob.defaultStrokeWidth;
const DEFAULT_NOISE = config.svgPolyline.blob.defaultNoise;

/**
 * Represents a blob with a stylized outline as an SvgPolyline.
 */
export default class Blob extends SvgPolyline {
    _points: Point[] = []; // used by Tree07 only
    /**
     * Constructor for the BlobGenerator class.
     * @param {number} x - X-coordinate of the blob.
     * @param {number} y - Y-coordinate of the blob.
     * @param {number} [angle=0] - Angle of the blob.
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
        angle: number = 0,
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
        const resolution = 15;
        const lalist = new Array<[number, number]>(resolution);
        const pointArray = new Array<Point>(resolution);

        let noiseArray = new Array<number>(resolution);

        for (let i = 0; i < resolution; i++) {
            const p = (i / resolution) * 2;
            const xo = length / 2 - Math.abs(p - 1) * length;
            const yo = (strokeWidthFunction(p) * strokeWidth) / 2;
            const a = Math.atan2(yo, xo);
            const l = Math.sqrt(xo * xo + yo * yo);

            lalist[i] = [l, a];
            noiseArray[i] = Perlin.noise(i * 0.05, PRNG.random(0, 10));
        }

        noiseArray = normalizeNoise(noiseArray);

        lalist.forEach(([l, a], i) => {
            const ns = noiseArray[i] * noise + (1 - noise);
            const newX = x + Math.cos(a + angle) * l * ns;
            const newY = y + Math.sin(a + angle) * l * ns;
            pointArray[i] = new Point(newX, newY);
        });

        super(pointArray, 0, 0, fillColor, fillColor);

        if (returnPoints) {
            this._points = pointArray;
        }
    }
    get points() {
        return this._points;
    }
}
