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
    const tlist: Point[] = [];
    const g = 3;

    let newPoint = new Point(0, 0);
    let angle0 = 0;

    for (let i = 0; i < g; i++) {
        i === 0 && tlist.push(new Point(0, 0));
        angle0 += ((prng.random(1, 2) * bendingAngle) / 2) * prng.randomSign();
        newPoint.x += (Math.cos(angle0) * height) / g;
        newPoint.y -= (Math.sin(angle0) * height) / g;
        tlist.push(new Point(newPoint.x, newPoint.y));
    }

    const rotationAngle = Math.atan2(
        tlist[tlist.length - 1].y,
        tlist[tlist.length - 1].x
    );

    tlist.forEach((point) => {
        const a = Math.atan2(point.y, point.x);
        const distance = Math.sqrt(point.x * point.x + point.y * point.y);
        point.x = distance * Math.cos(a - rotationAngle + angle);
        point.y = distance * Math.sin(a - rotationAngle + angle);
    });

    const trlist1: Point[] = [];
    const trlist2: Point[] = [];
    const totalPoints = (tlist.length - 1) * details;

    let prevPoint = new Point(0, 0);

    for (let i = 0; i < totalPoints; i += 1) {
        const lastPoint = tlist[Math.floor(i / details)];
        const nextPoint = tlist[Math.ceil(i / details)];
        const p = (i % details) / details;
        const weightedPoint = new Point(
            lastPoint.x * (1 - p) + nextPoint.x * p,
            lastPoint.y * (1 - p) + nextPoint.y * p
        );

        const angle = Math.atan2(
            weightedPoint.y - prevPoint.y,
            weightedPoint.x - prevPoint.x
        );
        const widthOffset =
            ((Noise.noise(prng, i * 0.3) - 0.5) * strokeWidth * height) / 80;

        let randomness = 0;
        if (p === 0) {
            randomness = prng.random() * strokeWidth;
        }

        const newWidth =
            strokeWidth * (((totalPoints - i) / totalPoints) * 0.5 + 0.5);
        trlist1.push(
            new Point(
                weightedPoint.x +
                    Math.cos(angle + Math.PI / 2) *
                        (newWidth + widthOffset + randomness),
                weightedPoint.y +
                    Math.sin(angle + Math.PI / 2) *
                        (newWidth + widthOffset + randomness)
            )
        );
        trlist2.push(
            new Point(
                weightedPoint.x +
                    Math.cos(angle - Math.PI / 2) *
                        (newWidth - widthOffset + randomness),
                weightedPoint.y +
                    Math.sin(angle - Math.PI / 2) *
                        (newWidth - widthOffset + randomness)
            )
        );
        prevPoint = weightedPoint;
    }

    return [trlist1, trlist2];
}
