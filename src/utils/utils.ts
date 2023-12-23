import { midPoint } from "./polytools";
import { Point } from "../classes/Point";
import { Range } from "../classes/Range";
import { ISvgAttributes } from "../interfaces/ISvgAttributes";
import { ISvgStyles } from "../interfaces/ISvgStyles";

/**
 * Checks if a point is a local maximum within a circular area.
 * @param {Point} center - The center point to check.
 * @param {Function} getValue - The function to get the value at a given point.
 * @param {number} radius - The radius of the circular area.
 * @returns {boolean} True if the center point is a local maximum, false otherwise.
 */
export function isLocalMaximum(
    center: Point,
    getValue: Function,
    radius: number
): boolean {
    const centerValue = getValue(center);

    for (let x = center.x - radius; x <= center.x + radius; x++) {
        for (let y = center.y - radius; y <= center.y + radius; y++) {
            const neighborValue = getValue(new Point(x, y));

            if (centerValue < neighborValue) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Converts a camelCase string to kebab-case.
 * @param key - The input camelCase string.
 * @returns The converted kebab-case string.
 */
function camelToKebab(key: string): string {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.split(" ").join("-").toLowerCase();
}

/**
 * Converts a style attribute object to a string.
 * @param attr - The style attribute object.
 * @returns The string representation of the style attributes.
 */
function styleToString(attr: Partial<ISvgStyles>): string {
    const strlist = Object.entries(attr).map(
        ([key, value]) => `${camelToKebab(key)}:${value}`
    );
    return `${strlist.join(";")}`;
}

/**
 * Converts an attribute object to a string.
 * @param attr - The attribute object.
 * @returns The string representation of the attributes.
 */
export function attributesToString(attr: Partial<ISvgAttributes>): string {
    const strlist = Object.entries(attr).map(([key, value]) => {
        const vstr =
            key === "style" && attr.style ? styleToString(attr.style) : value;
        return `${camelToKebab(key)}='${vstr}'`;
    });
    return strlist.join(" ");
}

/**
 * Replace NaN points in a list with a new Point.
 * @param {Point[]} pointArray - The list of points.
 * @returns {Point[]} A new list with NaN points replaced.
 */
export function unNan(pointArray: Point[]): Point[] {
    return pointArray.map((p) => (p.isFinite() ? p : new Point()));
}

/**
 * Loop through a noise list, adjusting values and normalizing them.
 * @param {number[]} noiseArray - The noise list.
 * @returns {number[]} The normalized noise list.
 */
export function normalizeNoise(noiseArray: number[]): number[] {
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

    return noiseArray.map((value) => inputRange.mapValue(value, outputRange));
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
