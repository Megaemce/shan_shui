import { Noise } from "../PerlinNoise";
import Point from "../Point";
import PRNG from "../PRNG";

/**
 * Generates a list of points representing a branch structure.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} [height=360] - Height of the branch.
 * @param {number} [strokeWidth=6] - Width of the branch.
 * @param {number} [angle=0] - Initial angle of the branch.
 * @param {number} [bendingAngle=0.2 * Math.PI] - Bending angle of the branch.
 * @param {number} [details=10] - Number of details in the branch.
 * @returns {Point[][]} An array of two lists of points representing the branch structure.
 */

export default function generateBranch(
    prng: PRNG,
    height: number = 360,
    strokeWidth: number = 6,
    angle: number = 0,
    bendingAngle: number = 0.2 * Math.PI,
    details: number = 10
): Point[][] {
    let newX = 0;
    let newY = 0;
    const tlist = [[newX, newY]];
    let a0 = 0;
    const g = 3;
    for (let i = 0; i < g; i++) {
        a0 += ((prng.random(1, 2) * bendingAngle) / 2) * prng.randomSign();
        newX += (Math.cos(a0) * height) / g;
        newY -= (Math.sin(a0) * height) / g;
        tlist.push([newX, newY]);
    }
    const ta = Math.atan2(
        tlist[tlist.length - 1][1],
        tlist[tlist.length - 1][0]
    );

    for (let i = 0; i < tlist.length; i++) {
        const a = Math.atan2(tlist[i][1], tlist[i][0]);
        const d = Math.sqrt(
            tlist[i][0] * tlist[i][0] + tlist[i][1] * tlist[i][1]
        );
        tlist[i][0] = d * Math.cos(a - ta + angle);
        tlist[i][1] = d * Math.sin(a - ta + angle);
    }

    const trlist1: Point[] = [];
    const trlist2: Point[] = [];
    const span = details;
    const tl = (tlist.length - 1) * span;
    let lx = 0;
    let ly = 0;

    for (let i = 0; i < tl; i += 1) {
        const lastPoint = tlist[Math.floor(i / span)];
        const nextPoint = tlist[Math.ceil(i / span)];
        const p = (i % span) / span;
        const newX = lastPoint[0] * (1 - p) + nextPoint[0] * p;
        const newY = lastPoint[1] * (1 - p) + nextPoint[1] * p;

        const angle = Math.atan2(newY - ly, newX - lx);
        const woff =
            ((Noise.noise(prng, i * 0.3) - 0.5) * strokeWidth * height) / 80;

        let b = 0;
        if (p === 0) {
            b = prng.random() * strokeWidth;
        }

        const nw = strokeWidth * (((tl - i) / tl) * 0.5 + 0.5);
        trlist1.push(
            new Point(
                newX + Math.cos(angle + Math.PI / 2) * (nw + woff + b),
                newY + Math.sin(angle + Math.PI / 2) * (nw + woff + b)
            )
        );
        trlist2.push(
            new Point(
                newX + Math.cos(angle - Math.PI / 2) * (nw - woff + b),
                newY + Math.sin(angle - Math.PI / 2) * (nw - woff + b)
            )
        );
        lx = newX;
        ly = newY;
    }

    return [trlist1, trlist2];
}
