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
    // Generate the initial curve points
    const curvePoints: Point[] = [];
    let newPoint = new Point(0, 0);
    let angle0 = 0;
    const numSegments = 3;

    for (let i = 0; i < numSegments; i++) {
        angle0 += ((prng.random(1, 2) * bendingAngle) / 2) * prng.randomSign();
        newPoint.x += (Math.cos(angle0) * height) / numSegments;
        newPoint.y -= (Math.sin(angle0) * height) / numSegments;
        curvePoints.push(newPoint);
    }

    // Rotate the curve to a specified angle
    const rotationAngle = Math.atan2(
        curvePoints[curvePoints.length - 1].y,
        curvePoints[curvePoints.length - 1].x
    );
    curvePoints.forEach((point) => {
        const curveAngle = Math.atan2(point.y, point.x);
        const distance = Math.sqrt(point.x ** 2 + point.y ** 2);
        point.x = distance * Math.cos(curveAngle - rotationAngle + angle);
        point.y = distance * Math.sin(curveAngle - rotationAngle + angle);
    });

    // Generate two stroke paths based on the curved line
    const trlist1: Point[] = [];
    const trlist2: Point[] = [];
    const totalPoints = (curvePoints.length - 1) * details;
    let prevPoint = new Point(0, 0);

    for (let i = 0; i < totalPoints; i++) {
        const lastPoint = curvePoints[Math.floor(i / details)];
        const nextPoint = curvePoints[Math.ceil(i / details)];
        const p = (i % details) / details;
        newPoint.x = lastPoint.x * (1 - p) + nextPoint.x * p;
        newPoint.y = lastPoint.y * (1 - p) + nextPoint.y * p;

        const angle = Math.atan2(
            newPoint.y - prevPoint.y,
            newPoint.x - prevPoint.x
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
                newPoint.x +
                    Math.cos(angle + Math.PI / 2) *
                        (newWidth + widthOffset + randomness),
                newPoint.y +
                    Math.sin(angle + Math.PI / 2) *
                        (newWidth + widthOffset + randomness)
            )
        );

        trlist2.push(
            new Point(
                newPoint.x +
                    Math.cos(angle - Math.PI / 2) *
                        (newWidth - widthOffset + randomness),
                newPoint.y +
                    Math.sin(angle - Math.PI / 2) *
                        (newWidth - widthOffset + randomness)
            )
        );

        prevPoint = newPoint;
    }

    return [trlist1, trlist2];
}
