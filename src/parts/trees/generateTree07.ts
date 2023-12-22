import { Noise } from "../../classes/PerlinNoise";
import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { midPoint, triangulate } from "../../utils/polytools";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateBlobPoints } from "../brushes/generateBlobPoints";

/**
 * Generates a tree structure with a specific pattern.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate offset.
 * @param {number} y - Y-coordinate offset.
 * @param {number} [height=60] - Height of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree structure.
 */

export function generateTree07(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 60
): SvgPolyline[] {
    const strokeWidth: number = 4;
    const bendingAngle: (x: number) => number = (x: number) =>
        0.2 * Math.sqrt(x);
    const col: string = "rgba(100,100,100,1)";

    const reso = 10;
    const nslist = [];
    for (let i = 0; i < reso; i++) {
        nslist.push([
            Noise.noise(prng, i * 0.5),
            Noise.noise(prng, i * 0.5, 0.5),
        ]);
    }

    // assert(col.includes('rgba('))
    if (!col.includes("rgba(")) {
        console.log("unexpected exception!!");
    }

    const polylines: SvgPolyline[] = [];
    const line1: Point[] = [];
    const line2: Point[] = [];
    let T: Point[][] = [];
    for (let i = 0; i < reso; i++) {
        const newX = x + bendingAngle(i / reso) * 100;
        const newY = y - (i * height) / reso;
        if (i >= reso / 4) {
            for (let j = 0; j < 1; j++) {
                const bfunc = function (x: number) {
                    return x <= 1
                        ? 2.75 * x * Math.pow(1 - x, 1 / 1.8)
                        : 2.75 * (x - 2) * Math.pow(x - 1, 1 / 1.8);
                };
                const bpl = generateBlobPoints(
                    prng,
                    newX + prng.random(-0.3, 0.3) * strokeWidth * (reso - i),
                    newY + prng.random(-0.25, 0.25) * strokeWidth,
                    prng.random(0, -Math.PI / 6),
                    prng.random(20, 70),
                    prng.random(12, 24),
                    0.5,
                    bfunc
                );

                //canv+=SvgPolyline.createPolyline(bpl,{fill:col,strokeWidth:0})
                T = T.concat(triangulate(bpl as Point[], 50, true, false));
            }
        }
        line1.push(
            new Point(
                newX + (nslist[i][0] - 0.5) * strokeWidth - strokeWidth / 2,
                newY
            )
        );
        line2.push(
            new Point(
                newX + (nslist[i][1] - 0.5) * strokeWidth + strokeWidth / 2,
                newY
            )
        );
    }

    //canv += SvgPolyline.createPolyline(line1.concat(line2.reverse()),{fill:col,strokeWidth:0})
    T = triangulate(line1.concat(line2.reverse()), 50, true, true).concat(T);

    for (let k = 0; k < T.length; k++) {
        const m = midPoint(T[k]);
        const c = (Noise.noise(prng, m.x * 0.02, m.y * 0.02) * 200 + 50) | 0;
        const co = `rgba(${c},${c},${c},0.8)`;
        polylines.push(SvgPolyline.createPolyline(T[k], 0, 0, co, co));
    }
    return polylines;
}
