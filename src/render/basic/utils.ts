import { midPoint } from "./polytools";
import { Point, Vector } from "./point";
import { PRNG } from "./PRNG";
import { Range } from "./range";
import { SvgPoint, SvgPolyline } from "../svg";

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
    const bds = [100, -100];

    noiseArray.forEach((value, i) => {
        noiseArray[i] +=
            (dif * (noiseArray.length - 1 - i)) / (noiseArray.length - 1);
        bds[0] = Math.min(bds[0], value);
        bds[1] = Math.max(bds[1], value);
    });

    const inputRange = Range.fromArray(bds);
    const outputRange = new Range(0, 1);

    return noiseArray.map((value) => mapValue(value, inputRange, outputRange));
}

/**
 * Randomly choose an element from an array.
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {T[]} elementArray - The array with elements to choose from.
 * @returns {T} A randomly chosen element from the array.
 */
export function randomChoice<T>(prng: PRNG, elementArray: T[]): T {
    const p = Math.floor(prng.random(0, elementArray.length));
    return elementArray[p];
}

/**
 * Generate a normalized random number within a range.
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} minValue - The minimum value.
 * @param {number} maxValue - The maximum value.
 * @returns {number} A normalized random number within the specified range.
 */
export function normalizedRandom(
    prng: PRNG,
    minValue: number,
    maxValue: number
): number {
    const inputRange = new Range(0, 1);
    const outputRange = new Range(minValue, maxValue);
    return mapValue(prng.random(), inputRange, outputRange);
}

/**
 * Generate a weighted random number based on a function.
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {(value: number) => number} func - The weighting function.
 * @returns {number} A weighted random number.
 */
export function weightedRandom(
    prng: PRNG,
    func: (value: number) => number
): number {
    const x = prng.random();
    const y = prng.random();
    return y < func(x) ? x : weightedRandom(prng, func);
}

/**
 * Generate a random number with a Gaussian distribution.
 * @param {PRNG} prng - The pseudo-random number generator.
 * @returns {number} A random number with a Gaussian distribution.
 */
export function gaussianRandom(prng: PRNG): number {
    const value = weightedRandom(prng, (x) =>
        Math.exp(-24 * Math.pow(x - 0.5, 2))
    );
    return value * 2 - 1;
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

/**
 * Create an SVG polyline from a list of points.
 * @param {Point[]} pointArray - The list of points.
 * @param {number} [xOffset=0] - The x-axis offset.
 * @param {number} [yOffset=0] - The y-axis offset.
 * @param {string} [fill="rgba(0,0,0,0)"] - The fill color.
 * @param {string} [stroke="rgba(0,0,0,0)"] - The stroke color.
 * @param {number} [strokeWidth=0] - The stroke width.
 * @returns {SvgPolyline} An SVG polyline.
 */
export function poly(
    pointArray: Point[],
    xOffset: number = 0,
    yOffset: number = 0,
    fill: string = "rgba(0,0,0,0)",
    stroke: string = "rgba(0,0,0,0)",
    strokeWidth: number = 0
): SvgPolyline {
    const off = new Vector(xOffset, yOffset);

    const polyline = new SvgPolyline(
        pointArray.map((p) => SvgPoint.from(p.move(off))),
        { fill, stroke, strokeWidth }
    );

    return polyline;
}
