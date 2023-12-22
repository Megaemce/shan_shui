import { Noise } from "../../classes/PerlinNoise";
import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateBlob } from "../brushes/generateBlob";

/**
 * Generates a tree with branches and leaves influenced by a custom bending function.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate of the tree base.
 * @param {number} y - Y-coordinate of the tree base.
 * @param {number} [height=16] - Height of the tree.
 * @param {string} [col="rgba(100,100,100,0.5)"] - Color of the tree.
 * @param {(x: number) => number} [bendingAngle=(_) => 0] - Custom bending function.
 * @returns {SvgPolyline[]} An array of polylines representing the tree.
 */

export function generateTree03(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 16,
    col: string = "rgba(100,100,100,0.5)",
    bendingAngle: (x: number) => number = (_) => 0
): SvgPolyline[] {
    const strokeWidth: number = 5;

    const reso = 10;
    const nslist = [];
    for (let i = 0; i < reso; i++) {
        nslist.push([
            Noise.noise(prng, i * 0.5),
            Noise.noise(prng, i * 0.5, 0.5),
        ]);
    }

    let leafcol;
    if (col.includes("rgba(")) {
        leafcol = col.replace("rgba(", "").replace(")", "").split(",");
    } else {
        leafcol = ["100", "100", "100", "0.5"];
    }
    const polylines: SvgPolyline[] = [];
    const blobs: SvgPolyline[] = [];
    const line1: Point[] = [];
    const line2: Point[] = [];
    for (let i = 0; i < reso; i++) {
        const newX = x + bendingAngle(i / reso) * 100;
        const newY = y - (i * height) / reso;
        if (i >= reso / 5) {
            for (let j = 0; j < (reso - i) * 2; j++) {
                const shape = (x: number) => Math.log(50 * x + 1) / 3.95;
                const ox =
                    prng.random(0, 2) * strokeWidth * shape((reso - i) / reso);
                const lcol = `rgba(${leafcol[0]},${leafcol[1]},${leafcol[2]},${(
                    prng.random(0, 0.2) + parseFloat(leafcol[3])
                ).toFixed(3)})`;
                blobs.push(
                    generateBlob(
                        prng,
                        newX + ox * prng.randomChoice([-1, 1]),
                        newY + prng.random(-1, 1) * strokeWidth,
                        (prng.random(-0.5, 0.5) * Math.PI) / 6,
                        lcol,
                        ox * 2,
                        prng.random(3, 9)
                    )
                );
            }
        }
        line1.push(
            new Point(
                newX +
                    (((nslist[i][0] - 0.5) * strokeWidth - strokeWidth / 2) *
                        (reso - i)) /
                        reso,
                newY
            )
        );
        line2.push(
            new Point(
                newX +
                    (((nslist[i][1] - 0.5) * strokeWidth + strokeWidth / 2) *
                        (reso - i)) /
                        reso,
                newY
            )
        );
    }
    const lc = line1.concat(line2.reverse());
    polylines.push(SvgPolyline.createPolyline(lc, 0, 0, "white", col, 1.5));

    return polylines.concat(blobs);
}
