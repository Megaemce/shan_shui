import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "../brushes/generateStroke";
import { generateBranch } from "./generateBranch";
import { generateTwig } from "./generateTwig";
import { generateBarkify } from "./generateBarkify";

/**
 * Generates a tree-like structure with branches, bark, and twigs.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate offset.
 * @param {number} y - Y-coordinate offset.
 * @param {number} [height=300] - The height of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree-like structure.
 */

export function generateTree05(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 300
): SvgPolyline[] {
    const strokeWidth: number = 5;
    const col: string = "rgba(100,100,100,0.5)";

    const polylineArray: SvgPolyline[][] = [];
    const txpolylinelists: SvgPolyline[][] = [];
    const twpolylinelists: SvgPolyline[][] = [];

    const _trlist = generateBranch(prng, height, strokeWidth, -Math.PI / 2, 0);
    txpolylinelists.push(generateBarkify(prng, x, y, _trlist));
    const trlist = _trlist[0].concat(_trlist[1].reverse());

    let trmlist: Point[] = [];

    for (let i = 0; i < trlist.length; i++) {
        const p = Math.abs(i - trlist.length * 0.5) / (trlist.length * 0.5);
        if (
            (i >= trlist.length * 0.2 &&
                i <= trlist.length * 0.8 &&
                i % 3 === 0 &&
                prng.random() > p) ||
            i === trlist.length / 2 - 1
        ) {
            const bar = prng.random(0, 0.2);
            const ba =
                -bar * Math.PI -
                (1 - bar * 2) * Math.PI * (i > trlist.length / 2 ? 1 : 0);
            const _brlist = generateBranch(
                prng,
                height * (0.3 * p - prng.random(0, 0.05)),
                strokeWidth * 0.5,
                ba,
                0.5
            );

            _brlist[0].splice(0, 1);
            _brlist[1].splice(0, 1);

            for (let j = 0; j < _brlist[0].length; j++) {
                if (j % 20 === 0 || j === _brlist[0].length - 1) {
                    twpolylinelists.push(
                        generateTwig(
                            prng,
                            _brlist[0][j].x + trlist[i].x + x,
                            _brlist[0][j].y + trlist[i].y + y,
                            0,
                            ba > -Math.PI / 2 ? ba : ba + Math.PI,
                            (0.2 * height) / 300,
                            ba > -Math.PI / 2 ? 1 : -1,
                            height / 300,
                            [true, 5]
                        )
                    );
                }
            }
            const brlist = _brlist[0].concat(_brlist[1].reverse());
            trmlist = trmlist.concat(
                brlist.map(function (p) {
                    return new Point(p.x + trlist[i].x, p.y + trlist[i].y);
                })
            );
        } else {
            trmlist.push(trlist[i]);
        }
    }

    polylineArray.push([new SvgPolyline(trmlist, x, y, "white", col)]);

    trmlist.splice(0, 1);
    trmlist.splice(trmlist.length - 1, 1);
    const color = `rgba(100,100,100,${prng.random(0.4, 0.5).toFixed(3)})`;

    // Tree trunk
    polylineArray.push([
        generateStroke(
            prng,
            trmlist.map(function (p: Point) {
                return new Point(p.x + x, p.y + y);
            }),
            color,
            color,
            2.5,
            0.9,
            0,
            (x) => Math.sin(1)
        ),
    ]);

    polylineArray.push(txpolylinelists.flat());
    polylineArray.push(twpolylinelists.flat());
    return polylineArray.flat();
}
