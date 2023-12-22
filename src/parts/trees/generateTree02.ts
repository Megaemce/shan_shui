import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateBlob } from "../brushes/generateBlob";

/**
 * Generates a tree with blob-like clusters of branches.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate of the tree base.
 * @param {number} y - Y-coordinate of the tree base.
 * @param {string} [col="rgba(100,100,100,0.5)"] - Color of the tree.
 * @param {number} [clu=5] - Number of blob-like clusters.
 * @returns {SvgPolyline[]} An array of polylines representing the tree.
 */

export function generateTree02(
    prng: PRNG,
    x: number,
    y: number,
    col: string = "rgba(100,100,100,0.5)",
    clu: number = 5
): SvgPolyline[] {
    const height: number = 16,
        strokeWidth: number = 8;

    const polylines: SvgPolyline[] = [];
    const bfunc = (x: number) =>
        x <= 1
            ? Math.pow(Math.sin(x * Math.PI) * x, 0.5)
            : -Math.pow(Math.sin((x - 2) * Math.PI * (x - 2)), 0.5);
    for (let i = 0; i < clu; i++) {
        polylines.push(
            generateBlob(
                prng,
                x + prng.gaussianRandom() * clu * 4,
                y + prng.gaussianRandom() * clu * 4,
                Math.PI / 2,
                col,
                prng.random(0.5, 1.25) * height,
                prng.random(0.5, 1.25) * strokeWidth,
                0.5,
                bfunc
            )
        );
    }
    return polylines;
}
