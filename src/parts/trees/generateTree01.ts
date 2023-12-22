import { Noise } from "../../classes/PerlinNoise";
import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateBlob } from "../brushes/generateBlob";

/**
 * Generates a tree with undulating branches and leaves.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate of the tree base.
 * @param {number} y - Y-coordinate of the tree base.
 * @param {number} [height=50] - Height of the tree.
 * @param {number} [strokeWidth=3] - Width of the tree branches.
 * @param {string} [col="rgba(100,100,100,0.5)"] - Color of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree.
 */

export function generateTree01(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 50,
    strokeWidth: number = 3,
    col: string = "rgba(100,100,100,0.5)"
): SvgPolyline[] {
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
    const line1 = [];
    const line2 = [];
    for (let i = 0; i < reso; i++) {
        const newX = x;
        const newY = y - (i * height) / reso;
        if (i >= reso / 4) {
            for (let j = 0; j < (reso - i) / 5; j++) {
                const lcol = `rgba(${leafcol[0]},${leafcol[1]},${leafcol[2]},${(
                    prng.random(0, 0.2) + parseFloat(leafcol[3])
                ).toFixed(1)})`;
                polylines.push(
                    generateBlob(
                        prng,
                        newX +
                            strokeWidth * prng.random(-0.6, 0.6) * (reso - i),
                        newY + prng.random(-0.5, 0.5) * strokeWidth,
                        (Math.PI / 6) * prng.random(-0.5, 0.5),
                        lcol,
                        prng.random(10, 10 + 4 * (reso - i)),
                        prng.random(3, 9)
                    )
                );
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

    polylines.push(SvgPolyline.createPolyline(line1, 0, 0, "none", col, 1.5));
    polylines.push(SvgPolyline.createPolyline(line2, 0, 0, "none", col, 1.5));
    return polylines;
}
