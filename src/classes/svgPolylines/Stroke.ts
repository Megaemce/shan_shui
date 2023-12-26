import { Noise } from "../PerlinNoise";
import Point from "../Point";
import PRNG from "../PRNG";
import SvgPolyline from "../SvgPolyline";

/**
 * Class representing a stylized stroke using Perlin noise.
 */
export default class Stroke extends SvgPolyline {
    /**
     * Constructs a Stroke instance.
     *
     * @param {PRNG} prng - PRNG instance for random number generation.
     * @param {Point[]} pointArray - List of points defining the stroke.
     * @param {string} [fillColor="rgba(200,200,200,0.9)"] - Fill color for the stroke.
     * @param {string} [strokeColor="rgba(200,200,200,0.9)"] - Stroke color.
     * @param {number} [width=2] - Width of the stroke.
     * @param {number} [noise=0.5] - Amount of noise applied to the stroke.
     * @param {number} [strokWidth=1] - Outer width of the stroke.
     * @param {(x: number) => number} [strokeWidthFunction=(x: number) => Math.sin(x * Math.PI)] - Function to modulate stroke width.
     */
    constructor(
        prng: PRNG,
        pointArray: Point[],
        fillColor: string = "rgba(200,200,200,0.9)",
        strokeColor: string = "rgba(200,200,200,0.9)",
        width: number = 2,
        noise: number = 0.5,
        strokWidth: number = 1,
        strokeWidthFunction: (x: number) => number = (x: number) =>
            Math.sin(x * Math.PI)
    ) {
        const vtxlist0 = [];
        const vtxlist1 = [];

        for (let i = 1; i < pointArray.length - 1; i++) {
            let newWidth = width * strokeWidthFunction(i / pointArray.length);
            newWidth =
                newWidth * (1 - noise) +
                newWidth *
                    noise *
                    Noise.noise(prng, i * 0.5, prng.random(0, 10));

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

        super(vtxlist, 0, 0, fillColor, strokeColor, strokWidth);
    }
}
