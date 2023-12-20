import { midPoint } from "./polytools";
import { Point } from "./point";
import { Range } from "./range";

/**
 * Replace NaN points in a list with a new Point.
 * @param {Point[]} pointArray - The list of points.
 * @returns {Point[]} A new list with NaN points replaced.
 */
export function unNan(pointArray: Point[]): Point[] {
    return pointArray.map((p) => (p.isFinite() ? p : new Point()));
}

/**
 * Map a value from one range to another.
 * @param {number} value - The value to map.
 * @param {Range} inputRange - The input range.
 * @param {Range} outputRange - The output range.
 * @returns {number} The mapped value.
 */
export function mapValue(
    value: number,
    inputRange: Range,
    outputRange: Range
): number {
    return outputRange.mapFromRatio(inputRange.mapToRatio(value));
}

/**
 * Loop through a noise list, adjusting values and normalizing them.
 * @param {number[]} noiseArray - The noise list.
 * @returns {number[]} The normalized noise list.
 */
export function loopNoise(noiseArray: number[]): number[] {
    const dif = noiseArray[noiseArray.length - 1] - noiseArray[0];
    const boundaries: [number, number] = [100, -100];

    noiseArray.forEach((value, i) => {
        noiseArray[i] +=
            (dif * (noiseArray.length - 1 - i)) / (noiseArray.length - 1);
        boundaries[0] = Math.min(boundaries[0], value);
        boundaries[1] = Math.max(boundaries[1], value);
    });

    const inputRange = Range.fromArray(boundaries);
    const outputRange = new Range(0, 1);

    return noiseArray.map((value) => mapValue(value, inputRange, outputRange));
}

/**
 * Generate a Bezier curve through a list of control points.
 * @param {Point[]} controlPoints - The list of control points.
 * @returns {Point[]} A list of points representing the Bezier curve.
 */
export function generateBezierCurve(controlPoints: Point[]): Point[] {
    if (controlPoints.length === 2) {
        const midPointControl = midPoint(controlPoints);
        controlPoints = [controlPoints[0], midPointControl, controlPoints[1]];
    }

    const curvePoints: Point[] = [];

    for (let j = 0; j < controlPoints.length - 2; j++) {
        const p0 =
            j === 0
                ? controlPoints[j]
                : midPoint([controlPoints[j], controlPoints[j + 1]]);
        const p1 = controlPoints[j + 1];
        const p2 =
            j === controlPoints.length - 3
                ? controlPoints[j + 2]
                : midPoint([controlPoints[j + 1], controlPoints[j + 2]]);

        const pointCount = 20;
        const hasBuffer = j === controlPoints.length - 3 ? 1 : 0;

        for (let i = 0; i < pointCount + hasBuffer; i += 1) {
            const t = i / pointCount;
            const a0 = (1 - t) * (1 - t);
            const a1 = 2 * t * (1 - t);
            const a2 = t * t;
            const x = a0 * p0.x + a1 * p1.x + a2 * p2.x;
            const y = a0 * p0.y + a1 * p1.y + a2 * p2.y;
            curvePoints.push(new Point(x, y));
        }
    }

    return curvePoints;
}
