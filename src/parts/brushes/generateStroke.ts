import { Noise } from "../../classes/PerlinNoise";
import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";

/**
 * Generates a stylized stroke using Perlin noise.
 * @param prng - PRNG instance for random number generation.
 * @param pointArray - List of points defining the stroke.
 * @param fillColor - Fill fillColor for the stroke.
 * @param strokeColor - Stroke fillColor.
 * @param width - Width of the stroke.
 * @param noise - Amount of noise applied to the stroke.
 * @param strokWidth - Outer width of the stroke.
 * @param strokeWidthFunction - Function to modulate stroke width (default is sin function).
 * @returns SvgPolyline representing the stylized stroke.
 */

export function generateStroke(
    prng: PRNG,
    pointArray: Point[],
    fillColor: string = "rgba(200,200,200,0.9)",
    strokeColor: string = "rgba(200,200,200,0.9)",
    width: number = 2,
    noise: number = 0.5,
    strokWidth: number = 1,
    strokeWidthFunction: (x: number) => number = (x: number) =>
        Math.sin(x * Math.PI)
): SvgPolyline {
    console.assert(pointArray.length > 0);

    const vtxlist0 = [];
    const vtxlist1 = [];
    const n0 = prng.random(0, 10);

    for (let i = 1; i < pointArray.length - 1; i++) {
        let newWidth = width * strokeWidthFunction(i / pointArray.length);
        newWidth =
            newWidth * (1 - noise) +
            newWidth * noise * Noise.noise(prng, i * 0.5, n0);

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
                vtxlist1.concat([pointArray[pointArray.length - 1]]).reverse()
            )
        )
        .concat([pointArray[0]]);

    return SvgPolyline.createPolyline(
        vtxlist,
        0,
        0,
        fillColor,
        strokeColor,
        strokWidth
    );
}
