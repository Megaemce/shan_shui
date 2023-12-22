import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "../brushes/generateStroke";
import { generateBlob } from "../brushes/generateBlob";

/**
 * Generates a twig with branches and leaves.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} tx - X-coordinate of the twig base.
 * @param {number} ty - Y-coordinate of the twig base.
 * @param {number} depth - Depth of the twig branches.
 * @param {number} [angle=0] - Initial angle of the twig.
 * @param {number} [scale=1] - Scale factor of the twig.
 * @param {number} [direction=1] - Direction of the twig branches.
 * @param {number} [strokeWidth=1] - Width of the twig branches.
 * @param {[boolean, number]} [leaves=[true, 12]] - Tuple representing whether leaves should be generated and their number.
 * @returns {SvgPolyline[]} An array of polylines representing the twig.
 */

export function generateTwig(
    prng: PRNG,
    tx: number,
    ty: number,
    depth: number,
    angle: number = 0,
    scale: number = 1,
    direction: number = 1,
    strokeWidth: number = 1,
    leaves: [boolean, number] = [true, 12]
): SvgPolyline[] {
    const polylineArray: SvgPolyline[][] = [];
    const twlist: Point[] = [];
    const tl = 10;
    const hs = prng.random(0.5, 1);
    // const fun1 = (x: number) => Math.sqrt(x);
    const fun2 = (x: number) => -1 / Math.pow(x / tl + 1, 5) + 1;

    const tfun = prng.randomChoice([fun2]);
    const a0 = ((prng.random() * Math.PI) / 6) * direction + angle;

    for (let i = 0; i < tl; i++) {
        const mx = direction * tfun(i / tl) * 50 * scale * hs;
        const my = -i * 5 * scale;

        const a = Math.atan2(my, mx);
        const d = Math.pow(mx * mx + my * my, 0.5);

        const newX = Math.cos(a + a0) * d;
        const newY = Math.sin(a + a0) * d;

        twlist.push(new Point(newX + tx, newY + ty));
        if ((i === ((tl / 3) | 0) || i === (((tl * 2) / 3) | 0)) && depth > 0) {
            polylineArray.push(
                generateTwig(
                    prng,
                    newX + tx,
                    newY + ty,
                    depth - 1,
                    angle,
                    scale * 0.8,
                    direction * prng.randomChoice([-1, 1]),
                    strokeWidth,
                    leaves
                )
            );
        }
        if (i === tl - 1 && leaves[0]) {
            for (let j = 0; j < 5; j++) {
                const dj = (j - 2.5) * 5;
                const bfunc = function (x: number) {
                    return x <= 1
                        ? Math.pow(Math.sin(x * Math.PI) * x, 0.5)
                        : -Math.pow(Math.sin((x - 2) * Math.PI * (x - 2)), 0.5);
                };
                polylineArray.push([
                    generateBlob(
                        prng,
                        newX + tx + Math.cos(angle) * dj * strokeWidth,
                        newY +
                            ty +
                            (Math.sin(angle) * dj - leaves[1] / (depth + 1)) *
                                strokeWidth,
                        angle / 2 +
                            Math.PI / 2 +
                            Math.PI * prng.random(-0.1, 0.1),
                        `rgba(100,100,100,${(0.5 + depth * 0.2).toFixed(3)})`,
                        prng.random(15, 27) * strokeWidth,
                        prng.random(6, 9) * strokeWidth,
                        0.5,
                        bfunc
                    ),
                ]);
            }
        }
    }
    polylineArray.push([
        generateStroke(
            prng,
            twlist,
            "rgba(100,100,100,0.5)",
            "rgba(100,100,100,0.5)",
            1,
            0.5,
            1,
            (x) => Math.cos((x * Math.PI) / 2)
        ),
    ]);

    return polylineArray.flat();
}
