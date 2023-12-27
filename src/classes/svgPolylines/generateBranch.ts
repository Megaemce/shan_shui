import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import { config } from "../../config";

const DEFAULTHEIGHT = config.svgPolyline.branch.defaultHeight;
const DEFAULTSTROKEWIDTH = config.svgPolyline.branch.defaultStrokeWidth;
const DEFAULTANGLE = config.svgPolyline.branch.defaultAngle;
const DEFAULTBENDINGANGLE = config.svgPolyline.branch.defaultBendingAngle;
const DEFAULTDETAILS = config.svgPolyline.branch.defaultDetails;

/**
 * Generates a list of points representing a branch structure.
 *
 * @param {number} [height=DEFAULTHEIGHT] - Height of the branch.
 * @param {number} [strokeWidth=DEFAULTSTROKEWIDTH] - Width of the branch.
 * @param {number} [angle=DEFAULTANGLE] - Initial angle of the branch.
 * @param {number} [bendingAngle=DEFAULTBENDINGANGLE] - Bending angle of the branch.
 * @param {number} [details=DEFAULTDETAILS] - Number of details in the branch.
 * @returns {[Point[], Point[]]} An array of two lists of points representing the branch structure.
 */

export default function generateBranch(
    height: number = DEFAULTHEIGHT,
    strokeWidth: number = DEFAULTSTROKEWIDTH,
    angle: number = DEFAULTANGLE,
    bendingAngle: number = DEFAULTBENDINGANGLE,
    details: number = DEFAULTDETAILS
): [Point[], Point[]] {
    const branches: Point[] = [];
    const leftBranches: Point[] = [];
    const rightBranches: Point[] = [];
    const g = 3;

    let newPoint = new Point(0, 0);
    let prevPoint = new Point(0, 0);
    let angle0 = 0;

    for (let i = 0; i < g; i++) {
        i === 0 && branches.push(new Point(0, 0));
        angle0 += ((PRNG.random(1, 2) * bendingAngle) / 2) * PRNG.randomSign();
        newPoint.x += (Math.cos(angle0) * height) / g;
        newPoint.y -= (Math.sin(angle0) * height) / g;
        branches.push(new Point(newPoint.x, newPoint.y));
    }

    const rotationAngle = Math.atan2(
        branches[branches.length - 1].y,
        branches[branches.length - 1].x
    );

    branches.forEach((point) => {
        const a = Math.atan2(point.y, point.x);
        const distance = Math.sqrt(point.x * point.x + point.y * point.y);
        point.x = distance * Math.cos(a - rotationAngle + angle);
        point.y = distance * Math.sin(a - rotationAngle + angle);
    });

    const totalPoints = (branches.length - 1) * details;

    for (let i = 0; i < totalPoints; i += 1) {
        const lastPoint = branches[Math.floor(i / details)];
        const nextPoint = branches[Math.ceil(i / details)];
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
            ((Perlin.noise(i * 0.3) - 0.5) * strokeWidth * height) / 80;

        let randomness = 0;
        if (p === 0) {
            randomness = PRNG.random() * strokeWidth;
        }

        const newWidth =
            strokeWidth * (((totalPoints - i) / totalPoints) * 0.5 + 0.5);
        leftBranches.push(
            new Point(
                weightedPoint.x +
                    Math.cos(angle + Math.PI / 2) *
                        (newWidth + widthOffset + randomness),
                weightedPoint.y +
                    Math.sin(angle + Math.PI / 2) *
                        (newWidth + widthOffset + randomness)
            )
        );
        rightBranches.push(
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

    return [leftBranches, rightBranches];
}
