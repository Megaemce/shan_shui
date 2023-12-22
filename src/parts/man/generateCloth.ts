import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { generateBezierCurve } from "../../utils/utils";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "../brushes/generateStroke";
import { expand } from "./generateMan";

/**
 * Generates cloth SVG polylines.
 * @notExported
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {(p: Point) => Point} toGlobal - Function to convert local points to global points.
 * @param {Point[]} pointArray - Array of points defining the cloth shape.
 * @param {(v: number) => number} fun - The scaling function.
 * @returns {SvgPolyline[]} An array of SVG polylines representing the cloth.
 */
export function generateCloth(
    prng: PRNG,
    toGlobal: (p: Point) => Point,
    pointArray: Point[],
    fun: (v: number) => number
): SvgPolyline[] {
    const polylines: SvgPolyline[] = [];
    const tlist = generateBezierCurve(pointArray);
    const [tlist1, tlist2] = expand(tlist, fun);
    polylines.push(
        SvgPolyline.createPolyline(
            tlist1.concat(tlist2.reverse()).map(toGlobal),
            0,
            0,
            "white"
        )
    );
    polylines.push(
        generateStroke(
            prng,
            tlist1.map(toGlobal),
            "rgba(100,100,100,0.5)",
            "rgba(100,100,100,0.5)",
            1
        )
    );
    polylines.push(
        generateStroke(
            prng,
            tlist2.map(toGlobal),
            "rgba(100,100,100,0.6)",
            "rgba(100,100,100,0.6)",
            1
        )
    );

    return polylines;
}
