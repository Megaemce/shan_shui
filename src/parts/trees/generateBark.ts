import { Noise } from "../../classes/PerlinNoise";
import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { normalizeNoise } from "../../utils/utils";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "../brushes/generateStroke";

/**
 * Generates a bark-like structure.
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate of the bark.
 * @param {number} y - Y-coordinate of the bark.
 * @param {number} strokeWidth - Width of the bark.
 * @param {number} angle - Angle of the bark.
 * @returns {SvgPolyline[]} An array of polylines representing the bark.
 */
export function generateBark(
    prng: PRNG,
    x: number,
    y: number,
    strokeWidth: number,
    angle: number
): SvgPolyline[] {
    const len = prng.random(10, 20);
    const noi = 0.5;
    const fun = function (x: number) {
        return x <= 1
            ? Math.pow(Math.sin(x * Math.PI), 0.5)
            : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5);
    };
    const reso = 20;
    const polylines: SvgPolyline[] = [];

    const lalist: number[][] = [];
    for (let i = 0; i < reso + 1; i++) {
        const p = (i / reso) * 2;
        const xo = len / 2 - Math.abs(p - 1) * len;
        const yo = (fun(p) * strokeWidth) / 2;
        const a = Math.atan2(yo, xo);
        const l = Math.sqrt(xo * xo + yo * yo);
        lalist.push([l, a]);
    }
    let nslist: number[] = [];
    const n0 = prng.random() * 10;
    for (let i = 0; i < reso + 1; i++) {
        nslist.push(Noise.noise(prng, i * 0.05, n0));
    }

    nslist = normalizeNoise(nslist);
    const brklist: Point[] = [];
    for (let i = 0; i < lalist.length; i++) {
        const ns = nslist[i] * noi + (1 - noi);
        const newX = x + Math.cos(lalist[i][1] + angle) * lalist[i][0] * ns;
        const newY = y + Math.sin(lalist[i][1] + angle) * lalist[i][0] * ns;
        brklist.push(new Point(newX, newY));
    }

    const fr = prng.random();
    polylines.push(
        generateStroke(
            prng,
            brklist,
            "rgba(100,100,100,0.4)",
            "rgba(100,100,100,0.4)",
            0.8,
            0,
            0,
            (x) => Math.sin((x + fr) * Math.PI * 3)
        )
    );

    return polylines;
}
