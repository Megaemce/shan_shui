import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { transformPolyline, flipPolyline } from "./generateMan";

/**
 * Generates a hat (version 02) using procedural generation.
 *
 * @param {PRNG} prng - The pseudorandom number generator.
 * @param {Point} p0 - The starting point of the line segment.
 * @param {Point} p1 - The ending point of the line segment.
 * @param {boolean} [horizontalFlip=false] - Indicates whether to horizontally flip the hat.
 * @returns {SvgPolyline[]} An array of SvgPolyline representing the hat.
 */
export function generateHat02(
    prng: PRNG,
    p0: Point,
    p1: Point,
    horizontalFlip = false
): SvgPolyline[] {
    const polylines: SvgPolyline[] = [];
    const shapePoint = [
        new Point(-0.3, 0.5),
        new Point(-1.1, 0.5),
        new Point(-1.2, 0.6),
        new Point(-1.1, 0.7),
        new Point(-0.3, 0.8),
        new Point(0.3, 0.8),
        new Point(1, 0.7),
        new Point(1.3, 0.6),
        new Point(1.2, 0.5),
        new Point(0.3, 0.5),
    ];
    polylines.push(
        new SvgPolyline(
            transformPolyline(p0, p1, flipPolyline(shapePoint, horizontalFlip)),
            0,
            0,
            "rgba(100,100,100,0.8)"
        )
    );
    return polylines;
}
