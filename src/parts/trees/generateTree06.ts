import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "../brushes/generateStroke";
import { generateBranch } from "./generateBranch";
import { generateTwig } from "./generateTwig";
import { generateBarkify } from "./generateBarkify";

/**
 * Recursive function to generate a fractal tree-like structure.
 * @notExported
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {SvgPolyline[][]} txpolylinelists - Lists to store trunk and bark polylines.
 * @param {SvgPolyline[][]} twpolylinelists - Lists to store twig polylines.
 * @param {number} xOffset - X-coordinate offset.
 * @param {number} yOffset - Y-coordinate offset.
 * @param {number} depth - Current depth of recursion.
 * @param {number} [height=300] - Height of the tree.
 * @param {number} [strokeWidth=5] - Width of the strokes.
 * @param {number} [angle=0] - Initial angle of the tree.
 * @param {number} [bendingAngle=0.2 * Math.PI] - Bending angle of the tree.
 * @returns {Point[]} An array of points representing the tree-like structure.
 */
function generateFractalTree06(
    prng: PRNG,
    txpolylinelists: SvgPolyline[][],
    twpolylinelists: SvgPolyline[][],
    xOffset: number,
    yOffset: number,
    depth: number,
    height: number = 300,
    strokeWidth: number = 5,
    angle: number = 0,
    bendingAngle: number = 0.2 * Math.PI
): Point[] {
    const _trlist = generateBranch(
        prng,
        height,
        strokeWidth,
        angle,
        bendingAngle,
        height / 20
    );

    txpolylinelists.push(generateBarkify(prng, xOffset, yOffset, _trlist));
    const trlist = _trlist[0].concat(_trlist[1].reverse());

    let trmlist: Point[] = [];

    for (let i = 0; i < trlist.length; i++) {
        if (
            ((prng.random() < 0.025 &&
                i >= trlist.length * 0.2 &&
                i <= trlist.length * 0.8) ||
                i === ((trlist.length / 2) | 0) - 1 ||
                i === ((trlist.length / 2) | 0) + 1) &&
            depth > 0
        ) {
            const bar = prng.random(0.02, 0.1);
            const ba =
                bar * Math.PI -
                bar * 2 * Math.PI * (i > trlist.length / 2 ? 1 : 0);

            const brlist = generateFractalTree06(
                prng,
                txpolylinelists,
                twpolylinelists,
                trlist[i].x + xOffset,
                trlist[i].y + yOffset,
                depth - 1,
                height * prng.random(0.7, 0.9),
                strokeWidth * 0.6,
                angle + ba,
                0.55
            );

            for (let j = 0; j < brlist.length; j++) {
                if (prng.random() < 0.03) {
                    twpolylinelists.push(
                        generateTwig(
                            prng,
                            brlist[j].x + trlist[i].x + xOffset,
                            brlist[j].y + trlist[i].y + yOffset,
                            2,
                            ba * prng.random(0.75, 1.25),
                            0.3,
                            ba > 0 ? 1 : -1,
                            1,
                            [false, 0]
                        )
                    );
                }
            }

            trmlist = trmlist.concat(
                brlist.map(function (v) {
                    return new Point(v.x + trlist[i].x, v.y + trlist[i].y);
                })
            );
        } else {
            trmlist.push(trlist[i]);
        }
    }

    return trmlist;
}
/**
 * Generates a tree structure using fractal patterns.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate offset.
 * @param {number} y - Y-coordinate offset.
 * @param {number} [height=100] - Height of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree structure.
 */

export function generateTree06(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 100
): SvgPolyline[] {
    const strokeWidth: number = 6;
    const col: string = "rgba(100,100,100,0.5)";
    const polylineArray: SvgPolyline[][] = [];
    const txpolylinelists: SvgPolyline[][] = [];
    const twpolylinelists: SvgPolyline[][] = [];

    const trmlist = generateFractalTree06(
        prng,
        txpolylinelists,
        twpolylinelists,
        x,
        y,
        3,
        height,
        strokeWidth,
        -Math.PI / 2,
        0
    );

    polylineArray.push([
        SvgPolyline.createPolyline(trmlist, x, y, "white", col, 0),
    ]);

    trmlist.splice(0, 1);
    trmlist.splice(trmlist.length - 1, 1);
    const color = `rgba(100,100,100,${prng.random(0.4, 0.5).toFixed(3)})`;
    polylineArray.push([
        generateStroke(
            prng,
            trmlist.map(function (v) {
                return new Point(v.x + x, v.y + y);
            }),
            color,
            color,
            2.5,
            0.9,
            0,
            (_) => Math.sin(1)
        ),
    ]);

    polylineArray.push(txpolylinelists.flat());
    polylineArray.push(twpolylinelists.flat());
    return polylineArray.flat();
}
