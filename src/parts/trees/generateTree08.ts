import { Point } from "../../classes/Point";
import { distance } from "../../utils/utils";
import { Vector } from "../../classes/Vector";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "../brushes/generateStroke";
import { div } from "../brushes/div";
import { generateBranch } from "./generateBranch";

/**
 * Recursive function to generate a fractal tree-like structure.
 * @notExported
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - X-coordinate offset.
 * @param {number} yOffset - Y-coordinate offset.
 * @param {number} depth - Current depth of recursion.
 * @param {number} [angle=-Math.PI/2] - Initial angle of the tree.
 * @param {number} [len=15] - Length of the branches.
 * @param {number} [bendingAngle=0] - Bending angle of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree-like structure.
 */
function generateFractalTree08(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    depth: number,
    angle: number = -Math.PI / 2,
    len: number = 15,
    bendingAngle: number = 0
): SvgPolyline[] {
    const fun = (x: number) => (depth ? 1 : Math.cos(0.5 * Math.PI * x));
    const spt = new Vector(xOffset, yOffset);
    const ept = new Point(
        xOffset + Math.cos(angle) * len,
        yOffset + Math.sin(angle) * len
    );

    const _trmlist = [
        new Point(xOffset, yOffset),
        new Point(xOffset + len, yOffset),
    ];

    const bfun = prng.randomChoice([
        (x: number) => Math.sin(x * Math.PI),
        (x: number) => -Math.sin(x * Math.PI),
    ]);

    const trmlist = div(_trmlist, 10);

    for (let i = 0; i < trmlist.length; i++) {
        trmlist[i].y += bfun(i / trmlist.length) * 2;
    }

    for (let i = 0; i < trmlist.length; i++) {
        const d = distance(trmlist[i], spt.moveFrom(Point.O));
        const a = Math.atan2(trmlist[i].y - spt.y, trmlist[i].x - spt.x);
        trmlist[i].x = spt.x + d * Math.cos(a + angle);
        trmlist[i].y = spt.y + d * Math.sin(a + angle);
    }

    const polylineArray: SvgPolyline[][] = [];
    polylineArray.push([
        generateStroke(
            prng,
            trmlist,
            "rgba(100,100,100,0.5)",
            "rgba(100,100,100,0.5)",
            0.8,
            0.5,
            1,
            fun
        ),
    ]);

    if (depth !== 0) {
        const nben =
            bendingAngle +
            prng.randomChoice([-1, 1]) * Math.PI * 0.001 * depth * depth;
        if (prng.random() < 0.5) {
            polylineArray.push(
                generateFractalTree08(
                    prng,
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle +
                        bendingAngle +
                        Math.PI *
                            prng.randomChoice([
                                prng.normalizedRandom(-1, 0.5),
                                prng.normalizedRandom(0.5, 1),
                            ]) *
                            0.2,
                    len * prng.normalizedRandom(0.8, 0.9),
                    nben
                )
            );
            polylineArray.push(
                generateFractalTree08(
                    prng,
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle +
                        bendingAngle +
                        Math.PI *
                            prng.randomChoice([
                                prng.normalizedRandom(-1, -0.5),
                                prng.normalizedRandom(0.5, 1),
                            ]) *
                            0.2,
                    len * prng.normalizedRandom(0.8, 0.9),
                    nben
                )
            );
        } else {
            polylineArray.push(
                generateFractalTree08(
                    prng,
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle + bendingAngle,
                    len * prng.normalizedRandom(0.8, 0.9),
                    nben
                )
            );
        }
    }
    return polylineArray.flat();
}

/**
 * Generates a tree-like structure with fractal branches.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate of the base point.
 * @param {number} y - Y-coordinate of the base point.
 * @param {number} [height=80] - Height of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree-like structure.
 */
export function generateTree08(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 80
): SvgPolyline[] {
    const strokeWidth: number = 1;
    const col: string = "rgba(100,100,100,0.5)";

    const polylineArray: SvgPolyline[][] = [];
    const twpolylinelists: SvgPolyline[][] = [];

    // Generate a random angle to add variety to the tree structure
    const angle = prng.normalizedRandom(-1, 1) * Math.PI * 0.2;

    // Generate the main trunk of the tree
    const _trlist = generateBranch(
        prng,
        height,
        strokeWidth,
        -Math.PI / 2 + angle,
        Math.PI * 0.2,
        height / 20
    );
    const trlist = _trlist[0].concat(_trlist[1].reverse());

    // Iterate over each point in the trunk
    for (let i = 0; i < trlist.length; i++) {
        // Randomly generate branches
        if (prng.random() < 0.2) {
            twpolylinelists.push(
                generateFractalTree08(
                    prng,
                    x + trlist[i].x,
                    y + trlist[i].y,
                    Math.floor(prng.random(0, 4)),
                    -Math.PI / 2 + prng.random(-angle, 0)
                )
            );
        } else if (i === Math.floor(trlist.length / 2)) {
            // Generate a specific branch at the middle of the trunk
            twpolylinelists.push(
                generateFractalTree08(
                    prng,
                    x + trlist[i].x,
                    y + trlist[i].y,
                    3,
                    -Math.PI / 2 + angle
                )
            );
        }
    }

    // Add the main trunk to the polyline array
    polylineArray.push([
        SvgPolyline.createPolyline(trlist, x, y, "white", col),
    ]);

    // Add a colored stroke to the main trunk
    const color = `rgba(100,100,100,${prng.random(0.6, 0.7).toFixed(3)})`;
    polylineArray.push([
        generateStroke(
            prng,
            trlist.map(function (v) {
                return new Point(v.x + x, v.y + y);
            }),
            color,
            color,
            2.5,
            0.9,
            0,
            (x) => Math.sin(1)
        ),
    ]);

    // Add the generated fractal branches to the polyline array
    polylineArray.push(twpolylinelists.flat());

    // Return the flattened array of polylines
    return polylineArray.flat();
}
