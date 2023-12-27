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
        const vtxlist0 = [];
        const vtxlist1 = [];

        for (let i = 1; i < pointArray.length - 1; i++) {
            let newWidth = width * strokeWidthFunction(i / pointArray.length);
            newWidth =
                newWidth * (1 - noise) +
                newWidth * noise * Perlin.noise(i * 0.5, PRNG.random(0, 10));

            const a1 = Math.atan2(
                pointArray[i].y - pointArray[i - 1].y,
                pointArray[i].x - pointArray[i - 1].x
            );
            const a2 = Math.atan2(
                pointArray[i].y - pointArray[i + 1].y,
                pointArray[i].x - pointArray[i + 1].x
            );
            let a = (a1 + a2) / 2;

            if (a < a2) {
                a += Math.PI;
            }

            vtxlist0.push(
                new Point(
                    pointArray[i].x + newWidth * Math.cos(a),
                    pointArray[i].y + newWidth * Math.sin(a)
                )
            );
            vtxlist1.push(
                new Point(
                    pointArray[i].x - newWidth * Math.cos(a),
                    pointArray[i].y - newWidth * Math.sin(a)
                )
            );
        }

        const vtxlist = [pointArray[0]]
            .concat(
                vtxlist0.concat(
                    vtxlist1
                        .concat([pointArray[pointArray.length - 1]])
                        .reverse()
                )
            )
            .concat([pointArray[0]]);

        super(vtxlist, 0, 0, fillColor, color, strokeWidth);
    }
}
