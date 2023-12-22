import { Noise } from "../../classes/PerlinNoise";
import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { transformPolyline, flipPolyline } from "./generateMan";

/**
 * Generates a hat (version 01) using procedural generation.
 *
 * @param {PRNG} prng - The pseudorandom number generator.
 * @param {Point} p0 - The starting point of the line segment.
 * @param {Point} p1 - The ending point of the line segment.
 * @param {boolean} [horizontalFlip=false] - Indicates whether to horizontally flip the hat.
 * @returns {SvgPolyline[]} An array of SvgPolyline representing the hat.
 */
export function generateHat01(
    prng: PRNG,
    p0: Point,
    p1: Point,
    horizontalFlip: boolean = false
): SvgPolyline[] {
    const polylines: SvgPolyline[] = [];
    const shapePoint = [
        new Point(-0.3, 0.5),
        new Point(0.3, 0.8),
        new Point(0.2, 1),
        new Point(0, 1.1),
        new Point(-0.3, 1.15),
        new Point(-0.55, 1),
        new Point(-0.65, 0.5),
    ];

    polylines.push(
        SvgPolyline.createPolyline(
            transformPolyline(p0, p1, flipPolyline(shapePoint, horizontalFlip)),
            0,
            0,
            "rgba(100,100,100,0.8)"
        )
    );

    const qlist1: Point[] = [];
    for (let i = 0; i < 10; i++) {
        qlist1.push(
            new Point(
                -0.3 - Noise.noise(prng, i * 0.2, prng.random()) * i * 0.1,
                0.5 - i * 0.3
            )
        );
    }
    polylines.push(
        SvgPolyline.createPolyline(
            transformPolyline(p0, p1, flipPolyline(qlist1, horizontalFlip)),
            0,
            0,
            "rgba(0, 0, 0, 0)",
            "rgba(100,100,100,0.8)",
            1
        )
    );

    return polylines;
}
