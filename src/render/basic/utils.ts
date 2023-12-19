import { midPoint } from "./polytools";
import { Point, Vector } from "./point";
import { PRNG } from "./PRNG";
import { Range } from "./range";
import { SvgPoint, SvgPolyline } from "../svg";

/**
 * Replace NaN points in a list with a new Point.
 * @param pointArray - The list of points.
 * @returns A new list with NaN points replaced.
 */
export function unNan(pointArray: Point[]): Point[] {
    return pointArray.map((p) => (p.isFinite() ? p : new Point()));
}

/**
 * Map a value from one range to another.
 * @param value - The value to map.
 * @param inputRange - The input range.
 * @param outputRange - The output range.
 * @returns The mapped value.
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
 * @param noiseArray - The noise list.
 * @returns The normalized noise list.
 */
export function loopNoise(noiseArray: number[]): number[] {
    const dif = noiseArray[noiseArray.length - 1] - noiseArray[0];
    const bds = [100, -100];

    noiseArray.forEach((v, i) => {
        noiseArray[i] +=
            (dif * (noiseArray.length - 1 - i)) / (noiseArray.length - 1);
        bds[0] = Math.min(bds[0], v);
        bds[1] = Math.max(bds[1], v);
    });

    const inputRange = Range.fromArray(bds);
    const outputRange = new Range(0, 1);

    return noiseArray.map((v) => mapValue(v, inputRange, outputRange));
}

/**
 * Randomly choose an element from an array.
 * @param prng - The pseudo-random number generator.
 * @param elementArray - The array with elements to choose from.
 * @returns A randomly chosen element from the array.
 */
export function randomChoice<T>(prng: PRNG, elementArray: T[]): T {
    const p = Math.floor(prng.random(0, elementArray.length));
    return elementArray[p];
}

/**
 * Generate a normalized random number within a range.
 * @param prng - The pseudo-random number generator.
 * @param minValue - The minimum value.
 * @param maxValue - The maximum value.
 * @returns A normalized random number within the specified range.
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
 * @param prng - The pseudo-random number generator.
 * @param func - The weighting function.
 * @returns A weighted random number.
 */
export function weightedRandom(
    prng: PRNG,
    func: (v: number) => number
): number {
    const x = prng.random();
    const y = prng.random();
    return y < func(x) ? x : weightedRandom(prng, func);
}

/**
 * Generate a random number with a Gaussian distribution.
 * @param prng - The pseudo-random number generator.
 * @returns A random number with a Gaussian distribution.
 */
export function randGaussian(prng: PRNG): number {
    const v1 = weightedRandom(prng, (x) =>
        Math.exp(-24 * Math.pow(x - 0.5, 2))
    );
    return v1 * 2 - 1;
}

/**
 * Create a Bezier curve through a list of control points.
 * @param controlArray - The list of control points.
 * @param curveWeight - The weight of the curve.
 * @returns A list of points representing the Bezier curve.
 */
export function bezmh(controlArray: Point[], curveWeight: number = 1): Point[] {
    if (controlArray.length === 2) {
        controlArray = [
            controlArray[0],
            midPoint(controlArray),
            controlArray[1],
        ];
    }

    const pointArray = [];

    for (let j = 0; j < controlArray.length - 2; j++) {
        const p0 =
            j === 0
                ? controlArray[j]
                : midPoint([controlArray[j], controlArray[j + 1]]);
        const p1 = controlArray[j + 1];
        const p2 =
            j === controlArray.length - 3
                ? controlArray[j + 2]
                : midPoint([controlArray[j + 1], controlArray[j + 2]]);

        const pl = 20;
        const jb = j === controlArray.length - 3 ? 1 : 0;

        for (let i = 0; i < pl + jb; i += 1) {
            const t = i / pl;
            const a0 = (1 - t) * (1 - t);
            const a1 = 2 * t * (1 - t);
            const a2 = t * t;
            const x = a0 * p0.x + a1 * p1.x + a2 * p2.x;
            const y = a0 * p0.y + a1 * p1.y + a2 * p2.y;
            pointArray.push(new Point(x, y));
        }
    }

    return pointArray;
}

/**
 * Create an SVG polyline from a list of points.
 * @param pointArray - The list of points.
 * @param xOffset - The x-axis offset.
 * @param yOffset - The y-axis offset.
 * @param fill - The fill color.
 * @param stroke - The stroke color.
 * @param strokeWidth - The stroke width.
 * @returns An SVG polyline.
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
