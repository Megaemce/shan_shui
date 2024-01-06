import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import SvgPolyline from "../SvgPolyline";
import { config } from "../../config";

const DEFAULTFILLCOLOR = config.svgPolyline.stroke.defaultFillColor;
const DEFAULTNOISE = config.svgPolyline.stroke.defaultNoise;
const DEFAULTSTROKECOLOR = config.svgPolyline.stroke.defaultStrokeColor;
const DEFAULTSTROKEWIDTH = config.svgPolyline.stroke.defaultStrokeWidth;
const DEFAULTWIDTH = config.svgPolyline.stroke.defaultWidth;

/**
 * Class representing a stylized stroke using Perlin noise.
 */
export default class Stroke extends SvgPolyline {
    /**
     * Constructs a Stroke instance.
     * @param {Point[]} pointArray - List of points defining the stroke.
     * @param {string} [fillColor=DEFAULTFILLCOLOR] - Fill color for the stroke.
     * @param {string} [color=DEFAULTSTROKECOLOR] - Stroke color.
     * @param {number} [width=DEFAULTWIDTH] - Width of the stroke.
     * @param {number} [noise=DEFAULTNOISE] - Amount of noise applied to the stroke.
     * @param {number} [strokeWidth=DEFAULTSTROKEWIDTH] - Outer width of the stroke.
     * @param {(x: number) => number} [strokeWidthFunction=(x: number) => Math.sin(x * Math.PI)] - Function to modulate stroke width.
     */
    constructor(
        pointArray: Point[],
        fillColor: string = DEFAULTFILLCOLOR,
        color: string = DEFAULTSTROKECOLOR,
        width: number = DEFAULTWIDTH,
        noise: number = DEFAULTNOISE,
        strokeWidth: number = DEFAULTSTROKEWIDTH,
        strokeWidthFunction: (x: number) => number = (x: number) =>
            Math.sin(x * Math.PI)
    ) {
        if (strokeWidth === 0) {
            console.trace("stroke width is zero");
        }
        /**
         * For inital pointArray = [0,1,2,3] creates vtxArray = [0,(1),(2),3,(2),(1),0]
         * where (values) are modified by the main for loop
         **/
        const vtxArray = new Array<Point>(pointArray.length * 2);
        const lastPointIndex = pointArray.length - 1;
        const lastVtxIndex = vtxArray.length - 1;

        vtxArray[0] = pointArray[0];
        vtxArray[lastPointIndex] = pointArray[lastPointIndex];
        vtxArray[lastVtxIndex] = pointArray[0];

        for (let i = 1; i < lastPointIndex; i++) {
            let newWidth = width * strokeWidthFunction(i / pointArray.length);
            newWidth *=
                1 - noise + noise * Perlin.noise(i * 0.5, PRNG.random(0, 10));

            const lastAngle = Math.atan2(
                pointArray[i].y - pointArray[i - 1].y,
                pointArray[i].x - pointArray[i - 1].x
            );
            const nextAngle = Math.atan2(
                pointArray[i].y - pointArray[i + 1].y,
                pointArray[i].x - pointArray[i + 1].x
            );
            let avgAngle = (lastAngle + nextAngle) / 2;

            if (avgAngle < nextAngle) {
                avgAngle += Math.PI;
            }

            vtxArray[i] = new Point(
                pointArray[i].x + newWidth * Math.cos(avgAngle),
                pointArray[i].y + newWidth * Math.sin(avgAngle)
            );

            vtxArray[lastVtxIndex - i] = new Point(
                pointArray[i].x - newWidth * Math.cos(avgAngle),
                pointArray[i].y - newWidth * Math.sin(avgAngle)
            );
        }

        super(vtxArray, 0, 0, fillColor, color, strokeWidth);
    }
}
