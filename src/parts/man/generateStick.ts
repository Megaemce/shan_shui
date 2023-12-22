import { Noise } from "../../classes/PerlinNoise";
import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { transformPolyline, flipPolyline } from "./generateMan";

/**
 * Generates a stick SVG polyline.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {Point} p0 - The start point.
 * @param {Point} p1 - The end point.
 * @param {boolean} [horizontalFlip=false] - Whether to horizontally flip the stick.
 * @returns {SvgPolyline[]} An array of SVG polylines representing the stick.
 */
export function generateStick(
    prng: PRNG,
    p0: Point,
    p1: Point,
    horizontalFlip: boolean = false
): SvgPolyline[] {
    const polylines: SvgPolyline[] = [];
    const seed = prng.random();

    const qlist1 = [];
    const l = 12;
    for (let i = 0; i < l; i++) {
        qlist1.push(
            new Point(
                -Noise.noise(prng, i * 0.1, seed) *
                    0.1 *
                    Math.sin((i / l) * Math.PI) *
                    5,
                0 + i * 0.3
            )
        );
    }
    polylines.push(
        new SvgPolyline(
            transformPolyline(p0, p1, flipPolyline(qlist1, horizontalFlip)),
            0,
            0,
            "rgba(0,0,0,0)",
            "rgba(100,100,100,0.5)",
            1
        )
    );

    return polylines;
}
