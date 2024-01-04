import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import SvgPolyline from "../SvgPolyline";
import { config } from "../../config";
import { normalizeNoise } from "../../utils/utils";

const DEFAULTFILLCOLOR = config.svgPolyline.blob.defaultFillColor;
const DEFAULTLENGTH = config.svgPolyline.blob.defaultLength;
const DEFAULTSTROKEWIDTH = config.svgPolyline.blob.defaultStrokeWidth;
const DEFAULTNOISE = config.svgPolyline.blob.defaultNoise;

/**
 * Represents a blob with a stylized outline as an SvgPolyline.
 */
export default class Blob extends SvgPolyline {
    /**
     * Constructor for the BlobGenerator class.
     * @param {number} x - X-coordinate of the blob.
     * @param {number} y - Y-coordinate of the blob.
     * @param {number} [angle=0] - Angle of the blob.
     * @param {string} [fillColor=DEFAULTFILLCOLOR] - Fill fillColor of the blob.
     * @param {number} [length=DEFAULTLENGTH] - Length of the blob.
     * @param {number} [strokeWidth=DEFAULTSTROKEWIDTH] - Width of the blob's outline.
     * @param {number} [noise=DEFAULTNOISE] - Amount of noise applied to the blob's outline.
     * @param {Function} [strokeWidthFunction] - Function to modulate the blob's outline width (default is sin function).
     */
    constructor(
        x: number,
        y: number,
        angle: number = 0,
        fillColor: string = DEFAULTFILLCOLOR,
        length: number = DEFAULTLENGTH,
        strokeWidth: number = DEFAULTSTROKEWIDTH,
        noise: number = DEFAULTNOISE,
        strokeWidthFunction: (x: number) => number = (x: number) =>
            x <= 1
                ? Math.pow(Math.sin(x * Math.PI), 0.5)
                : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5)
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
    }
}
