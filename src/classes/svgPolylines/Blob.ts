import PRNG from "../PRNG";
import SvgPolyline from "../SvgPolyline";
import { generateBlobPoints } from "../../utils/generateBlobPoints";
import { config } from "../../config";

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
     * @param {PRNG} prng - PRNG instance for random number generation.
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
        prng: PRNG,
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
        const pointArray = generateBlobPoints(
            prng,
            x,
            y,
            angle,
            length,
            strokeWidth,
            noise,
            strokeWidthFunction
        );
        super(pointArray, 0, 0, fillColor, fillColor);
    }
}
